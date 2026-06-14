import { Router } from "express";
import {
  getDashboard,
  getStatistics,
} from "../controllers/adminDashboardController.js";

const router = Router();

router.get("/dashboard", getDashboard);
router.get("/statistics", getStatistics);

export default router;
