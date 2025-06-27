import axios from 'axios'
import { useEffect, useState } from 'react'
import '../assets/styles/DriversList.css'

const DriversList = () => {
    const [drivers, setDrivers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [favs, setFavs] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("pilotFavs")) || []
        } catch {
            return []
        }
    })
    useEffect(() => {
        localStorage.setItem("pilotFavs", JSON.stringify(favs))
    }, [favs])
    useEffect(() => {
        axios("http://localhost:8080/api/drivers")
            .then(res => {
                const data = res.data
                if (Array.isArray(data)) {
                    setDrivers(data)
                } else {
                    setError("Formato de datos incorrecto")
                }
            })
            .catch(err => setError("Error al obtener pilotos"))
            .finally(() => setLoading(false))
    }, [])
    if (loading) return <div className="text-center mt-5">Cargando pilotos...</div>
    if (error) return <div className="alert alert-danger mt-5">{error}</div>
    if (!drivers || drivers.length === 0) {
        return <div className="alert alert-info mt-5">No hay pilotos disponibles</div>
    }

    const handleFav = async (itemId) => {
        const alreadyFav = favs.includes(itemId)
        setFavs((prev) =>
            alreadyFav ? prev.filter((id) => id !== itemId) : [...prev, itemId]
        )
        try {
            const token = localStorage.getItem("token")
            const res = await axios.post(
                "http://localhost:8080/api/favs/addFav",
                {
                    type: "driver",
                    itemId
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            )
        } catch (err) {
            console.error("Error al actualizar favorito", err)
            setFavs((prev) =>
                alreadyFav ? [...prev, itemId] : prev.filter((id) => id !== itemId)
            )
        }
    }
    return (
        <div className="drivers-page">
            <div className="drivers-banner position-relative mb-5">
                <div className="banner-overlay"></div>
                <div className="container position-relative z-index-1">
                    <div className="row min-vh-50 align-items-center py-5">
                        <div className="col-12 text-center text-white">
                            <h1 className="display-4 fw-bold mb-3">Pilotos</h1>
                            <p className="lead mb-4">conocé los heroes de la temporada actual y elige tus favoritos para competir en el campeonato del mundo.</p>
                            <div className="d-flex justify-content-center gap-3">
                                <span className="badge bg-danger px-3 py-2 fw-normal">Temporada 2025</span>
                                <span className="badge bg-secondary px-3 py-2 fw-normal">{drivers?.length} Pilotos</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container">
                {loading ? (
                    <Loader />
                ) : (
                    <div className="row mb-4">
                        <div className="col-md-6 mb-3 mb-md-0">
                            <div className="input-group">
                                <span className="input-group-text bg-dark text-white border-dark">
                                    <i className="bi bi-search"></i>
                                </span>
                                <input
                                    type="text"
                                    className="form-control border-dark"
                                    placeholder="Buscar piloto..."

                                />
                            </div>
                        </div>
                        <div className="col-md-6 d-flex justify-content-md-end">
                            <div className="btn-group" role="group">
                                <button type="button" className="btn btn-outline-dark">Todos</button>
                                <button type="button" className="btn btn-outline-dark">Favoritos</button>
                                <button type="button" className="btn btn-outline-dark">Por Equipo</button>
                            </div>
                        </div>
                    </div>
                )}
                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
                    {drivers && drivers.length > 0 && drivers.map((driver) => {
                        const isFav = favs.includes(driver._id)
                        return (
                            <div className="col" key={driver._id}>
                                <div className="card driver-card h-100 border-0 rounded-4 overflow-hidden shadow-sm transition-all">
                                    { }
                                    <div className="team-badge" style={{ backgroundColor: getTeamColor(driver.team) }}></div>
                                    <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center rounded-top-4">
                                        <h5 className="mb-0">{driver.name}</h5>
                                        <button
                                            className={isFav ? "btn btn-danger btn-sm" : "btn btn-outline-danger btn-sm"}
                                            onClick={() => handleFav(driver._id)}
                                            title={isFav ? "Quitar de favoritos" : "Agregar a favoritos"}
                                        >
                                            {isFav ? "❤️" : "🤍"}
                                        </button>
                                    </div>
                                    <div
                                        className="card-img-top driver-image"
                                        style={{
                                            height: '220px',
                                            backgroundImage: `url(/img/${driver.image})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'top center',
                                            backgroundRepeat: 'no-repeat'
                                        }}
                                        onError={(e) => {
                                            e.target.style.backgroundImage = 'url(/img/default-driver.jpg)'
                                        }}
                                    />
                                    <div className="card-body">
                                        <h6 className="card-subtitle mb-2 text-muted">{driver.team}</h6>
                                        <p className="card-text mb-1">
                                            <span className="badge bg-secondary me-2">{driver.country}</span>
                                            <span className="badge bg-warning text-dark"># {driver.number}</span>
                                        </p>
                                        <div className="d-flex justify-content-around mt-3">
                                            <div className="text-center">
                                                <small className="text-muted">🏆 Victorias</small><br />
                                                { }
                                            </div>
                                            <div className="text-center">
                                                <small className="text-muted">🥈 Podios</small><br />
                                                { }
                                            </div>
                                            <div className="text-center">
                                                <small className="text-muted">🎯 Poles</small><br />
                                                { }
                                            </div>
                                        </div>
                                    </div>
                                    { }
                                    <div className="card-footer bg-dark text-white d-flex justify-content-between">
                                        <div className="text-center">
                                            <div className="fw-bold">{driver.wins || 0}</div>
                                            <small className="text-uppercase text-muted">Victorias</small>
                                        </div>
                                        <div className="text-center">
                                            <div className="fw-bold">{driver.podiums || 0}</div>
                                            <small className="text-uppercase text-muted">Podios</small>
                                        </div>
                                        <div className="text-center">
                                            <div className="fw-bold">{driver.poles || 0}</div>
                                            <small className="text-uppercase text-muted">Poles</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}


const getTeamColor = (teamName) => {
    const teamColors = {
        'Red Bull Racing': '#0600EF',
        'Mercedes': '#00D2BE',
        'Ferrari': '#DC0000',
        'McLaren': '#FF8700',
        'Aston Martin': '#006F62',
        'Alpine': '#0090FF',
        'Williams': '#005AFF',
        'AlphaTauri': '#2B4562',
        'Alfa Romeo': '#900000',
        'Haas F1 Team': '#FFFFFF',

    }
    return teamColors[teamName] || '#000000'
}
export default DriversList