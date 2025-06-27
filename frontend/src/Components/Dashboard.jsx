import { FaFlagCheckered, FaUserAlt, FaMapMarkerAlt, FaStar, FaTrophy } from "react-icons/fa"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
const Dashboard = () => {
    
    const stats = {
        drivers: 20,
        races: 24,
        countries: 21,
    }
    return (
        <>
            <section className="f1-banner d-flex align-items-center text-white position-relative overflow-hidden">
                <div
                    className="position-absolute top-0 start-0 w-100 h-100"
                    style={{ background: "rgba(0,0,0,0.6)", zIndex: 1 }}
                />

                <div className="container position-relative z-2">
                    <div className="row">
                        <div className="col-lg-8">
                            <motion.h1
                                className="display-4 mb-4"
                                style={{ fontFamily: "F1, Arial, sans-serif", lineHeight: 1.2 }}
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                <span className="text-danger fw-bold" style={{ fontSize: "3.5rem" }}>
                                    Tu garaje digital
                                </span><br />
                                Sigue la temporada en vivo<br />
                                y elige tus favoritos
                            </motion.h1>

                            <motion.p
                                className="lead text-light pe-lg-5"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3, duration: 0.6 }}
                                style={{ maxWidth: "850px" }}
                            >
                                Explorá la temporada actual de Fórmula 1 con acceso en tiempo real a pilotos, circuitos y carreras.
                                Guardá tus favoritos, seguí el calendario oficial, descubrí estadísticas clave y viví cada Gran Premio como si fueras parte del paddock.
                                Todo desde una plataforma pensada para verdaderos fanáticos.

                            </motion.p>
                        </div>

                        <div className="col-lg-4 mt-4 mt-lg-0">
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5, duration: 0.5 }}
                                className="bg-dark rounded-3 p-4 text-light"
                                style={{ backdropFilter: "blur(2px)" }}
                            >
                                <h5 className="text-danger fw-bold">Próxima Carrera</h5>
                                <p className="small">
                                    Silverstone - Gran Bretaña | 7 de Julio, 2025
                                </p>

                                <h5 className="text-danger fw-bold mt-3">Piloto Destacado</h5>
                                <p className="small">
                                    Oscar Piastri lidera la tabla con 6 victorias y 5 podios en lo que va de la temporada.
                                </p>

                                <h5 className="text-danger fw-bold mt-3">Circuito Favorito</h5>
                                <p className="small">
                                    Spa-Francorchamps ha sido marcado como favorito por más de 1200 usuarios.
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>
            <div className="container mt-5">

                <h2
                    className="mb-4 text-danger fw-bold dash-title"
                    style={{ fontFamily: 'F1, Arial, sans-serif', letterSpacing: '2px' }}
                >
                    <FaFlagCheckered className="me-2" />
                    Temporada actual
                </h2>

                <div className="row g-4">
                    <div className="col-md-4">
                        <div className="card text-white bg-dark shadow h-100">
                            <div className="card-body d-flex flex-column align-items-center">
                                <FaUserAlt size={40} className="mb-2 text-danger" />
                                <h5 className="card-title" style={{ fontFamily: 'F1, Arial, sans-serif' }}>Pilotos</h5>
                                <p className="card-text fs-3 fw-bold" style={{ fontFamily: 'F1, Arial, sans-serif' }}>{stats.drivers}</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card text-white bg-danger shadow h-100">
                            <div className="card-body d-flex flex-column align-items-center">
                                <FaFlagCheckered size={40} className="mb-2 text-white" />
                                <h5 className="card-title" style={{ fontFamily: 'F1, Arial, sans-serif' }}>Carreras</h5>
                                <p className="card-text fs-3 fw-bold" style={{ fontFamily: 'F1, Arial, sans-serif' }}>{stats.races}</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card text-white bg-secondary shadow h-100">
                            <div className="card-body d-flex flex-column align-items-center">
                                <FaMapMarkerAlt size={40} className="mb-2 text-warning" />
                                <h5 className="card-title" style={{ fontFamily: 'F1, Arial, sans-serif' }}>Países</h5>
                                <p className="card-text fs-3 fw-bold" style={{ fontFamily: 'F1, Arial, sans-serif' }}>{stats.countries}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row mt-5 g-4">
                    <div className="col-md-4">
                        <Link to="/favoritos" className="text-decoration-none">
                            <div className="card h-100 border-0 shadow-sm hover-card bg-dark text-white">
                                <div className="card-body text-center">
                                    <div className="bg-danger bg-opacity-25 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '80px', height: '80px'}}>
                                        <FaStar size={32} className="text-danger" />
                                    </div>
                                    <h5 className="card-title mb-0">Mis Favoritos</h5>
                                    <p className="small text-muted mt-2 mb-0">Revisa tus pilotos y carreras favoritas</p>
                                </div>
                            </div>
                        </Link>
                    </div>
                    <div className="col-md-4">
                        <Link to="/fantasy" className="text-decoration-none">
                            <div className="card h-100 border-0 shadow-sm hover-card bg-danger text-white">
                                <div className="card-body text-center">
                                    <div className="bg-white bg-opacity-25 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '80px', height: '80px'}}>
                                        <FaFlagCheckered size={32} className="text-white" />
                                    </div>
                                    <h5 className="card-title mb-0">Fantasy F1</h5>
                                    <p className="small text-white-50 mt-2 mb-0">Crea tu equipo y compite con amigos</p>
                                </div>
                            </div>
                        </Link>
                    </div>
                    <div className="col-md-4">
                        <Link to="/championship" className="text-decoration-none">
                            <div className="card h-100 border-0 shadow-sm hover-card bg-dark text-white">
                                <div className="card-body text-center">
                                    <div className="bg-danger bg-opacity-25 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '80px', height: '80px'}}>
                                        <FaTrophy size={32} className="text-warning" />
                                    </div>
                                    <h5 className="card-title mb-0">Campeonato</h5>
                                    <p className="small text-muted mt-2 mb-0">Sigue la clasificación general</p>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Dashboard