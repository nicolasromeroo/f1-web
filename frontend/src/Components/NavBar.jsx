import React, { useState, useEffect } from "react"
import { useAuth } from '../Contexts/AuthContext.jsx'
import { Link, NavLink } from 'react-router-dom'
import { FaStar, FaUserAlt, FaFlagCheckered, FaUserCircle } from "react-icons/fa"
const NavBar = () => {
    const { user, logout } = useAuth()
    const [races, setRaces] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        const fetchRaces = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/races`)
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }
                const data = await response.json()
                console.log("Races data received:", data)
                if (Array.isArray(data)) {

                    const formattedRaces = data.map(race => ({
                        ...race,

                        circuit: race.circuit || 'Circuito',
                        location: race.location || 'Ubicación',
                        country: race.country || 'País'
                    }))
                    console.log("Formatted races:", formattedRaces)
                    setRaces(formattedRaces)
                } else {
                    console.error('Expected an array of races but got:', data)
                    setRaces([])
                }
            } catch (error) {
                console.error('Error fetching races:', error)
                setRaces([])
            } finally {
                setIsLoading(false)
            }
        }
        fetchRaces()
    }, [])
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow f1-navbar z-index-1">
            <div className="container">
                <Link className="navbar-brand d-flex align-items-center" to="/">
                    <img src="/img/f1-logo.png" alt="f1-logo" className="f1-logo me-2" style={{ height: '40px' }} />
                    <span className="text-danger f1-title">
                        {user ? `${user.email}` : "inicio"}
                    </span>
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto align-items-center">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/" end>Inicio</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/drivers">Pilotos</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/races">Carreras</NavLink>
                        </li>
                        {user && (
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/favoritos">
                                    Favoritos
                                </NavLink>
                            </li>
                        )}
                        {user ? (
                            <>
                                {user && (
                                    <li className="nav-item dropdown">
                                        <a className="nav-link dropdown-toggle" href="#" id="fantasyDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            <FaUserCircle className="me-1" />
                                            Fantasy
                                        </a>
                                        <ul className="dropdown-menu dropdown-menu-end fantasy-dropdown z-index-1" aria-labelledby="fantasyDropdown" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                            <li className="dropdown-header text-white bg-dark px-3 py-2">
                                                <h6 className="mb-0">Selecciona una carrera</h6>
                                            </li>
                                            <li className="dropdown-divider"></li>
                                            {isLoading ? (
                                                <li className="px-3 py-2">
                                                    <div className="text-center text-muted">Cargando carreras...</div>
                                                </li>
                                            ) : races.length === 0 ? (
                                                <li className="px-3 py-2">
                                                    <div className="text-center text-muted">No hay carreras disponibles</div>
                                                </li>
                                            ) : (
                                                races.map((race) => {
                                                    console.log('Rendering race:', race)
                                                    return (
                                                        <li key={race._id} className="px-3 py-1">
                                                            <NavLink
                                                                className="dropdown-item text-light"
                                                                to={`/fantasy/${race.round}`}
                                                                style={{
                                                                    backgroundColor: '#1c1c1e',
                                                                    padding: '8px 16px',
                                                                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                                                                    whiteSpace: 'nowrap',
                                                                    overflow: 'hidden',
                                                                    textOverflow: 'ellipsis',
                                                                    display: 'block',
                                                                    maxWidth: '300px'
                                                                }}
                                                            >
                                                                {`${race.round}- ${race.circuit}, ${race.location}, ${race.country}`}
                                                            </NavLink>
                                                        </li>
                                                    )
                                                })
                                            )}
                                        </ul>
                                    </li>
                                )}
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/profile">Perfil</NavLink>
                                </li>
                                {user?.role === 'admin' && (
                                    <li className="nav-item">
                                        <NavLink className="nav-link" to="/results">
                                            <span className="text-warning">Examinar resultados</span>
                                        </NavLink>
                                    </li>
                                )}
                                <li className="nav-item">
                                    <button onClick={logout} className="btn btn-outline-danger btn-sm ms-3">Cerrar sesión</button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/login">Iniciar Sesión</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/register">Registrarse</NavLink>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    )
}
export default NavBar