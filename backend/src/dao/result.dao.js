import Result from "../models/result.model.js";
import FantasyDraft from "../models/fantasyDraft.model.js";
import FantasyChampionship from "../models/fantasyChampionship.model.js";

class ResultDAO {
    async getResultsByRound(round) {
        return await Result.findOne({ round });
    }

    async calculateAndSaveUserPoints(userId, round) {
        const draft = await FantasyDraft.findOne({ user: userId, round });
        const result = await Result.findOne({ round });

        if (!draft || !result) return { error: 'Draft o Result no encontrados' };

        const existingChamp = await FantasyChampionship.findOne({ user: userId, 'history.round': round });
        if (existingChamp) return { error: 'Puntaje ya calculado para esta ronda' };

        let totalPoints = 0;

        for (const r of result.results) {
            const { driver, position } = r;

            if (driver === draft.mainDriver) {
                if (position === 1) totalPoints += 50;
                else if (position === 2) totalPoints += 40;
            }

            if (draft.secondaryDrivers.includes(driver)) {
                if (position === 1) totalPoints += 25;
                else if (position === 2) totalPoints += 20;
            }
        }

        let championship = await FantasyChampionship.findOne({ user: userId });
        if (!championship) {
            championship = await FantasyChampionship.create({
                user: userId,
                totalPoints,
                history: [{ round, points: totalPoints, drivers: [draft.mainDriver, ...draft.secondaryDrivers] }]
            });
        } else {
            championship.totalPoints += totalPoints;
            championship.history.push({
                round,
                points: totalPoints,
                drivers: [draft.mainDriver, ...draft.secondaryDrivers]
            });
            await championship.save();
        }

        return {
            points: totalPoints,
            championship
        };
    }
}

const resultDao = new ResultDAO();
export default resultDao;
