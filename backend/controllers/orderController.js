import sql from "../config/db.js";
import { createNotification } from "./notificationController.js";

// POST /api/orders
// frontend/src/pages/Cart.jsx
/*
Dùng để xử lý thanh toán và tạo đơn hàng. 
Hệ thống nhận thông tin giao hàng và danh sách sản phẩm từ giỏ hàng, 
  tạo bản ghi trong bảng Orders, 
  thêm các sản phẩm vào bảng OrderItems, 
  sử dụng Transaction để đảm bảo tính toàn vẹn dữ liệu, 
  sau đó tạo thông báo cho khách hàng và trả về mã đơn hàng vừa tạo.
*/
export const createOrder = async (req, res) => {
  try {
    const {
      items,
      totalPrice,
      receiverName,
      receiverPhone,
      shippingAddress,
      userId,
    } = req.body;

    if (!receiverName || !receiverPhone || !shippingAddress) {
      return res
        .status(400)
        .json({ error: "Vui long nhap day du thong tin giao hang!" });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "Gio hang dang trong" });
    }

    const transaction = new sql.Transaction();
    await transaction.begin();

    try {
      const request = new sql.Request(transaction);

      const orderResult = await request
        .input("userId", sql.Int, userId || null)
        .input("totalPrice", sql.Int, totalPrice)
        .input("receiverName", sql.NVarChar, receiverName)
        .input("receiverPhone", sql.VarChar, receiverPhone)
        .input("shippingAddress", sql.NVarChar, shippingAddress).query(`
          INSERT INTO Orders (UserId, TotalPrice, ReceiverName, ReceiverPhone, ShippingAddress)
          OUTPUT INSERTED.Id
          VALUES (@userId, @totalPrice, @receiverName, @receiverPhone, @shippingAddress)
        `);

      const orderId = orderResult.recordset[0].Id;

      for (let item of items) {
        const itemRequest = new sql.Request(transaction);
        await itemRequest
          .input("orderId", sql.Int, orderId)
          .input("productId", sql.Int, item.id)
          .input("quantity", sql.Int, item.quantity)
          .input("price", sql.Int, item.price).query(`
            INSERT INTO OrderItems (OrderId, ProductId, Quantity, Price)
            VALUES (@orderId, @productId, @quantity, @price)
          `);
      }

      await transaction.commit();

      // Tạo thông báo cho user sau khi đặt hàng thành công
      if (userId) {
        await createNotification({
          userId,
          title: "🎉 Đặt hàng thành công",
          message: `Đơn hàng #${orderId} của bạn đã được xác nhận. Tổng tiền: ${totalPrice.toLocaleString("vi-VN")}₫. Chúng tôi sẽ sớm liên hệ với bạn!`,
          type: "success",
        });
      }

      res.status(201).json({ message: "Thanh toan thanh cong!", orderId });
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  } catch (error) {
    console.error("Loi chi tiet khi thanh toan:", error);
    res.status(500).json({ error: "Loi khi thanh toan don hang" });
  }
};
