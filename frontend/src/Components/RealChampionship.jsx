
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { FaCrown, FaMedal } from 'react-icons/fa'

const RealChampionship = () => {
    const [standings, setStandings] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        fetchStandings()
    }, [])

    const fetchStandings = async () => {
        try {
            const response = await axios.post(`http://localhost:8080/api/real-championship/import-local/${round}`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            })

            setStandings(response.data)
        } catch (err) {
            setError(err.response?.data?.msg || 'Error al cargar el campeonato')
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <div className="text-center">Cargando...</div>
    if (error) return <div className="alert alert-danger">{error}</div>

    return (
        <div className="container my-5">
            <h2 className="mb-4">Campeonato Mundial de Pilotos 2025</h2>
            <div className="table-responsive">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Puesto</th>
                            <th>Piloto</th>
                            <th>Equipo</th>
                            <th>Puntos</th>
                        </tr>
                    </thead>
                    <tbody>
                        {standings.map((driver, index) => (
                            <tr key={driver.driverId}>
                                <td>
                                    {index === 0 ? (
                                        <FaCrown className="text-warning" />
                                    ) : index === 1 ? (
                                        <FaMedal className="text-secondary" />
                                    ) : (
                                        index + 1
                                    )}
                                </td>
                                <td>{driver.driverId}</td>
                                <td>{driver.team}</td>
                                <td>{driver.points}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default RealChampionship