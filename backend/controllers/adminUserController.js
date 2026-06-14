import sql from "../config/db.js";

// GET /api/admin/users  — chỉ lấy role = 'user' (khách hàng)
export const getUsers = async (req, res) => {
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
};

// GET /api/admin/users/:id
export const getUserById = async (req, res) => {
  try {
    const result = await new sql.Request().input("Id", sql.Int, req.params.id)
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
};
