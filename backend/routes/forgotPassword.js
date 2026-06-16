import { Router } from "express";
import {
  forgotPassword,
  resetPassword,
  verifyResetToken,
} from "../controllers/forgotPasswordController.js";

const router = Router();

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/verify-reset-token", verifyResetToken);

export default router;
