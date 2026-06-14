import { Router } from "express";
import {
  getAdmins,
  createAdmin,
  updateAdmin,
  updateAdminPassword,
  deleteAdmin,
} from "../controllers/adminAdminController.js";

const router = Router();

router.get("/", getAdmins);
router.post("/", createAdmin);
router.put("/:id", updateAdmin);
router.put("/:id/password", updateAdminPassword);
router.delete("/:id", deleteAdmin);

export default router;
