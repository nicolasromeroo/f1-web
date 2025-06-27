
import mongoose, { Schema } from "mongoose";

const racesCollection = "races"

const raceSchema = new Schema({
    round: {
        type: Number
    },
    grandPrix: {
        type: String
    },
    circuit: {
        type: String
    },
    location: {
        type: String
    },
    country: {
        type: String
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    image: {
        type: String
    }
})

const Race = mongoose.model("Race", raceSchema, racesCollection)

export default Race