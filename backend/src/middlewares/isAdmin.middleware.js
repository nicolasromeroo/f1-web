const isAdmin = (req, res, next) => {
    if (req.user?.role !== "admin") {
        return res.status(403).json({ msg: "Acceso restringido." });
    }
    next();
};

export default isAdmin;
