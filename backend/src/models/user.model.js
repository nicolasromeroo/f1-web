import mongoose, { Schema } from "mongoose"

const usersCollection = "users"

const userSchema = new Schema({
    email: {
        type: String
    },
    password: {
        type: String
    },
    role: {
        type: String
    }
})

const User = mongoose.model("User", userSchema, usersCollection)

export default User