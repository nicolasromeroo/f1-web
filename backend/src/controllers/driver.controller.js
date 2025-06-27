import driverDao from "../dao/driver.dao.js"

export const getDrivers = async (req, res) => {
    try {
        const drivers = await driverDao.getAll();
        const sortedDrivers = drivers.sort((a, b) => b.points - a.points)
            .map(driver => ({
                _id: driver._id,
                name: driver.name,
                team: driver.team,
                number: driver.number,
                points: driver.points,
                wins: driver.wins,
                podiums: driver.podiums,
                image: driver.image
            }));
        return res.status(200).json(sortedDrivers);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            msg: "Error al obtener conductores",
            error: error.message
        });
    }
};

export const getDriversWithPoints = async (req, res) => {
    try {
        const drivers = await driverDao.getDriversWithPoints();
        return res.status(200).json(drivers);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            msg: "Error al obtener conductores con puntos",
            error: error.message
        });
    }
};

export const getById = async (req, res) => {
    const { id } = req.params;

    try {
        if (id === 'current') {
            const drivers = await driverDao.getAll();
            return res.status(200).json(drivers);
        }

        const driver = await driverDao.getById(id);
        if (!driver) {
            return res.status(404).json({ msg: "Conductor no encontrado" });
        }

        return res.status(200).json(driver);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: "Error al traer conductor: ", err });
    }
}
