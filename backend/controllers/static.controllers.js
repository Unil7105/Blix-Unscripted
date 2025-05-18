import { SendVerificationCode } from "../middleware/email.js"
import User from "../models/user.models.js"
import { v4 as uuidv4 } from 'uuid';
import Otp from "../models/otp.model.js"
import generateOTP from "../utils/generateOTP.js"
import { setUser } from "../service/auth.js";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { SendResetPasswordEmail } from "../middleware/forgetemail.js";

dotenv.config();



const secret = process.env.JWT_SECRET_KEY;

const handleHomeUrl = async (req, res) => {
       res.send("Hello world")
}

const handleUserSignUp = async (req, res) => {

       const { name, email, password } = req.body;


       if (!email || !password || !name) {
              res.status(400).json({
                     success: false,
                     message: "All fields are required"
              })
       }

       const saltRounds = 10;
       const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

       const userExists = await User.findOne({ email });
       if (userExists) {
              return res.status(400).json({ message: 'User already exists' });
       }
       // Save new user
       const user = await User.create({ name, email, password: hashedPassword });

       return res.status(201).json({ message: 'User created', user });
}

const requestOtp = async (req, res) => {
       const otp = generateOTP()
       const email = req.body.email

       const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

       // Remove previous OTPs
       await Otp.deleteMany({ email });

       // Save OTP
       await Otp.create({ email, otp, expiresAt });

       const status = SendVerificationCode(email, otp)
       if (status) {
              return res.status(200).json({
                     success: true,
                     message: "Mail sent successfully!"
              })
       } else {
              return res.status(500).json({
                     success: false,
                     message: "Internal Server Error"
              })
       }
}

const verifyOtp = async (req, res) => {

       const { email, otp } = req.body
       console.log("email:-", email)
       console.log("otp:-", otp)
       const record = await Otp.findOne({ email })
       console.log(record)
       if (!record) {
              res.status(400).json({
                     success: false,
                     message: "No OTP requested for this email"
              })
       }
       if (new Date() > record.expiresAt) {
              await Otp.deleteOne({ email });
              return res.status(400).json({ message: 'OTP expired' });
       }

       if (record.otp !== otp) {
              return res.status(400).json({ message: 'Invalid OTP' });
       }

       // OTP verified, delete it to prevent reuse
       await Otp.deleteOne({ email });

       res.json({ message: 'OTP Verified Successfully' });
}

const handleUserLogin = async (req, res) => {
       const { email, password } = req.body;
       const saltRounds = 10;
       const hashedPassword = await bcrypt.hash(password, saltRounds);
       console.log(hashedPassword)
       const user = await User.findOne({ email })

       if (!user) {
              res.status(404).json({
                     success: true,
                     error: "User not available"
              })
              return res.redirect("/signup")
       }
       const valid = await bcrypt.compare(password, user.password);
       if (!valid) {
              res.status(404).json({
                     success: true,
                     error: "Invalid Password"
              })
              return res.redirect("/signup")
       }
       const token = setUser(user);
       console.log("User Loggedin successfuly");
       console.log("Creating Cookie...");
       res.cookie('uid', token, {
              httpOnly: true,
              secure: true,
              sameSite: 'lax',
              maxAge: 2 * 60 * 60 * 1000 // 2 hours
            });            
       console.log("Cookie created")

       return res.status(200).json({
              success: true,
              message: "User loggedin successfully...",
              token: token
       })
}

const handleForgetPassword = async (req, res) => {

       const { email } = req.body;

       const user = await User.findOne({ email });
       if (!user) return res.status(400).json({ message: 'User not found' });

       //creates verification token....
       const token = jwt.sign(
              { email: user.email },
              process.env.JWT_SECRET_KEY,
              { expiresIn: '15m' } // Token expires in 15 mins
       );

       const resetLink = `http://localhost:5174/reset-password?token=${token}`;
       const status = SendResetPasswordEmail(email,resetLink)
       if(!status){
              return res.status(500).json({
                     success: false,
                     message: "Internal Server Error"
              })
       }

       return res.status(200).json({
                     success: true,
                     message: "Mail sent successfully!"
              })
}

const handleResetPassword = async (req, res) => {
       const { token, newPassword } = req.body;
       try {
              const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
              console.log(decoded)
              const user = await User.findOne({ email: decoded.email });
              if (!user) return res.status(400).json({ message: 'User not found' });

              const hashed = await bcrypt.hash(newPassword, 10);
              user.password = hashed;
              await user.save();

              res.json({ message: 'Password successfully reset' });
              return res.redirect("/")
       } catch (err) {
              res.status(400).json({ message: 'Invalid or expired token' });
       }
}


export { handleHomeUrl, handleUserLogin, requestOtp, verifyOtp, handleUserSignUp, handleForgetPassword, handleResetPassword }