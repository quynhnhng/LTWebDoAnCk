import sql from "../config/db.js";
import { createNotification } from "./notificationController.js";

// GET /api/admin/orders?search=&status=
//Lấy danh sách đơn hàng, hỗ trợ tìm kiếm theo tên/số điện thoại và lọc theo trạng thái.
export const getOrders = async (req, res) => {
  try {
    const { search = "", status = "" } = req.query;

    const result = await new sql.Request()
      .input("search", sql.NVarChar, `%${search}%`)
      .input("status", sql.NVarChar, status).query(`
        SELECT Id, CreatedAt, ReceiverName, ReceiverPhone, ShippingAddress, TotalPrice, Status, UserId
        FROM Orders
        WHERE (@search = '%%' OR ReceiverName LIKE @search OR ReceiverPhone LIKE @search)
          AND (@status = '' OR Status = @status)
        ORDER BY Id DESC
      `);

    res.json(result.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Loi khi lay don hang" });
  }
};

// GET /api/admin/orders/:id
//Lấy chi tiết một đơn hàng và danh sách sản phẩm thuộc đơn hàng đó.
export const getOrderById = async (req, res) => {
  try {
    const orderResult = await new sql.Request()
      .input("Id", sql.Int, req.params.id)
      .query("SELECT * FROM Orders WHERE Id = @Id");

    const itemsResult = await new sql.Request().input(
      "OrderId",
      sql.Int,
      req.params.id,
    ).query(`
        SELECT oi.*, p.Title, p.ImageUrl
        FROM OrderItems oi
        LEFT JOIN Products p ON oi.ProductId = p.Id
        WHERE oi.OrderId = @OrderId
      `);

    res.json({
      order: orderResult.recordset[0] || null,
      items: itemsResult.recordset,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Loi khi lay chi tiet don hang" });
  }
};

// PUT /api/admin/orders/:id/status
//Cập nhật trạng thái đơn hàng trong database và tự động tạo thông báo gửi tới khách hàng khi trạng thái thay đổi.
export const updateOrderStatus = async (req, res) => {
  try {
    const { Status } = req.body;
    const orderId = req.params.id;

    // Lấy thông tin đơn hàng để biết UserId
    const orderResult = await new sql.Request()
      .input("Id", sql.Int, orderId)
      .query("SELECT UserId, TotalPrice FROM Orders WHERE Id = @Id");

    await new sql.Request()
      .input("Id", sql.Int, orderId)
      .input("Status", sql.NVarChar, Status)
      .query("UPDATE Orders SET Status = @Status WHERE Id = @Id");

    // Tạo thông báo cho user khi trạng thái thay đổi
    const order = orderResult.recordset[0];
    if (order?.UserId) {
      const statusMessages = {
        "Đã xác nhận": { title: "✅ Đơn hàng đã xác nhận", type: "success" },
        "Đang giao": { title: "🚚 Đơn hàng đang được giao", type: "info" },
        "Hoàn thành": { title: "🎉 Đơn hàng hoàn thành", type: "success" },
        "Đã hủy": { title: "❌ Đơn hàng đã bị hủy", type: "error" },
      };

      const notif = statusMessages[Status];
      if (notif) {
        await createNotification({
          userId: order.UserId,
          title: notif.title,
          message: `Đơn hàng #${orderId} của bạn đã được cập nhật trạng thái: ${Status}.`,
          type: notif.type,
        });
      }
    }

    res.json({ message: "Da cap nhat trang thai" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Loi khi cap nhat trang thai" });
  }
};
