import Race from "../models/race.model.js";

class RaceDao {
    async getAll() {
        const races = await Race.find()
        return races
    }

    async getRaceByRound(round) {
        const parsedRound = parseInt(round);
        if (isNaN(parsedRound)) {
            return null;
        }
        const race = await Race.findOne({ round: parsedRound });
        return race;
    }

    async createRace(raceData) {
        const newRace = await Race.create(raceData)
        return newRace
    }

    async updateRace(id, raceData) {
        const updatedRace = await Race.findByIdAndUpdate(id, raceData, { new: true })
        return updatedRace
    }

    async deleteRace(id) {
        const deletedRace = await Race.findByIdAndDelete(id)
        return deletedRace
    }

    async getRacesByRound(round) {
        const races = await Race.findOne({ round })
        return races
    }
}

const raceDao = new RaceDao()

export default raceDao;