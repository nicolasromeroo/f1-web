import mongoose, { mongo, Schema } from "mongoose"

const driversCollection = "drivers"

// ref: me permite luego hacer .populate('driver') para traer los datos reales del piloto sin duplicarlos.

const driverSchema = new Schema({
    name: {
        type: String,
    },
    team: {
        type: String
    },
    number: {
        type: Number
    },
    country: {
        type: String
    },
    wins: {
        type: Number,
        default: 0
    },
    poles: {
        type: Number,
        default: 0
    },
    podiums: {
        type: Number,
        default: 0
    },
    image: {
        type: String
    },
    //  lista de predicciones por carrera
    fantasy: {
        type: [
            {
                race: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Race"
                },
                drivers: [
                    {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "Driver"
                    }
                ],
                poleBonus: {
                    type: Boolean,
                    default: false
                },
                teamBonus: {
                    type: Boolean,
                    default: false
                },
                totalPoints: {
                    type: Number
                }
            }
        ],
        default: []
    }
}, { timestamps: true })

const Driver = mongoose.model("Driver", driverSchema, driversCollection)

export default Driver