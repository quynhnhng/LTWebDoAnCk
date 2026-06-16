import sql from "../config/db.js";
import nodemailer from "nodemailer";
import crypto from "crypto";

// Tạo transporter Gmail
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
};

// POST /api/forgot-password
// Body: { email }
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Vui lòng nhập địa chỉ email" });
    }

    // Kiểm tra email có tồn tại trong DB không
    const result = await new sql.Request().input("email", sql.VarChar, email)
      .query(`
        SELECT Id, Username, FullName, Email
        FROM Users
        WHERE Email = @email AND Status = 'active'
      `);

    if (result.recordset.length === 0) {
      // Không tiết lộ email có tồn tại hay không (bảo mật)
      return res.json({
        message:
          "Nếu email tồn tại trong hệ thống, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu.",
      });
    }

    const user = result.recordset[0];

    // Tạo token ngẫu nhiên (32 bytes hex = 64 ký tự)
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetExpires = new Date(Date.now() + 30 * 60 * 1000); // Hết hạn sau 30 phút

    // Lưu token vào DB (cần bảng PasswordResets hoặc cột trong Users)
    // Dùng cột ResetToken và ResetExpires trong Users
    await new sql.Request()
      .input("Id", sql.Int, user.Id)
      .input("ResetToken", sql.VarChar, resetToken)
      .input("ResetExpires", sql.DateTime, resetExpires).query(`
        UPDATE Users
        SET ResetToken = @ResetToken, ResetExpires = @ResetExpires
        WHERE Id = @Id
      `);

    // Tạo link reset
    const resetLink = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password?token=${resetToken}`;

    // Gửi email
    const transporter = createTransporter();

    const mailOptions = {
      from: `"PC Shop" <${process.env.GMAIL_USER}>`,
      to: user.Email,
      subject: "🔐 Đặt lại mật khẩu - PC Shop",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
            .header { background: #c30909; padding: 30px; text-align: center; }
            .header h1 { color: white; margin: 0; font-size: 24px; }
            .body { padding: 40px 30px; }
            .body p { color: #444; line-height: 1.6; font-size: 15px; }
            .btn { display: inline-block; background: #c30909; color: white !important; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; margin: 20px 0; }
            .warning { background: #fff8e1; border-left: 4px solid #ffc107; padding: 12px 16px; border-radius: 4px; color: #666; font-size: 13px; margin-top: 20px; }
            .footer { background: #f8f8f8; padding: 20px 30px; text-align: center; color: #999; font-size: 12px; border-top: 1px solid #eee; }
            .divider { border: none; border-top: 1px solid #eee; margin: 24px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🛒 PC Shop</h1>
            </div>
            <div class="body">
              <p>Xin chào <strong>${user.FullName}</strong>,</p>
              <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản <strong>${user.Username}</strong> liên kết với email này.</p>
              <p>Nhấn vào nút bên dưới để đặt lại mật khẩu của bạn:</p>
              <div style="text-align: center;">
                <a href="${resetLink}" class="btn">🔑 Đặt lại mật khẩu</a>
              </div>
              <hr class="divider">
              <p style="font-size: 13px; color: #666;">Hoặc copy link sau vào trình duyệt:</p>
              <p style="font-size: 12px; color: #999; word-break: break-all; background: #f5f5f5; padding: 10px; border-radius: 4px;">${resetLink}</p>
              <div class="warning">
                ⚠️ <strong>Lưu ý:</strong>
                <ul style="margin: 8px 0 0 0; padding-left: 20px;">
                  <li>Link này chỉ có hiệu lực trong <strong>30 phút</strong></li>
                  <li>Nếu bạn không yêu cầu đặt lại mật khẩu, hãy bỏ qua email này</li>
                  <li>Tài khoản của bạn vẫn an toàn</li>
                </ul>
              </div>
            </div>
            <div class="footer">
              <p>© 2026 PC Shop. Hotline: 123-456-7890</p>
              <p>Email này được gửi tự động, vui lòng không trả lời.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({
      message:
        "Nếu email tồn tại trong hệ thống, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu.",
    });
  } catch (error) {
    console.error("Lỗi gửi email:", error);
    res
      .status(500)
      .json({ error: "Không thể gửi email. Vui lòng thử lại sau." });
  }
};

// POST /api/reset-password
// Body: { token, newPassword }
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ error: "Thiếu thông tin cần thiết" });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ error: "Mật khẩu phải có ít nhất 6 ký tự" });
    }

    // Tìm user có token hợp lệ và chưa hết hạn
    const result = await new sql.Request()
      .input("ResetToken", sql.VarChar, token)
      .input("Now", sql.DateTime, new Date()).query(`
        SELECT Id, Username, FullName
        FROM Users
        WHERE ResetToken = @ResetToken AND ResetExpires > @Now
      `);

    if (result.recordset.length === 0) {
      return res.status(400).json({
        error:
          "Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu lại.",
      });
    }

    const user = result.recordset[0];

    // Cập nhật mật khẩu mới và xóa token
    await new sql.Request()
      .input("Id", sql.Int, user.Id)
      .input("Password", sql.VarChar, newPassword).query(`
        UPDATE Users
        SET Password = @Password, ResetToken = NULL, ResetExpires = NULL
        WHERE Id = @Id
      `);

    res.json({ message: "Đặt lại mật khẩu thành công! Vui lòng đăng nhập." });
  } catch (error) {
    console.error("Lỗi reset mật khẩu:", error);
    res.status(500).json({ error: "Lỗi khi đặt lại mật khẩu" });
  }
};

// GET /api/verify-reset-token?token=xxx
// Kiểm tra token còn hợp lệ không (để frontend hiển thị form)
export const verifyResetToken = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ valid: false, error: "Thiếu token" });
    }

    const result = await new sql.Request()
      .input("ResetToken", sql.VarChar, token)
      .input("Now", sql.DateTime, new Date()).query(`
        SELECT Id FROM Users
        WHERE ResetToken = @ResetToken AND ResetExpires > @Now
      `);

    if (result.recordset.length === 0) {
      return res.json({
        valid: false,
        error: "Token không hợp lệ hoặc đã hết hạn",
      });
    }

    res.json({ valid: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ valid: false, error: "Lỗi server" });
  }
};
