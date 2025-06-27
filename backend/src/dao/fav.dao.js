import Fav from "../models/fav.model.js";

class FavDao {
    async createFav(userId) {
        const fav = await Fav.create({
            userId,
            favDrivers: [],
            favRaces: []
        });
        return fav
    }

    async getUserFav(userId) {
        const fav = await Fav.findOne({ userId })
        if (!fav) {
            return await Fav.create({
                userId,
                favDrivers: [],
                favRaces: []
            });
        }
        return fav
    }

    async addToFav(type, favId, itemId) {
        const field = type === "driver" ? "favDrivers" : "favRaces";

        const fav = await Fav.findById(favId)
        if (!fav) return null

        if (!fav[field].includes(itemId)) {
            fav[field].push(itemId);
            await fav.save();
        }
        return fav
    }

    async removeFav(type, favId, itemId) {
        const field = type === "driver" ? "favDrivers" : "favRaces";

        const fav = await Fav.findById(itemId)
        if (!fav) return null

        fav[field] = fav[field].filter(favItemId => favItemId.toString() !== itemId)
        await fav.save();

        return fav
    }
};

const favDao = new FavDao()

export default favDao