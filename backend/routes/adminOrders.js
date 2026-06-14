import { Router } from "express";
import {
  getOrders,
  getOrderById,
  updateOrderStatus,
} from "../controllers/adminOrderController.js";

const router = Router();

router.get("/", getOrders);
router.get("/:id", getOrderById);
router.put("/:id/status", updateOrderStatus);

export default router;
