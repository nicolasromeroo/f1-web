
import { motion } from "framer-motion"
import { Navigate } from "react-router-dom"
import { useAuth } from "../../Contexts/AuthContext.jsx"
import { FaFlagCheckered, FaUserEdit, FaTrophy } from "react-icons/fa"
import { useState } from "react"
const FantasyPicker = ({ onClose }) => (
    <div className="card card-body bg-dark text-white mb-3">
        <h5 className="mb-3">Seleccioná tus 3 pilotos</h5>
        { }
        <button className="btn btn-danger" onClick={onClose}>
            Guardar selección
        </button>
    </div>
)
const Profile = () => {
    const { user, isAuthenticated, loading } = useAuth()
    const [showFantasy, setShowFantasy] = useState(false)
    if (loading) return <p className="text-center mt-5">Cargando perfil…</p>
    if (!isAuthenticated) return <Navigate to="/login" />
    const container = {
        hidden: { opacity: 0, y: -30 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    }
    const card = {
        hidden: { scale: 0.95, opacity: 0 },
        show: { scale: 1, opacity: 1, transition: { delay: 0.25, duration: 0.4 } },
    }
    const totalFantasyPoints = user?.totalFantasyPoints ?? 0
    const fantasyPicks = user?.fantasy ?? []

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="container mt-5"
        >
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-7">
                    <motion.div
                        variants={card}
                        whileHover={{ scale: 1.02 }}
                        className="card shadow border-0"
                        style={{ background: "#1c1c1e", color: "#fff" }}
                    >
                        <div className="card-body">
                            { }
                            <h3
                                className="card-title mb-4 text-center text-danger fw-bold d-flex align-items-center justify-content-center"
                                style={{ fontFamily: "F1, Arial, sans-serif", letterSpacing: "2px" }}
                            >
                                <FaFlagCheckered className="me-2" /> Perfil de Usuario
                            </h3>

                            { }
                            <div className="d-flex align-items-center mb-4 gap-3 flex-wrap">
                                <motion.img
                                    src="/img/avatar-google.png"
                                    alt="avatar"
                                    className="rounded-circle shadow"
                                    width={120}
                                    height={120}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.3, duration: 0.4 }}
                                />
                                <div>
                                    <p className="mb-2 fs-5">
                                        <strong>Email:</strong> {user?.email || "No disponible"}
                                    </p>
                                    <p className="mb-0 fs-6">
                                        <strong>Rol:</strong> {user?.role || "Sin rol"}
                                    </p>
                                </div>
                            </div>

                            <hr className="border-secondary" />

                            { }
                            <div className="mt-4">
                                <h4
                                    className="text-danger fw-bold mb-3 d-flex align-items-center gap-2"
                                    style={{ fontFamily: "F1, Arial, sans-serif" }}
                                >
                                    <FaTrophy /> Modo Carrera – Fantasy
                                </h4>

                                <p className="mb-2 fs-6">
                                    Total de puntos: <strong>{totalFantasyPoints}</strong>
                                </p>

                                { }
                                {fantasyPicks.length ? (
                                    <div className="table-responsive mb-3">
                                        <table className="table table-dark table-striped table-sm align-middle">
                                            <thead>
                                                <tr className="text-center">
                                                    <th>Carrera</th>
                                                    <th>Pilotos Elegidos</th>
                                                    <th>Puntos</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {fantasyPicks
                                                    .slice()
                                                    .reverse()
                                                    .map((pick) => (
                                                        <tr key={pick.race?._id || pick.raceId}>
                                                            <td>{pick.race?.name || "Carrera"}</td>
                                                            <td>
                                                                {pick.drivers?.map((d) => d.name).join(", ")}
                                                            </td>
                                                            <td className="text-center">
                                                                {pick.totalPoints ?? 0}
                                                            </td>
                                                        </tr>
                                                    ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className="text-secondary">
                                        Aún no has hecho predicciones. ¡Seleccioná tus pilotos para
                                        la próxima carrera y comenzá a sumar puntos!
                                    </p>
                                )}

                                { }
                                {showFantasy ? (
                                    <FantasyPicker onClose={() => setShowFantasy(false)} />
                                ) : (
                                    <div className="text-end">
                                        <button
                                            className="btn btn-danger fw-bold px-4"
                                            onClick={() => setShowFantasy(true)}
                                        >
                                            Elegir pilotos
                                        </button>
                                    </div>
                                )}
                            </div>

                            <hr className="border-secondary" />

                            { }
                            <div className="d-flex justify-content-end mt-3">
                                <button className="btn btn-outline-danger d-flex align-items-center gap-2 fw-bold py-2 px-3">
                                    <FaUserEdit /> Editar Perfil
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    )
}
export default Profile