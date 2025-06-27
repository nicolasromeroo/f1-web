import fs from 'fs'
import path from 'path'
import RealResult from '../models/RealResult.model.js'

export const importResultsFromJSON = async (req, res) => {
    const { round } = req.params
    const filePath = path.resolve('src/json/resultados-2025.json')

    try {
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ msg: 'No se encontró el archivo resultados-2025.json' })
        }

        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

        const roundData = data.find((r) => r.round === parseInt(round))

        if (!roundData) {
            return res.status(404).json({ msg: `No se encontraron resultados para la ronda ${round}` })
        }

        const resultsToSave = roundData.results.map((r) => ({
            round: round,
            driverId: r.driverId,
            driverName: r.driverName,
            team: r.team,
            position: r.position,
            points: r.points,
        }))

        await RealResult.deleteMany({ round: round })

        await RealResult.insertMany(resultsToSave)

        res.json({ msg: `Resultados de la ronda ${round} importados correctamente.` })
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: 'Error al importar los resultados.' })
    }
}
