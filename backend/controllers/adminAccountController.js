import sql from "../config/db.js";

// PUT /api/admin/accounts/:id/status
// Body: { Role: "admin"|"user", Status: "active"|"locked" }
// Dùng chung cho cả user lẫn admin (AccountsPage.jsx gọi endpoint này)
export const updateAccountStatus = async (req, res) => {
  try {
    const { Role, Status } = req.body;

    if (!["active", "locked", "banned"].includes(Status)) {
      return res.status(400).json({ error: "Trang thai khong hop le" });
    }

    // Không cho phép khoá chính mình (tùy chọn mở rộng)
    await new sql.Request()
      .input("Id", sql.Int, req.params.id)
      .input("Status", sql.VarChar, Status)
      .query("UPDATE Users SET Status = @Status WHERE Id = @Id");

    res.json({ message: `Da cap nhat trang thai tai khoan thanh ${Status}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Loi khi cap nhat trang thai tai khoan" });
  }
};
