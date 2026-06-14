import { Router } from "express";
import { updateAccountStatus } from "../controllers/adminAccountController.js";

const router = Router();

// PUT /api/admin/accounts/:id/status
router.put("/:id/status", updateAccountStatus);

export default router;
