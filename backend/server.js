import express from "express";
import sql from "mssql";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Cấu hình kết nối SQL Server
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

// Kết nối database
sql
  .connect(dbConfig)
  .then(() => console.log("Đã kết nối thành công với SQL Server (PCShopDB)"))
  .catch((err) => console.error("Lỗi kết nối CSDL:", err));

// API Lấy danh sách sản phẩm
app.get("/api/products", async (req, res) => {
  try {
    const { category } = req.query; // Nhận trực tiếp chuỗi danh mục từ url query
    let query = `
      SELECT p.*, c.Name as CategoryName 
      FROM Products p
      LEFT JOIN Categories c ON p.CategoryId = c.Id
    `;

    if (category) {
      query += ` WHERE c.Name = N'${category}'`;
    }

    const result = await sql.query(query); //
    res.json(result.recordset); //
  } catch (error) {
    console.error(error); //
    res.status(500).json({ error: "Lỗi khi lấy dữ liệu sản phẩm" }); //
  }
});

// API Lấy danh sách các danh mục duy nhất từ bảng Products
app.get("/api/categories", async (req, res) => {
  try {
    // Truy vấn trực tiếp vào bảng Categories mới
    const result = await sql.query("SELECT Name FROM Categories");
    const categories = result.recordset.map((item) => item.Name);

    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi khi lấy danh mục" });
  }
});

// API Lưu đơn hàng khi thanh toán
app.post("/api/orders", async (req, res) => {
  try {
    // 1. Nhận thêm dữ liệu người nhận từ Frontend gửi lên
    const { items, totalPrice, receiverName, receiverPhone, shippingAddress } =
      req.body;

    // (Tùy chọn) Kiểm tra nếu Frontend gửi thiếu thông tin
    if (!receiverName || !receiverPhone || !shippingAddress) {
      return res
        .status(400)
        .json({ error: "Vui lòng nhập đầy đủ thông tin giao hàng!" });
    }

    const transaction = new sql.Transaction();
    await transaction.begin();

    try {
      const request = new sql.Request(transaction);

      // 2. Lưu đầy đủ thông tin vào bảng Orders
      const orderResult = await request
        .input("totalPrice", sql.Int, totalPrice)
        .input("receiverName", sql.NVarChar, receiverName)
        .input("receiverPhone", sql.VarChar, receiverPhone)
        .input("shippingAddress", sql.NVarChar, shippingAddress)
        .query(
          `INSERT INTO Orders (TotalPrice, ReceiverName, ReceiverPhone, ShippingAddress) 
           OUTPUT INSERTED.Id 
           VALUES (@totalPrice, @receiverName, @receiverPhone, @shippingAddress)`,
        );

      const orderId = orderResult.recordset[0].Id;

      // Dùng vòng lặp lưu từng món hàng vào bảng OrderItems
      for (let item of items) {
        const itemRequest = new sql.Request(transaction);
        await itemRequest
          .input("orderId", sql.Int, orderId)
          .input("productId", sql.Int, item.id)
          .input("quantity", sql.Int, item.quantity)
          .input("price", sql.Int, item.price)
          .query(
            "INSERT INTO OrderItems (OrderId, ProductId, Quantity, Price) VALUES (@orderId, @productId, @quantity, @price)",
          );
      }

      await transaction.commit();
      res
        .status(201)
        .json({ message: "Thanh toán thành công!", orderId: orderId });
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  } catch (error) {
    console.error("Lỗi chi tiết khi thanh toán:", error);
    res.status(500).json({ error: "Lỗi khi thanh toán đơn hàng" });
  }
});

// Khởi động server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server Backend đang chạy tại http://localhost:${PORT}`);
});
