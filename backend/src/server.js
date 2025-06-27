
import express from "express"
import cors from "cors"

import envsConfig from "./config/envs.config.js"
import mongoDbConnection from "./db/connect.js"

/* __________ MODELOS ____________ */
import './models/race.model.js';
import './models/driver.model.js';
import './models/fav.model.js';
/* ─────────────────────────────── */

import authRoutes from "./routes/auth.routes.js"
import driverRoutes from "./routes/driver.routes.js"
import favRoutes from "./routes/fav.routes.js"
import fantasyRoutes from "./routes/fantasy.routes.js"
import raceRoutes from "./routes/race.routes.js"
import realChampionshipRoutes from "./routes/real-champrionshi-results.routes.js"

mongoDbConnection()
const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/auth", authRoutes)
app.use("/api/drivers", driverRoutes)
app.use("/api/favs", favRoutes)
app.use("/api/fantasy", fantasyRoutes)
app.use("/api/races", raceRoutes)
app.use("/api/results", realChampionshipRoutes)

// app.use("/api/championship", )

app.listen(envsConfig.PORT, () => {
    console.log(`Servidor corriendo.`)
})