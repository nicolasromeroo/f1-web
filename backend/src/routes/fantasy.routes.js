import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { createDraft, getUserDrafts, getDraftByRace, getUserChampionship, getChampionships, getChampionshipStandings, getUserStats, getLeaderboard } from "../controllers/fantasy.controller.js";

const router = Router();

router.post("/drafts/:round", authMiddleware, createDraft);
router.get("/drafts/:round", authMiddleware, getDraftByRace);
router.get("/drafts", authMiddleware, getUserDrafts);

router.get("/championship", authMiddleware, getUserChampionship);
router.get("/championships", getChampionships);
router.get("/championships/standings", getChampionshipStandings);

router.get("/stats", authMiddleware, getUserStats);
router.get("/stats/leaderboard", getLeaderboard);

export default router;
