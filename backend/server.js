import express from "express";
import sql from "mssql";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

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

sql
  .connect(dbConfig)
  .then(() => console.log("Da ket noi thanh cong voi SQL Server (PCShopDB)"))
  .catch((err) => console.error("Loi ket noi CSDL:", err));

const toNumberOrNull = (value) => {
  if (value === "" || value === undefined || value === null) return null;
  return Number(value);
};

// =========================
// API SHOP
// =========================

app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Vui long nhap username va password" });
    }

    const result = await new sql.Request()
      .input("username", sql.VarChar, username)
      .input("password", sql.VarChar, password)
      .query(`
        SELECT u.Id, u.Username, u.FullName, u.Email, u.Phone, u.Address, u.Status, r.Name AS Role
        FROM Users u
        JOIN Roles r ON u.RoleId = r.Id
        WHERE u.Username = @username AND u.Password = @password
      `);

    if (result.recordset.length === 0) {
      return res.status(401).json({ error: "Sai tai khoan hoac mat khau" });
    }

    const user = result.recordset[0];
    if (user.Status !== "active") {
      return res.status(403).json({ error: "Tai khoan dang bi khoa" });
    }

    res.json({ message: "Dang nhap thanh cong", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Loi dang nhap" });
  }
});

app.get("/api/products", async (req, res) => {
  try {
    const { category } = req.query;
    const request = new sql.Request();
    let query = `
      SELECT p.*, c.Name as CategoryName
      FROM Products p
      LEFT JOIN Categories c ON p.CategoryId = c.Id
    `;

    if (category) {
      request.input("category", sql.NVarChar, category);
      query += " WHERE c.Name = @category";
    }

    query += " ORDER BY p.Id DESC";
    const result = await request.query(query);
    res.json(result.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Loi khi lay du lieu san pham" });
  }
});

app.get("/api/categories", async (req, res) => {
  try {
    const result = await sql.query("SELECT Name FROM Categories ORDER BY Id");
    const categories = result.recordset.map((item) => item.Name);
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Loi khi lay danh muc" });
  }
});

app.post("/api/orders", async (req, res) => {
  try {
    const { items, totalPrice, receiverName, receiverPhone, shippingAddress } =
      req.body;

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
        .input("totalPrice", sql.Int, totalPrice)
        .input("receiverName", sql.NVarChar, receiverName)
        .input("receiverPhone", sql.VarChar, receiverPhone)
        .input("shippingAddress", sql.NVarChar, shippingAddress)
        .query(`
          INSERT INTO Orders (TotalPrice, ReceiverName, ReceiverPhone, ShippingAddress)
          OUTPUT INSERTED.Id
          VALUES (@totalPrice, @receiverName, @receiverPhone, @shippingAddress)
        `);

      const orderId = orderResult.recordset[0].Id;

      for (let item of items) {
        const itemRequest = new sql.Request(transaction);
        await itemRequest
          .input("orderId", sql.Int, orderId)
          .input("productId", sql.Int, item.id)
          .input("quantity", sql.Int, item.quantity)
          .input("price", sql.Int, item.price)
          .query(`
            INSERT INTO OrderItems (OrderId, ProductId, Quantity, Price)
            VALUES (@orderId, @productId, @quantity, @price)
          `);
      }

      await transaction.commit();
      res.status(201).json({ message: "Thanh toan thanh cong!", orderId });
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  } catch (error) {
    console.error("Loi chi tiet khi thanh toan:", error);
    res.status(500).json({ error: "Loi khi thanh toan don hang" });
  }
});

// =========================
// API ADMIN
// =========================

app.get("/api/admin/dashboard", async (req, res) => {
  try {
    const result = await sql.query(`
      SELECT
        (SELECT ISNULL(SUM(TotalPrice), 0) FROM Orders WHERE Status = N'Hoàn thành') AS totalRevenue,
        (SELECT COUNT(*) FROM Orders) AS orderCount,
        (SELECT COUNT(*) FROM Products) AS productCount,
        (SELECT COUNT(*) FROM Users u JOIN Roles r ON u.RoleId = r.Id WHERE r.Name = 'user') AS customerCount
    `);

    res.json(result.recordset[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Loi khi lay dashboard" });
  }
});

app.get("/api/admin/products", async (req, res) => {
  try {
    const { search = "", category = "" } = req.query;
    const request = new sql.Request()
      .input("search", sql.NVarChar, `%${search}%`)
      .input("category", sql.Int, toNumberOrNull(category));

    const result = await request.query(`
      SELECT p.*, c.Name AS CategoryName
      FROM Products p
      LEFT JOIN Categories c ON p.CategoryId = c.Id
      WHERE (@search = '%%' OR p.Title LIKE @search)
        AND (@category IS NULL OR p.CategoryId = @category)
      ORDER BY p.Id DESC
    `);

    res.json(result.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Loi khi lay san pham" });
  }
});

app.post("/api/admin/products", async (req, res) => {
  try {
    const { CategoryId, Title, Price, PromoPrice, Description, ImageUrl } = req.body;

    await new sql.Request()
      .input("CategoryId", sql.Int, CategoryId)
      .input("Title", sql.NVarChar, Title)
      .input("Price", sql.Int, Price)
      .input("PromoPrice", sql.Int, toNumberOrNull(PromoPrice))
      .input("Description", sql.NVarChar, Description || "")
      .input("ImageUrl", sql.VarChar, ImageUrl || "")
      .query(`
        INSERT INTO Products (CategoryId, Title, Price, PromoPrice, Description, ImageUrl)
        VALUES (@CategoryId, @Title, @Price, @PromoPrice, @Description, @ImageUrl)
      `);

    res.status(201).json({ message: "Da them san pham" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Loi khi them san pham" });
  }
});

app.put("/api/admin/products/:id", async (req, res) => {
  try {
    const { CategoryId, Title, Price, PromoPrice, Description, ImageUrl } = req.body;

    await new sql.Request()
      .input("Id", sql.Int, req.params.id)
      .input("CategoryId", sql.Int, CategoryId)
      .input("Title", sql.NVarChar, Title)
      .input("Price", sql.Int, Price)
      .input("PromoPrice", sql.Int, toNumberOrNull(PromoPrice))
      .input("Description", sql.NVarChar, Description || "")
      .input("ImageUrl", sql.VarChar, ImageUrl || "")
      .query(`
        UPDATE Products
        SET CategoryId = @CategoryId,
            Title = @Title,
            Price = @Price,
            PromoPrice = @PromoPrice,
            Description = @Description,
            ImageUrl = @ImageUrl
        WHERE Id = @Id
      `);

    res.json({ message: "Da cap nhat san pham" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Loi khi sua san pham" });
  }
});

app.delete("/api/admin/products/:id", async (req, res) => {
  try {
    await new sql.Request()
      .input("Id", sql.Int, req.params.id)
      .query("DELETE FROM Products WHERE Id = @Id");

    res.json({ message: "Da xoa san pham" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Khong the xoa san pham da co trong don hang" });
  }
});

app.get("/api/admin/categories", async (req, res) => {
  try {
    const result = await sql.query("SELECT * FROM Categories ORDER BY Id DESC");
    res.json(result.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Loi khi lay danh muc" });
  }
});

app.post("/api/admin/categories", async (req, res) => {
  try {
    await new sql.Request()
      .input("Name", sql.NVarChar, req.body.Name)
      .query("INSERT INTO Categories (Name) VALUES (@Name)");

    res.status(201).json({ message: "Da them danh muc" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Loi khi them danh muc" });
  }
});

app.put("/api/admin/categories/:id", async (req, res) => {
  try {
    await new sql.Request()
      .input("Id", sql.Int, req.params.id)
      .input("Name", sql.NVarChar, req.body.Name)
      .query("UPDATE Categories SET Name = @Name WHERE Id = @Id");

    res.json({ message: "Da sua danh muc" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Loi khi sua danh muc" });
  }
});

app.delete("/api/admin/categories/:id", async (req, res) => {
  try {
    await new sql.Request()
      .input("Id", sql.Int, req.params.id)
      .query("DELETE FROM Categories WHERE Id = @Id");

    res.json({ message: "Da xoa danh muc" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Khong the xoa danh muc dang co san pham" });
  }
});

app.get("/api/admin/users", async (req, res) => {
  try {
    const result = await sql.query(`
      SELECT u.Id, u.Username, u.FullName, u.Email, u.Phone, u.Address, u.Status
      FROM Users u
      JOIN Roles r ON u.RoleId = r.Id
      WHERE r.Name = 'user'
      ORDER BY u.Id DESC
    `);

    res.json(result.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Loi khi lay khach hang" });
  }
});

app.get("/api/admin/users/:id", async (req, res) => {
  try {
    const result = await new sql.Request()
      .input("Id", sql.Int, req.params.id)
      .query(`
        SELECT u.Id, u.Username, u.FullName, u.Email, u.Phone, u.Address, u.Status
        FROM Users u
        JOIN Roles r ON u.RoleId = r.Id
        WHERE u.Id = @Id AND r.Name = 'user'
      `);

    res.json(result.recordset[0] || null);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Loi khi lay chi tiet khach hang" });
  }
});

app.get("/api/admin/orders", async (req, res) => {
  try {
    const { search = "", status = "" } = req.query;
    const result = await new sql.Request()
      .input("search", sql.NVarChar, `%${search}%`)
      .input("status", sql.NVarChar, status)
      .query(`
        SELECT Id, CreatedAt, ReceiverName, ReceiverPhone, ShippingAddress, TotalPrice, Status
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
});

app.get("/api/admin/orders/:id", async (req, res) => {
  try {
    const orderResult = await new sql.Request()
      .input("Id", sql.Int, req.params.id)
      .query("SELECT * FROM Orders WHERE Id = @Id");

    const itemsResult = await new sql.Request()
      .input("OrderId", sql.Int, req.params.id)
      .query(`
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
});

app.put("/api/admin/orders/:id/status", async (req, res) => {
  try {
    await new sql.Request()
      .input("Id", sql.Int, req.params.id)
      .input("Status", sql.NVarChar, req.body.Status)
      .query("UPDATE Orders SET Status = @Status WHERE Id = @Id");

    res.json({ message: "Da cap nhat trang thai" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Loi khi cap nhat trang thai" });
  }
});

app.get("/api/admin/admins", async (req, res) => {
  try {
    const result = await sql.query(`
      SELECT u.Id, u.Username, u.FullName, u.Email, u.Phone, u.Address, u.Status
      FROM Users u
      JOIN Roles r ON u.RoleId = r.Id
      WHERE r.Name = 'admin'
      ORDER BY u.Id DESC
    `);

    res.json(result.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Loi khi lay admin" });
  }
});

app.post("/api/admin/admins", async (req, res) => {
  try {
    const { Username, Password, FullName, Email, Phone, Address, Status } = req.body;

    await new sql.Request()
      .input("Username", sql.VarChar, Username)
      .input("Password", sql.VarChar, Password)
      .input("FullName", sql.NVarChar, FullName)
      .input("Email", sql.VarChar, Email || "")
      .input("Phone", sql.VarChar, Phone || "")
      .input("Address", sql.NVarChar, Address || "")
      .input("Status", sql.VarChar, Status || "active")
      .query(`
        INSERT INTO Users (Username, Password, FullName, Email, Phone, Address, RoleId, Status)
        VALUES (@Username, @Password, @FullName, @Email, @Phone, @Address,
          (SELECT Id FROM Roles WHERE Name = 'admin'), @Status)
      `);

    res.status(201).json({ message: "Da them admin" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Loi khi them admin hoac username da ton tai" });
  }
});

app.put("/api/admin/admins/:id", async (req, res) => {
  try {
    const { FullName, Email, Phone, Address, Status } = req.body;

    await new sql.Request()
      .input("Id", sql.Int, req.params.id)
      .input("FullName", sql.NVarChar, FullName)
      .input("Email", sql.VarChar, Email || "")
      .input("Phone", sql.VarChar, Phone || "")
      .input("Address", sql.NVarChar, Address || "")
      .input("Status", sql.VarChar, Status || "active")
      .query(`
        UPDATE Users
        SET FullName = @FullName, Email = @Email, Phone = @Phone,
            Address = @Address, Status = @Status
        WHERE Id = @Id
      `);

    res.json({ message: "Da sua admin" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Loi khi sua admin" });
  }
});

app.put("/api/admin/admins/:id/password", async (req, res) => {
  try {
    await new sql.Request()
      .input("Id", sql.Int, req.params.id)
      .input("Password", sql.VarChar, req.body.Password)
      .query("UPDATE Users SET Password = @Password WHERE Id = @Id");

    res.json({ message: "Da doi mat khau" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Loi khi doi mat khau" });
  }
});

app.delete("/api/admin/admins/:id", async (req, res) => {
  try {
    await new sql.Request()
      .input("Id", sql.Int, req.params.id)
      .query("DELETE FROM Users WHERE Id = @Id");

    res.json({ message: "Da xoa admin" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Loi khi xoa admin" });
  }
});

app.get("/api/admin/statistics", async (req, res) => {
  try {
    const byDay = await sql.query(`
      SELECT CONVERT(VARCHAR(10), CreatedAt, 120) AS Label, SUM(TotalPrice) AS Revenue, COUNT(*) AS OrderCount
      FROM Orders
      WHERE Status = N'Hoàn thành'
      GROUP BY CONVERT(VARCHAR(10), CreatedAt, 120)
      ORDER BY Label DESC
    `);

    const byWeek = await sql.query(`
      SELECT CONCAT(YEAR(CreatedAt), '-W', DATEPART(WEEK, CreatedAt)) AS Label,
             SUM(TotalPrice) AS Revenue, COUNT(*) AS OrderCount
      FROM Orders
      WHERE Status = N'Hoàn thành'
      GROUP BY YEAR(CreatedAt), DATEPART(WEEK, CreatedAt)
      ORDER BY MIN(CreatedAt) DESC
    `);

    const byMonth = await sql.query(`
      SELECT CONVERT(VARCHAR(7), CreatedAt, 120) AS Label, SUM(TotalPrice) AS Revenue, COUNT(*) AS OrderCount
      FROM Orders
      WHERE Status = N'Hoàn thành'
      GROUP BY CONVERT(VARCHAR(7), CreatedAt, 120)
      ORDER BY Label DESC
    `);

    res.json({
      byDay: byDay.recordset,
      byWeek: byWeek.recordset,
      byMonth: byMonth.recordset,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Loi khi lay thong ke" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server Backend dang chay tai http://localhost:${PORT}`);
});
