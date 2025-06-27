
import resultDao from "../dao/result.dao.js";
import axios from "axios";
import Result from "../models/result.model.js";

export const calcularPuntaje = async (req, res) => {
    const { round } = req.params;
    const userId = req.user.userId;

    try {
        const resultado = await resultDao.calculateAndSaveUserPoints(userId, parseInt(round));
        if (resultado.error) return res.status(400).json({ error: resultado.error });

        res.json({ msg: 'Puntaje calculado correctamente', ...resultado });
    } catch (err) {
        res.status(500).json({ error: 'Error interno al calcular puntos' });
    }
};

export const importarResultados = async (req, res) => {
    const { round } = req.params;

    try {
        const response = await axios.get(`https://api.jolpica.com/results/${round}`);
        const rawResults = response.data;

        const results = rawResults.map((item) => ({
            driverId: item.driverId,
            position: item.position
        }));

        await resultDao.create({ round, results });

        res.json({ msg: 'Resultados importados exitosamente', round });
    } catch (err) {
        res.status(500).json({ error: 'Error al importar resultados', detalle: err.message });
    }
};

export const importResultsFromJolpica = async (req, res) => {
    const { round } = req.params;

    try {
        const response = await axios.get(`https://api.jolpica.com/results/${round}`);
        const { results } = response.data;

        if (!results || !Array.isArray(results)) {
            return res.status(400).json({ msg: "Formato de resultados inválido" });
        }

        await Result.deleteMany({ round });

        const savedResults = await Result.insertMany(
            results.map(r => ({
                round: parseInt(round),
                driver: r.driverId,
                position: r.position,
                points: r.points
            }))
        );

        res.status(201).json({ msg: "Resultados importados correctamente", savedResults });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: "Error al importar resultados", error: err.message });
    }
};