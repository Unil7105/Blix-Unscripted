import { transporter } from "./email.config.js";

export const SendResetPasswordEmail = async (email, resetLink) => {
       const emailTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Reset Your Password</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          margin: 0;
          padding: 0;
          background-color: #f6f6f6;
          font-family: Arial, sans-serif;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #ffffff;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0,0,0,0.05);
        }
        .header {
          text-align: center;
          font-size: 24px;
          font-weight: bold;
          color: #333;
        }
        .message {
          margin-top: 20px;
          font-size: 16px;
          color: #555;
        }
        .button {
          margin: 30px 0;
          text-align: center;
        }
        .button a {
          background-color: #1E90FF;
          color: #ffffff;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 5px;
          font-weight: bold;
          display: inline-block;
        }
        .footer {
          margin-top: 30px;
          font-size: 13px;
          text-align: center;
          color: #999;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">Reset Your Password</div>
        <div class="message">
          Hello,<br><br>
          We received a request to reset your password. Click the button below to set a new password. This link will expire in 15 minutes.
        </div>
        <div class="button">
          <a href="${resetLink}">Reset Password</a>
        </div>
        <div class="message">
          If you did not request this, you can safely ignore this email.
        </div>
        <div class="footer">
          &copy; 2025 Your Company Name. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;

       try {
              const info = await transporter.sendMail({
                     from: `"Unil Prajapati" <${process.env.EMAIL_AUTH_EMAIL}>`, // sender address
                     to: email,
                     subject: `Reset Your Password`,
                     html: emailTemplate,
              });

              console.log("Reset password email sent successfully!");
              return true;
       } catch (error) {
              console.log("Email Error:", error);
              return false;
       }
};
