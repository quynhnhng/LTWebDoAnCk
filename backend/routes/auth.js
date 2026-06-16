import { Router } from "express";
import {
  login,
  register,
  updateProfile,
} from "../controllers/authController.js";

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.put("/update-profile", updateProfile);

export default router;
