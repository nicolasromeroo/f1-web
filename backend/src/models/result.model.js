
import mongoose, { Schema } from 'mongoose';

const resultsCollection = "results"

const resultSchema = new Schema({
    round: {
        type: Number,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    results: [
        {
            driverId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Driver",
                required: true
            },
            position: {
                type: Number,
                required: true
            },
            points: {
                type: Number,
                required: true
            },
            // constructorId: {
            //     type: mongoose.Schema.Types.ObjectId,
            //     ref: "Constructor",
            //     required: true
            // }
        }
    ]
});

const Result = mongoose.model('Result', resultSchema, resultsCollection);

export default Result
