import express from 'express';
import { createRace, getAllRaces, getRaceByRound } from '../controllers/race.controller.js';

const router = express.Router();

router.post('/', createRace);
router.get('/', getAllRaces);
router.get('/:round', getRaceByRound);

export default router;
