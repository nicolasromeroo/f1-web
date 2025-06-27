import { useEffect, useState } from "react"
import axios from "axios"
const MyChampionship = () => {
    const [championship, setChampionship] = useState(null)
    const [error, setError] = useState("")
    useEffect(() => {
        const fetchChampionship = async () => {
            try {
                const res = await axios.get(`/api/fantasy/championship`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                })
                setChampionship(res.data)
            } catch (err) {
                setError("No se pudo obtener el campeonato")
            }
        }
        fetchChampionship()
    }, [])
    return (
        <div className="container mt-5">
            <h2>Mi Campeonato Fantasy</h2>

            {error && <div className="alert alert-danger">{error}</div>}

            {championship ? (
                <>
                    <h4 className="mt-3">Puntos totales:{(championship.totalPoints ?? (championship.history ? championship.history.reduce((sum, r) => sum + r.points, 0) : 0))}</h4>

                    <table className="table table-bordered mt-4">
                        <thead>
                            <tr>
                                <th>Ronda</th>
                                <th>Puntos</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(championship.history || []).map((entry, index) => (
                                <tr key={index}>
                                    <td>{entry.round}</td>
                                    <td>{entry.points}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            ) : (
                <p>Cargando datos del campeonato...</p>
            )
            }
        </div >
    )
}
export default MyChampionship