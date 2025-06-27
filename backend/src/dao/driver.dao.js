import Driver from "../models/driver.model.js"

class DriverDao {
    async getAll() {
        const drivers = await Driver.find()
        return drivers
    }

    async getById(id) {
        const driver = await Driver.findById(id)
        return driver
    }

    async getByName(name) {
        const driver = await Driver.findOne({ name })
        return driver
    }

    async update(id, data) {
        const driver = await Driver.findByIdAndUpdate(id, data, { new: true })
        return driver
    }

    async delete(id) {
        const driver = await Driver.findByIdAndDelete(id)
        return driver
    }

    async getDriversWithPoints() {
        try {
            const drivers = await Driver.find()
                .sort({ points: -1 })
                .select('name team number points wins podiums image');
            return drivers;
        } catch (error) {
            throw error;
        }
    }
}

const driverDao = new DriverDao()

export default driverDao