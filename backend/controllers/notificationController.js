import sql from "../config/db.js";

// GET /api/notifications?userId=<id>
// Lấy thông báo của user (cả thông báo chung userId=NULL và thông báo riêng)
//Header.jsx
export const getNotifications = async (req, res) => {
  try {
    const { userId } = req.query;

    const result = await new sql.Request().input(
      "userId",
      sql.Int,
      userId || null,
    ).query(`
        SELECT TOP 20 *
        FROM Notifications
        WHERE UserId = @userId OR UserId IS NULL
        ORDER BY CreatedAt DESC
      `);

    res.json(result.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi khi lấy thông báo" });
  }
};

// PUT /api/notifications/read-all?userId=<id>
// Đánh dấu tất cả là đã đọc
//Header.jsx
export const markAllRead = async (req, res) => {
  try {
    const { userId } = req.query;

    await new sql.Request().input("userId", sql.Int, userId || null).query(`
        UPDATE Notifications
        SET IsRead = 1
        WHERE UserId = @userId OR UserId IS NULL
      `);

    res.json({ message: "Đã đánh dấu tất cả là đã đọc" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi khi cập nhật thông báo" });
  }
};

// POST /api/notifications  (internal - backend tự gọi khi có sự kiện)
//orderController.js và adminOrderController.js gọi
export const createNotification = async ({
  userId,
  title,
  message,
  type = "info",
}) => {
  try {
    await new sql.Request()
      .input("userId", sql.Int, userId || null)
      .input("title", sql.NVarChar, title)
      .input("message", sql.NVarChar, message)
      .input("type", sql.VarChar, type).query(`
        INSERT INTO Notifications (UserId, Title, Message, Type)
        VALUES (@userId, @title, @message, @type)
      `);
  } catch (error) {
    console.error("Lỗi tạo thông báo:", error);
  }
};
