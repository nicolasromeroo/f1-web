import { Router } from "express";
import { getAllRaces, getRaceByRound } from "../controllers/race.controller.js";

const router = Router();

router.get("/", getAllRaces);
router.get("/:round", getRaceByRound);

export default router;
