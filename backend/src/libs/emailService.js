import nodemailer from "nodemailer";

/**
 * Tạo transporter cho nodemailer
 * Sử dụng Gmail SMTP service
 * 
 * IMPORTANT: Method name là "createTransport" KHÔNG PHẢI "createTransporter"
 * Đây là official API của nodemailer: https://nodemailer.com/about/
 */
const createTransporter = () => {
  return nodemailer.createTransport({  // ← createTransport (không có "er")
    service: process.env.EMAIL_SERVICE || "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

/**
 * Gửi email reset password
 * @param {string} email - Email người nhận
 * @param {string} resetToken - Token để reset password
 * @returns {Promise<void>}
 */
export const sendPasswordResetEmail = async (email, resetToken) => {
  try {
    const transporter = createTransporter();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const mailOptions = {
      from: `"QuickChat Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "QuickChat - Khôi phục mật khẩu",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .content {
              background: #f9f9f9;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .button {
              display: inline-block;
              padding: 12px 30px;
              background: #667eea;
              color: white;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              color: #666;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>QuickChat</h1>
              <p>Khôi phục mật khẩu</p>
            </div>
            <div class="content">
              <p>Xin chào,</p>
              <p>Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản QuickChat của mình.</p>
              <p>Nhấn vào nút bên dưới để tiếp tục:</p>
              <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Đặt lại mật khẩu</a>
              </div>
              <p>Hoặc copy link sau vào trình duyệt:</p>
              <p style="word-break: break-all; color: #667eea;">${resetUrl}</p>
              <p><strong>Link này sẽ hết hạn sau 1 giờ.</strong></p>
              <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này. Mật khẩu của bạn sẽ không thay đổi.</p>
            </div>
            <div class="footer">
              <p>Trân trọng,<br>QuickChat Team</p>
              <p>Email này được gửi tự động, vui lòng không reply.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Password reset email sent to ${email}`);
  } catch (error) {
    console.error("❌ Error sending password reset email:", error);
    throw new Error("Không thể gửi email. Vui lòng thử lại sau.");
  }
};

/**
 * Gửi email thông báo password đã được thay đổi
 * @param {string} email - Email người nhận
 * @returns {Promise<void>}
 */
export const sendPasswordChangedEmail = async (email) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"QuickChat Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "QuickChat - Mật khẩu đã được thay đổi",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .content {
              background: #f9f9f9;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              color: #666;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>QuickChat</h1>
              <p>Thông báo bảo mật</p>
            </div>
            <div class="content">
              <p>Xin chào,</p>
              <p>Mật khẩu cho tài khoản QuickChat của bạn vừa được thay đổi thành công.</p>
              <p>Nếu bạn không thực hiện thay đổi này, vui lòng liên hệ với chúng tôi ngay lập tức.</p>
              <p>Thời gian: ${new Date().toLocaleString("vi-VN")}</p>
            </div>
            <div class="footer">
              <p>Trân trọng,<br>QuickChat Team</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Password changed notification sent to ${email}`);
  } catch (error) {
    console.error("❌ Error sending password changed email:", error);
    // Không throw error vì đây chỉ là notification
  }
};
