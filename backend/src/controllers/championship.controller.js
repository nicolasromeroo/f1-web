import RealResult from "../models/RealResult.model.js";

export const getRealChampionship = async (req, res) => {
    try {
        const results = await RealResult.find();

        const standingsMap = {};

        for (const result of results) {
            if (!standingsMap[result.driverId]) {
                standingsMap[result.driverId] = {
                    driverId: result.driverId,
                    team: result.team,
                    points: 0,
                };
            }
            standingsMap[result.driverId].points += result.points;
        }

        const standings = Object.values(standingsMap).sort((a, b) => b.points - a.points);

        res.json(standings);
    } catch (err) {
        res.status(500).json({ msg: 'Error al cargar el campeonato' });
    }
};
