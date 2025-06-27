import { Router } from "express";
import { getDrivers, getDriversWithPoints, getById } from "../controllers/driver.controller.js";

const router = Router();

router.get("/", getDrivers);
router.get("/with-points", getDriversWithPoints);
router.get("/:id", getById);

export default router;