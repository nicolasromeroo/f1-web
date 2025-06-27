import mongoose, { Schema } from "mongoose";

const fantasyChampionshipsCollection = "fantasyChampionships"

const fantasyChampionshipSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    totalPoints: {
        type: Number,
        default: 0
    },
    wins: {
        type: Number,
        default: 0
    },
    podiums: {
        type: Number,
        default: 0
    },
    avgPointsPerRace: {
        type: Number,
        default: 0
    },
    badges: [{
        type: String
    }],
    history: [{
        race: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Race"
        },
        points: Number,
        drivers: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Driver"
        }],
        date: {
            type: Date,
            default: Date.now
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const FantasyChampionship = mongoose.model("FantasyChampionship", fantasyChampionshipSchema, fantasyChampionshipsCollection)

export default FantasyChampionship
