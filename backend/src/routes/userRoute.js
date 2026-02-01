import express from "express";
import {
  authMe,
  searchUserByUsername,
  uploadAvatar,
  getUserById,
} from "../controllers/userController.js";
import { upload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.get("/me", authMe);
router.get("/search", searchUserByUsername);
router.post("/uploadAvatar", upload.single("file"), uploadAvatar);
router.get("/:id", getUserById);

export default router;
