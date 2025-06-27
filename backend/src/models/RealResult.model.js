import mongoose, { Schema } from "mongoose";

const realResultsCollection = "real_results"

const realResultSchema = new Schema({
    round: Number,
    raceName: String,
    results: [
        {
            driverId: String,
            driverName: String,
            team: String,
            position: Number,
            points: Number
        }
    ]
});

const RealResult = mongoose.model('RealResult', realResultSchema, realResultsCollection);
export default RealResult
