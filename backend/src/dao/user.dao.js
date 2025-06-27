import User from "../models/user.model.js"

class UserDao {
    async create(data) {
        const user = await User.create(data)
        return user
    }

    async getById(id) {
        const user = await User.findById(id)
        return user
    }

    async getByEmail(email) {
        const user = await User.findOne({ email })
        return user
    }

    async update(id, data) {
        const user = await User.findByIdAndUpdate(id, data, { new: true })
        return user
    }

    async delete(id) {
        const user = await User.findByIdAndDelete(id)
        return user
    }

    async addFantasyPick(userId, raceId, drivers) {
        await User.updateOne(
            { _id: userId, "fantasy.race": { $ne: raceId } },
            {
                $push: {
                    fantasy: { race: raceId, drivers, totalPoints: 0 },
                },
            }
        );
        return User.findById(userId).populate("fantasy.race fantasy.drivers");
    }
}

const userDao = new UserDao()

export default userDao