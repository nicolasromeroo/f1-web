
import jwt from "jsonwebtoken"
import envsConfig from "../config/envs.config.js"

export const generateToken = (payload) => {
    return jwt.sign(payload, envsConfig.SECRET_KEY, { expiresIn: "1h" })
}

export const verifyToken = (token) => {
    return jwt.verify(token, envsConfig.SECRET_KEY)
}