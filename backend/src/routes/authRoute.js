import express from "express";
import {
  refreshToken,
  signIn,
  signOut,
  signUp,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signUp);

router.post("/signin", signIn);

router.post("/signout", signOut);

router.post("/refresh", refreshToken);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password", resetPassword);

export default router;
