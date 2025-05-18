import { transporter } from "./email.config.js";

export const SendVerificationCode = async (email, otp) => {
       const emailTemplate = `
                            <!DOCTYPE html>
                            <html>
                            <head>
                            <meta charset="UTF-8">
                            <title>Your OTP Code</title>
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
                            .otp {
                                   margin: 30px 0;
                                   font-size: 32px;
                                   font-weight: bold;
                                   letter-spacing: 4px;
                                   text-align: center;
                                   color: #1E90FF;
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
                            <div class="header">Your Verification Code</div>
                            <div class="message">
                                   Hello,<br><br>
                                   Use the following OTP to complete your verification process. This code will expire in 5 minutes.
                            </div>
                            <div class="otp">${otp}</div>
                            <div class="message">
                                   If you did not request this, please ignore this email.
                            </div>
                            <div class="footer">
                                   &copy; 2025 Your Company Name. All rights reserved.
                            </div>
                            </div>
                            </body>
                            </html>
                            `


       try {
              const info = await transporter.sendMail({
                     from: `"Unil Prajapati" <${process.env.EMAIL_AUTH_EMAIL}>`, // sender address
                     to: email, // list of receivers
                     subject: `Verify Your Email`, // Subject line
                     text: "Hello world?", // plain text body
                     html: emailTemplate, // html body
              });

              console.log("Message sent Successfully!");
              return true;
       } catch (error) {
              console.log("Email Error:-", error)
       }
}