import { verifyToken } from "../utils/jwt.js";

const authMiddleware = (req, res, next) => {
    if (!req.headers.authorization) {
        console.error('Header Authorization no encontrado');
        return res.status(401).json({ message: 'Token no proporcionado' });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader.startsWith('Bearer ')) {
        console.error('Formato de header inválido:', authHeader);
        return res.status(401).json({ message: 'Formato de token inválido' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        console.error('Token vacío');
        return res.status(401).json({ message: 'Token inválido' });
    }

    try {
        if (!process.env.SECRET_KEY) {
            console.error('SECRET_KEY no configurada');
            return res.status(500).json({ message: 'Error interno del servidor' });
        }

        const decoded = verifyToken(token);
        if (!decoded?.userId) {
            console.error('Token decodificado sin userId:', decoded);
            return res.status(401).json({ message: 'Token inválido' });
        }

        req.user = decoded;
        return next();
    } catch (err) {
        console.error('Error en el middleware de autenticación:', err);
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expirado' });
        }
        return res.status(401).json({ message: 'Token inválido o expirado' });
    }
}

export default authMiddleware