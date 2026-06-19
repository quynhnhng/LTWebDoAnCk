import sql from "../config/db.js";

// POST /api/login
// frontend/src/components/Layout/LoginModal.jsx
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
// frontend/src/components/Layout/LoginModal.jsx
export const register = async (req, res) => {
  try {
    const { username, password, fullName, email, phone, address } = req.body;

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
      .input("phone", sql.VarChar, phone || "")
      .input("address", sql.NVarChar, address || "").query(`
        INSERT INTO Users (Username, Password, FullName, Email, Phone, Address, RoleId, Status)
        VALUES (@username, @password, @fullName, @email, @phone, @address,
          (SELECT Id FROM Roles WHERE Name = 'user'), 'active')
      `);

    res.status(201).json({ message: "Đăng ký thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi khi đăng ký tài khoản" });
  }
};

// PUT /api/update-profile
// frontend/src/components/Layout/Header.jsx
export const updateProfile = async (req, res) => {
  try {
    const { id, fullName, email, phone, address } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Thiếu thông tin người dùng" });
    }

    await new sql.Request()
      .input("Id", sql.Int, id)
      .input("FullName", sql.NVarChar, fullName || "")
      .input("Email", sql.VarChar, email || "")
      .input("Phone", sql.VarChar, phone || "")
      .input("Address", sql.NVarChar, address || "").query(`
        UPDATE Users
        SET FullName = @FullName,
            Email    = @Email,
            Phone    = @Phone,
            Address  = @Address
        WHERE Id = @Id
      `);

    // Return updated user data
    const result = await new sql.Request().input("Id", sql.Int, id).query(`
        SELECT u.Id, u.Username, u.FullName, u.Email, u.Phone, u.Address, u.Status, r.Name AS Role
        FROM Users u
        JOIN Roles r ON u.RoleId = r.Id
        WHERE u.Id = @Id
      `);

    const updatedUser = result.recordset[0];
    res.json({ message: "Cập nhật thành công", user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi khi cập nhật thông tin" });
  }
};
