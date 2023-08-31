import express from "express";
import { userLoginController, userLogoutController, userRefreshTokenController, userRegistrationController } from "../controller/authController";

const router = express.Router();

router.post("/register",userRegistrationController)
router.post("/login",userLoginController)
router.post("/refresh-token",userRefreshTokenController)
router.get("/logout",userLogoutController)

export default router;