import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../Contexts/AuthContext.jsx'
import { FaFlagCheckered, FaCalendarAlt, FaMapMarkerAlt, FaChevronRight, FaCrown } from 'react-icons/fa'
import "../assets/styles/Races.css"

const Races = () => {
    const [races, setRaces] = useState([])
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)
    const [imageLoading, setImageLoading] = useState(new Map())
    const { user } = useAuth()
    const fetchRaces = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/races', {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            })

            if (response.data && Array.isArray(response.data)) {
                const racesWithImageState = response.data.map(race => ({
                    ...race,
                    imageLoading: true,
                    hasResults: false
                }))
                setRaces(racesWithImageState)
                racesWithImageState.forEach(race => {
                    setImageLoading(prev => new Map(prev).set(race.round, true))
                })
            } else {
                throw new Error('Formato de datos incorrecto')
            }
        } catch (err) {
            console.error('Error:', err)
            setError('No se pudieron cargar las carreras')
        } finally {
            setLoading(false)
        }
    }, [])
    useEffect(() => {
        fetchRaces()
    }, [])
    if (error) return (
        <div className="container my-5">
            <div className="alert alert-danger">
                <h5>Error al cargar las carreras</h5>
                <p className="mb-0">{error}</p>
            </div>
        </div>
    )
    if (loading) {
        return (
            <div className="races-page">
                <div className="races-banner position-relative mb-5">
                    <div className="banner-overlay"></div>
                    <div className="container position-relative z-index-1">
                        <div className="row min-vh-50 align-items-center py-5">
                            <div className="col-12 text-center text-white">
                                <h1 className="display-4 fw-bold mb-3">Calendario</h1>
                                <p className="lead mb-4">Descubre todas las carreras de la temporada y prepárate para el Gran Premio</p>
                                <div className="d-flex justify-content-center gap-3">
                                    <span className="badge bg-danger px-3 py-2 fw-normal">Temporada 2025</span>
                                    <span className="badge bg-secondary px-3 py-2 fw-normal">{races?.length || 24} Carreras</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container">
                    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="col">
                                <div className="card h-100 shadow-sm hover-card">
                                    <div className="card-img-top bg-light" style={{
                                        height: '200px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Cargando...</span>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <h5 className="card-title placeholder-glow">
                                            <span className="placeholder col-8"></span>
                                        </h5>
                                        <p className="card-text placeholder-glow">
                                            <span className="placeholder col-12"></span>
                                            <span className="placeholder col-10"></span>
                                            <span className="placeholder col-8"></span>
                                        </p>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="btn-group">
                                                <button className="btn btn-primary disabled placeholder col-8"></button>
                                            </div>
                                            <small className="text-muted placeholder col-2"></small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }


    if (races.length > 0) {
        return (
            <div className="races-page">
                { }
                <div className="races-banner position-relative mb-5">
                    <div className="banner-overlay"></div>
                    <div className="container position-relative z-index-1">
                        <div className="row min-vh-50 align-items-center py-5">
                            <div className="col-12 text-center text-white">
                                <h1 className="display-4 fw-bold mb-3">Calendario 2025</h1>
                                <p className="lead mb-4">Descubre todas las carreras de la temporada y prepárate para el Gran Premio</p>
                                <div className="d-flex justify-content-center gap-3">
                                    <span className="badge bg-danger px-3 py-2 fw-normal">Temporada 2025</span>
                                    <span className="badge bg-secondary px-3 py-2 fw-normal">{races.length} Carreras</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container">
                    { }
                    <div className="row mb-4">
                        <div className="col-md-6 mb-3 mb-md-0">
                            <div className="input-group">
                                <span className="input-group-text bg-dark text-white border-dark">
                                    <FaMapMarkerAlt />
                                </span>
                                <input
                                    type="text"
                                    className="form-control border-dark"
                                    placeholder="Buscar circuito o ubicación..."
                                />
                            </div>
                        </div>
                        <div className="col-md-6 d-flex justify-content-md-end">
                            <div className="btn-group" role="group">
                                <button type="button" className="btn btn-outline-dark">Todas</button>
                                <button type="button" className="btn btn-outline-dark">Próximas</button>
                                <button type="button" className="btn btn-outline-dark">Finalizadas</button>
                            </div>
                        </div>
                    </div>

                    { }
                    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                        {races.map((race) => {
                            const raceDate = new Date(race.date)
                            const isPastRace = raceDate < new Date()
                            return (
                                <div key={race._id} className="col">
                                    <div className="card h-100 border-0 rounded-4 overflow-hidden shadow-sm transition-all hover-card">
                                        { }
                                        <div className={`position-absolute top-0 end-0 m-3 badge ${isPastRace ? 'bg-success' : 'bg-danger'}`}>
                                            {isPastRace ? 'Finalizada' : 'Próxima'}
                                        </div>

                                        { }
                                        <div
                                            className="card-img-top position-relative"
                                            style={{
                                                height: '180px',
                                                backgroundImage: `url(/img/circuits/${race.circuitId}.jpg)`,
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center',
                                            }}
                                        >
                                            <div className="position-absolute bottom-0 start-0 w-100 p-3" style={{
                                                background: 'linear-gradient(transparent, rgba(0,0,0,0.8))'
                                            }}>
                                                <h5 className="text-white mb-0">{race.raceName}</h5>
                                            </div>
                                        </div>

                                        { }
                                        <div className="card-body">
                                            <div className="d-flex align-items-center mb-3">
                                                <div className="bg-dark text-white rounded-circle d-flex align-items-center justify-content-center"
                                                    style={{ width: '40px', height: '40px' }}>
                                                    <FaFlagCheckered className="text-danger" />
                                                </div>
                                                <div className="ms-3">
                                                    <h6 className="mb-0">{race.circuitName}</h6>
                                                    <small className="text-muted">{race.locality}, {race.country}</small>
                                                </div>
                                            </div>

                                            <div className="mb-3">
                                                <small className="text-muted d-block mb-1">Fechas</small>
                                                <div className="d-flex flex-column gap-2">
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <span className="small">Práctica 1:</span>
                                                        <span className="small">
                                                            {new Date(race.FirstPractice?.date).toLocaleDateString('es-AR', {
                                                                day: '2-digit',
                                                                month: 'short',
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </span>
                                                    </div>
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <span className="small">Clasificación:</span>
                                                        <span className="small">
                                                            {new Date(race.Qualifying?.date).toLocaleDateString('es-AR', {
                                                                day: '2-digit',
                                                                month: 'short',
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </span>
                                                    </div>
                                                    <div className="d-flex justify-content-between align-items-center fw-bold">
                                                        <span>Carrera:</span>
                                                        <span>
                                                            {new Date(race.date).toLocaleDateString('es-AR', {
                                                                day: '2-digit',
                                                                month: 'short',
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <small className="text-muted d-block">Ronda</small>
                                                    <span className="badge bg-dark">{race.round}</span>
                                                </div>
                                                <div>
                                                    <small className="text-muted d-block">Tiempo Local</small>
                                                    <span className="small">{race.time?.split(':').slice(0, 2).join(':')}</span>
                                                </div>
                                            </div>
                                        </div>

                                        { }
                                        <div className="card-footer bg-transparent border-top-0 pt-0">
                                            <div className="d-grid gap-2">
                                                <Link
                                                    to={`/races/${race.round}`}
                                                    className="btn btn-outline-primary d-flex align-items-center justify-content-between"
                                                >
                                                    <span>Ver Detalles</span>
                                                    <FaChevronRight size={14} />
                                                </Link>
                                                {user && (
                                                    <Link
                                                        to={`/fantasy/draft/${race.round}`}
                                                        className="btn btn-outline-danger btn-sm d-flex align-items-center justify-content-between"
                                                    >
                                                        <span>Crear Equipo Fantasy</span>
                                                        <FaChevronRight size={12} />
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                { }
                <style jsx>{`
                    .races-banner {
                        background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), 
                                    url('/img/race-banner.jpg') no-repeat center center
                        background-size: cover
                        position: relative
                        padding: 100px 0
                        margin-top: -1.5rem
                    }
                    
                    .banner-overlay {
                        position: absolute
                        top: 0
                        left: 0
                        width: 100%
                        height: 100%
                        background: linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(200, 16, 46, 0.6) 100%)
                    }
                    
                    .z-index-1 {
                        position: relative
                        z-index: 1
                    }
                    
                    .transition-all {
                        transition: all 0.3s ease
                    }
                    
                    .hover-card:hover {
                        transform: translateY(-5px)
                        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2) !important
                    }
                    
                    .card {
                        border: none
                        border-radius: 0.75rem
                        overflow: hidden
                        transition: all 0.3s ease
                    }
                    
                    .card-img-top {
                        height: 180px
                        object-fit: cover
                    }
                `}</style>
            </div>
        )
    }


    return (
        <div className="container my-5">
            <h2 className="text-center mb-4">Calendario de Carreras 2025</h2>
            <p className="text-center">No hay carreras disponibles</p>
        </div>
    )
}

export default Races