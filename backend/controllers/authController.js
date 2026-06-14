import sql from "../config/db.js";

// POST /api/login
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Vui long nhap username va password" });
    }

    const result = await new sql.Request()
      .input("username", sql.VarChar, username)
      .input("password", sql.VarChar, password).query(`
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
};

// POST /api/register
export const register = async (req, res) => {
  try {
    const { username, password, fullName, email, phone } = req.body;

    if (!username || !password || !fullName) {
      return res
        .status(400)
        .json({ error: "Vui lòng nhập đầy đủ thông tin bắt buộc" });
    }

    // Kiểm tra username đã tồn tại chưa
    const check = await new sql.Request()
      .input("username", sql.VarChar, username)
      .query("SELECT Id FROM Users WHERE Username = @username");

    if (check.recordset.length > 0) {
      return res.status(400).json({ error: "Tên tài khoản đã tồn tại" });
    }

    await new sql.Request()
      .input("username", sql.VarChar, username)
      .input("password", sql.VarChar, password)
      .input("fullName", sql.NVarChar, fullName)
      .input("email", sql.VarChar, email || "")
      .input("phone", sql.VarChar, phone || "").query(`
        INSERT INTO Users (Username, Password, FullName, Email, Phone, RoleId, Status)
        VALUES (@username, @password, @fullName, @email, @phone,
          (SELECT Id FROM Roles WHERE Name = 'user'), 'active')
      `);

    res.status(201).json({ message: "Đăng ký thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi khi đăng ký tài khoản" });
  }
};
