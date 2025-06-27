
import { Router } from "express";
import { login, profile, register } from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router()

router.post("/register", register)
router.post("/login", login)
router.get("/profile", authMiddleware, profile)

export default router