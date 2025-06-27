import FantasyChampionship from "../models/fantasyChampionship.model.js";

class FantasyChampionshipDAO {
    async createChampionship(userId) {
        const championship = await FantasyChampionship.create({
            user: userId
        });
        return championship;
    }

    async updateChampionship(userId, points, raceId, drivers) {
        const championship = await FantasyChampionship.findOneAndUpdate(
            { user: userId },
            {
                $inc: { totalPoints: points },
                $push: {
                    history: {
                        race: raceId,
                        points,
                        drivers,
                        date: new Date()
                    }
                }
            },
            { upsert: true, new: true }
        );
        return championship;
    }

    async getUserChampionship(userId) {

        const championship = await FantasyChampionship.findOne({ user: userId })
            .populate('user');
        return championship;

    }

    async getChampionships() {

        const championships = await FantasyChampionship.find()
            .populate('user');
        return championships;

    }
}

const fantasyChampionshipDao = new FantasyChampionshipDAO();

export default fantasyChampionshipDao;  