import express  from "express";
import {handleForgetPassword, handleHomeUrl,handleResetPassword,handleUserLogin, handleUserSignUp, requestOtp, verifyOtp} from "../controllers/static.controllers.js"
const router = express.Router();

router.get("/",handleHomeUrl)
router.post("/login",handleUserLogin)
router.post("/signup",handleUserSignUp)
router.post("/requestotp",requestOtp)
router.post("/verifyotp",verifyOtp)
router.post("/forgot-password",handleForgetPassword)
router.post('/reset-password', handleResetPassword)
export default router;