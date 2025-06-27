
import Joi from "joi";
import userDao from "../dao/user.dao.js";
import raceDao from "../dao/race.dao.js";
import fantasyDraftDao from "../dao/fantasyDraft.dao.js";
import fantasyChampionshipDao from "../dao/fantasyChampionship.dao.js";
import driverDao from "../dao/driver.dao.js";

export const createDraft = async (req, res) => {
    const schema = Joi.object({
        mainDriverId: Joi.string().required(),
        secondaryDriversIds: Joi.array().items(Joi.string()).length(2).required(),
        teamId: Joi.string().allow('').required(),
        powerUnitId: Joi.string().allow('').required()
    });

    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ msg: error.message });

    const { mainDriverId, secondaryDriversIds, teamId, powerUnitId } = value;
    const userId = req.user.userId;
    const round = req.params.round;

    try {
        const parsedRound = parseInt(round);
        if (isNaN(parsedRound)) {
            return res.status(400).json({ msg: "Número de ronda inválido" });
        }

        const race = await raceDao.getRaceByRound(parsedRound);
        if (!race) return res.status(404).json({ msg: "Carrera inexistente" });

        if (new Date() > race.startDate) {
            return res.status(400).json({
                msg: "La carrera ya se disputó",
                details: {
                    raceName: race.name,
                    startDate: race.startDate
                }
            });
        }

        const currentDate = new Date();
        const raceDate = new Date(race.startDate);

        if (currentDate > raceDate) {
            console.log('Validando fechas:', {
                currentDate: currentDate.toISOString(),
                raceDate: raceDate.toISOString(),
                isPastRace: currentDate > raceDate,
                raceRound: parsedRound,
                raceName: race.name
            });
            return res.status(400).json({
                msg: "La carrera ya se disputó",
                details: {
                    raceName: race.name,
                    startDate: race.startDate,
                    currentServerTime: currentDate.toISOString()
                }
            });
        }

        const mainDriver = await driverDao.getById(mainDriverId);
        if (!mainDriver) {
            return res.status(404).json({
                msg: "Piloto principal no encontrado",
                driverId: mainDriverId
            });
        }

        const secondaryDrivers = await Promise.all(
            secondaryDriversIds.map(id => driverDao.getById(id))
        );

        if (secondaryDrivers.some(driver => !driver)) {
            return res.status(404).json({
                msg: "Uno o más pilotos secundarios no encontrados",
                driverIds: secondaryDriversIds
            });
        }

        const allDrivers = [mainDriver, ...secondaryDrivers];
        const uniqueDrivers = new Set(allDrivers.map(driver => driver._id));
        if (uniqueDrivers.size !== 3) {
            return res.status(400).json({
                msg: "No puedes seleccionar el mismo piloto más de una vez"
            });
        }

        const draft = await fantasyDraftDao.createDraft(
            userId,
            race._id,
            mainDriverId,
            secondaryDriversIds,
            teamId,
            powerUnitId
        );

        const championship = await fantasyChampionshipDao.getUserChampionship(userId);
        if (!championship) {
            await fantasyChampionshipDao.createChampionship(userId);
        }

        res.status(201).json({
            msg: "Draft creado exitosamente",
            draft,
            raceName: race.name
        });
    } catch (error) {
        console.error("Error creating draft:", error);
        res.status(500).json({
            msg: "Error interno del servidor",
            error: error.message
        });
    }
};

export const getUserDrafts = async (req, res) => {
    try {
        const userId = req.user.userId;
        const drafts = await fantasyDraftDao.getUserDrafts(userId);
        return res.status(200).json(drafts);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            msg: "Error al obtener drafts",
            error: error.message
        });
    }
};

export const getDraftByRace = async (req, res) => {
    try {
        const { round } = req.params;
        const userId = req.user.userId;

        const draft = await fantasyDraftDao.getDraftByRace(userId, round);
        console.log(draft)
        if (!draft) {
            console.log(`No draft encontrado para user ${userId} y ronda ${round}`);
            return res.status(404).json({
                msg: "No existe un draft para esta carrera"
            });
        }
        res.json(draft)
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            msg: "Error al obtener draft",
            error: error.message
        });
    }
};

export const getUserChampionship = async (req, res) => {
    try {
        const userId = req.user.userId;
        const championship = await fantasyChampionshipDao.getUserChampionship(userId);
        return res.status(200).json(championship);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            msg: "Error al obtener campeonato",
            error: error.message
        });
    }
};

export const getChampionships = async (req, res) => {
    try {
        const championships = await fantasyChampionshipDao.getChampionships();
        return res.status(200).json(championships);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            msg: "Error al obtener campeonatos",
            error: error.message
        });
    }
};

export const getChampionshipStandings = async (req, res) => {
    try {
        const championships = await fantasyChampionshipDao.getChampionships();
        const standings = championships
            .sort((a, b) => b.totalPoints - a.totalPoints)
            .map(championship => ({
                user: championship.user,
                totalPoints: championship.totalPoints,
                wins: championship.wins,
                podiums: championship.podiums,
                avgPointsPerRace: championship.avgPointsPerRace,
                badges: championship.badges
            }));
        return res.status(200).json(standings);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            msg: "Error al obtener tabla de posiciones",
            error: error.message
        });
    }
};

export const getUserStats = async (req, res) => {
    try {
        const userId = req.user.userId;
        const championship = await fantasyChampionshipDao.getUserChampionship(userId);

        const stats = {
            totalPoints: championship.totalPoints,
            wins: championship.wins,
            podiums: championship.podiums,
            avgPointsPerRace: championship.avgPointsPerRace,
            badges: championship.badges,
            streak: 0,
            consistency: 0,
            accuracy: 0
        };

        if (championship.history.length > 0) {
            let currentStreak = 0;
            for (let i = championship.history.length - 1; i >= 0; i--) {
                if (championship.history[i].points > 0) {
                    currentStreak++;
                } else {
                    break;
                }
            }
            stats.streak = currentStreak;
        }

        const racesWithPoints = championship.history.filter(h => h.points > 0).length;
        stats.consistency = Math.round((racesWithPoints / championship.history.length) * 100);

        let correctPredictions = 0;
        for (const race of championship.history) {
            const draft = await fantasyDraftDao.getDraftByRace(userId, race.race);
            if (draft && draft.points > 0) {
                correctPredictions++;
            }
        }
        stats.accuracy = Math.round((correctPredictions / championship.history.length) * 100);

        return res.status(200).json(stats);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            msg: "Error al obtener estadísticas",
            error: error.message
        });
    }
};

export const getLeaderboard = async (req, res) => {
    try {
        const championships = await fantasyChampionshipDao.getChampionships();
        const leaderboard = championships
            .sort((a, b) => b.totalPoints - a.totalPoints)
            .map(championship => ({
                user: championship.user,
                totalPoints: championship.totalPoints,
                wins: championship.wins,
                podiums: championship.podiums,
                avgPointsPerRace: championship.avgPointsPerRace,
                badges: championship.badges,
                streak: 0,
                consistency: 0,
                accuracy: 0
            }));

        for (const entry of leaderboard) {
            const history = championships.history;

            let currentStreak = 0;
            for (let i = history.length - 1; i >= 0; i--) {
                if (history[i].points > 0) {
                    currentStreak++;
                } else {
                    break;
                }
            }
            entry.streak = currentStreak;

            const racesWithPoints = history.filter(h => h.points > 0).length;
            entry.consistency = Math.round((racesWithPoints / history.length) * 100);

            let correctPredictions = 0;
            for (const race of history) {
                const draft = await fantasyDraftDao.getDraftByRace(entry.user, race.race);
                if (draft && draft.points > 0) {
                    correctPredictions++;
                }
            }
            entry.accuracy = Math.round((correctPredictions / history.length) * 100);
        }

        return res.status(200).json(leaderboard);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            msg: "Error al obtener el leaderboard",
            error: error.message
        });
    }
};
