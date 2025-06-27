import userDao from "../dao/user.dao.js"
import { comparePassword, hashPassword } from "../utils/hashPassword.js"
import { generateToken } from "../utils/jwt.js"

export const register = async (req, res) => {
    const { email, password, role } = req.body

    try {
        const existingUser = await userDao.getByEmail(email)
        if (existingUser) return res.status(409).json({ msg: "Usuario existente, inicie sesión." })

        const hashedPassword = await hashPassword(password)

        const user = await userDao.create({
            email,
            password: hashedPassword,
            role: role || "user"
        })

        const token = generateToken({
            userId: user._id,
            email: user.email,
            role: user.role
        })

        return res.status(201).json({ msg: "Usuario registrado correctamente.", token })
    } catch (err) {
        return res.status(500).json({ msg: "Error al registrar: ", err })
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await userDao.getByEmail(email)
        if (!user) return res.status(401).json({ msg: "Usuario inexistente." })

        const isMatch = await comparePassword(password, user.password)
        if (!isMatch) return res.status(401).json({ msg: "Email o contraseñas incorrectos." })

        const token = generateToken({
            userId: user._id,
            email: user.email,
            role: user.role
        })

        return res.status(200).json({ msg: "Inicio de sesión exitoso.", token })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ msg: "Error al iniciar sesión: ", err })

    }
}

export const profile = async (req, res) => {
    const userId = req.user.userId

    try {
        const user = await userDao.getById(userId)

        return res.status(200).json({ msg: "Perfil de usuario: ", user })
    } catch (err) {
        return res.status(500).json({ msg: "Error al acceder al perfil de usuario: ", err })

    }
}