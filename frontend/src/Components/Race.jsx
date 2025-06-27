import React, { useState, useEffect } from "react"
import axios from 'axios'
import { useParams } from "react-router-dom"
import { motion } from "framer-motion"
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

const Race = () => {
    const { round } = useParams()
    const [race, setRace] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    useEffect(() => {
        if (!round) return
        const fetchRace = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/api/races/${round}`)
                setRace(data)
                setLoading(false)
            } catch (err) {
                console.error('Error detallado:', {
                    status: err.response?.status,
                    data: err.response?.data,
                    message: err.message
                })
                if (err.response?.status === 404) {
                    setError('Esta ronda no está disponible')
                } else {
                    setError('Error al cargar la carrera')
                }
                setLoading(false)
            }
        }
        fetchRace()
    }, [round])
    if (loading) {
        return (
            <div className="container mt-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="container mt-5">
                <div className="alert alert-warning">
                    {error}
                </div>
                <div className="mt-3">
                    <a href="/races" className="btn btn-primary">
                        Volver a la lista de carreras
                    </a>
                </div>
            </div>
        )
    }

    if (!race) {
        return null
    }

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-8 mx-auto">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title text-center mb-4">{race.grandPrix}</h2>
                            <div className="card-text">
                                <p><strong>Round:</strong> {race.round}</p>
                                <p><strong>Circuito:</strong> {race.circuit}</p>
                                <p><strong>Ubicación:</strong> {race.location}, {race.country}</p>
                                <p><strong>Fecha:</strong> {new Date(race.startDate).toLocaleDateString()}</p>
                            </div>
                            <div className="mt-3">
                                <a href="/races" className="btn btn-secondary">
                                    Volver a la lista de carreras
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Race