import { Router } from "express";
import {
  getProducts,
  getCategories,
} from "../controllers/productController.js";
import { createOrder } from "../controllers/orderController.js";

const router = Router();

// Sản phẩm
router.get("/products", getProducts);

// Danh mục
router.get("/categories", getCategories);

// Đơn hàng (shop-facing — khách đặt hàng)
router.post("/orders", createOrder);

export default router;
