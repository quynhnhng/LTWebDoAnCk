import sql from "../config/db.js";

// GET /api/admin/admins
export const getAdmins = async (req, res) => {
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
};

// POST /api/admin/admins
export const createAdmin = async (req, res) => {
  try {
    const { Username, Password, FullName, Email, Phone, Address, Status } =
      req.body;

    await new sql.Request()
      .input("Username", sql.VarChar, Username)
      .input("Password", sql.VarChar, Password)
      .input("FullName", sql.NVarChar, FullName)
      .input("Email", sql.VarChar, Email || "")
      .input("Phone", sql.VarChar, Phone || "")
      .input("Address", sql.NVarChar, Address || "")
      .input("Status", sql.VarChar, Status || "active").query(`
        INSERT INTO Users (Username, Password, FullName, Email, Phone, Address, RoleId, Status)
        VALUES (@Username, @Password, @FullName, @Email, @Phone, @Address,
          (SELECT Id FROM Roles WHERE Name = 'admin'), @Status)
      `);

    res.status(201).json({ message: "Da them admin" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Loi khi them admin hoac username da ton tai" });
  }
};

// PUT /api/admin/admins/:id
export const updateAdmin = async (req, res) => {
  try {
    const { FullName, Email, Phone, Address, Status } = req.body;

    await new sql.Request()
      .input("Id", sql.Int, req.params.id)
      .input("FullName", sql.NVarChar, FullName)
      .input("Email", sql.VarChar, Email || "")
      .input("Phone", sql.VarChar, Phone || "")
      .input("Address", sql.NVarChar, Address || "")
      .input("Status", sql.VarChar, Status || "active").query(`
        UPDATE Users
        SET FullName = @FullName,
            Email    = @Email,
            Phone    = @Phone,
            Address  = @Address,
            Status   = @Status
        WHERE Id = @Id
      `);

    res.json({ message: "Da sua admin" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Loi khi sua admin" });
  }
};

// PUT /api/admin/admins/:id/password
export const updateAdminPassword = async (req, res) => {
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
};

// DELETE /api/admin/admins/:id
export const deleteAdmin = async (req, res) => {
  try {
    await new sql.Request()
      .input("Id", sql.Int, req.params.id)
      .query("DELETE FROM Users WHERE Id = @Id");

    res.json({ message: "Da xoa admin" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Loi khi xoa admin" });
  }
};
