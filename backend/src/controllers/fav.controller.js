
import mongoose from "mongoose";
import Fav from "../models/fav.model.js"
import favDao from "../dao/fav.dao.js";

export const getFavorites = async (req, res) => {
    try {
        const favs = await Fav.findOne({ userId: req.user.userId })

            .populate("favDrivers")
            .populate("favRaces");
        return res.status(200).json(favs)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ msg: "Error al obtener favoritos", err })
    }
}

export const addFavorite = async (req, res) => {
    const { type, itemId } = req.body;
    try {
        let fav = await favDao.getUserFav(req.user.userId)
        if (!fav) fav = await favDao.createFav(req.user.userId)

        const updatedFav = await favDao.addToFav(type, fav._id, itemId)
        return res.status(200).json(updatedFav)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ msg: "Error al agregar favorito", err })
    }
};

export const removeFavorite = async (req, res) => {
    const { type, itemId } = req.params

    try {
        const fav = await favDao.getUserFav(req.user.userId)
        if (!fav) return res.status(404).json({ msg: "Favoritos no encontrados" });

        const updatedFav = await favDao.removeFav(type, fav._id, itemId);
        return res.status(200).json(updatedFav)
    } catch (err) {
        return res.status(500).json({ msg: "Error al eliminar favorito", err });
    }
};