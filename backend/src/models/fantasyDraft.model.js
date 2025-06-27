import mongoose, { Schema } from "mongoose";

const fantasyDraftsCollection = "fantasyDrafts"

const fantasyDraftSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    race: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Race",
        required: true
    },
    mainDriver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Driver",
        required: true
    },
    secondaryDrivers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Driver"
    }],
    points: {
        type: Number,
        default: 0
    },
    bonuses: {
        poleBonus: {
            type: Boolean,
            default: false
        },
        teamBonus: {
            type: Boolean,
            default: false
        }
    },
    penalties: {
        dnfPenalty: {
            type: Boolean,
            default: false
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const FantasyDraft = mongoose.model("FantasyDraft", fantasyDraftSchema, fantasyDraftsCollection)

export default FantasyDraft
