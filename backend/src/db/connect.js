
import mongoose from "mongoose"
import envsConfig from "../config/envs.config.js"

const mongoDbConnection = async () => {
    try {
        await mongoose.connect(envsConfig.MONGO_URL, {
            // useNewUrlParser: true,
            // unifiedTopology: true
        })
    } catch (err) {
        console.error("Error al conectar a la base de datos: ", err)
        throw new Error(err)
    }
}

export default mongoDbConnection