import Race from "../models/race.model.js";
import axios from "axios";

export const createRace = async (req, res) => {
    try {
        const race = new Race(req.body);
        await race.save();
        return res.status(201).json(race);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            msg: "Error al crear la carrera",
            error: error.message
        });
    }
};

export const getAllRaces = async (req, res) => {
    try {
        const races = await Race.find();
        return res.status(200).json(races);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            msg: "Error al obtener carreras",
            error: error.message
        });
    }
};

export const getRaceByRound = async (req, res) => {
    try {
        const round = parseInt(req.params.round);
        if (isNaN(round)) {
            return res.status(400).json({ msg: "Número de ronda inválido" });
        }

        const race = await Race.findOne({ round });
        if (!race) {
            return res.status(404).json({ msg: "Carrera no encontrada" });
        }

        return res.status(200).json(race);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            msg: "Error al obtener carrera",
            error: error.message
        });
    }
};
