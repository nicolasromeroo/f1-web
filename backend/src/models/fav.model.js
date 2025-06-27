
import mongoose, { Schema } from "mongoose"

const favsCollection = "favs"

const favSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    favDrivers: [
        {
            type: Schema.Types.ObjectId,
            ref: "Driver"
        }
    ],
    favRaces: [
        {
            type: Schema.Types.ObjectId,
            ref: "Race"
        }
    ]
})

const Fav = mongoose.model("Fav", favSchema, favsCollection)

export default Fav
