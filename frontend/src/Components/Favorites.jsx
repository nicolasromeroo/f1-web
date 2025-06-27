import axios from "axios"
import { useEffect, useState } from "react"
import { FaFlagCheckered } from "react-icons/fa"
const Favorites = () => {
    const [favorites, setFavorites] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    useEffect(() => {
        const fetchFavorites = async () => {
            try {

                const favIds = JSON.parse(localStorage.getItem("pilotFavs")) || []
                if (favIds.length === 0) {
                    setFavorites([])
                    return
                }


                const { data } = await axios("http://localhost:8080/drivers")
                const favDrivers = data.drivers.filter((d) => favIds.includes(d._id))
                setFavorites(favDrivers)
            } catch (err) {
                console.error(err)
                setError("Error al obtener pilotos favoritos")
            } finally {
                setLoading(false)
            }
        }
        fetchFavorites()
    }, [])
    if (loading) return <div className="text-center mt-5">Cargando favoritos…</div>
    if (error) return <div className="alert alert-danger mt-5">{error}</div>
    if (favorites.length === 0) {
        return (
            <div className="container mt-5">
                <div className="alert alert-info text-center">
                    Aún no tienes pilotos en favoritos. ¡Agrégalos desde la lista de pilotos!
                </div>
            </div>
        )
    }


    return (
        <div className="container mt-5">
            <h2
                className="mb-4 text-danger fw-bold d-flex align-items-center"
                style={{ fontFamily: "F1, Arial, sans-serif", letterSpacing: "2px" }}
            >
                <FaFlagCheckered className="me-2" />
                Mis Pilotos Favoritos
            </h2>

            <div className="table-responsive">
                <table className="table table-striped table-hover align-middle">
                    <thead className="table-dark">
                        <tr>
                            <th>#</th>
                            <th>Nombre</th>
                            <th>Equipo</th>
                            <th>País</th>
                            <th>Victorias</th>
                            <th>Podios</th>
                            <th>Poles</th>
                        </tr>
                    </thead>

                    <tbody>
                        {favorites.map((driver) => (
                            <tr key={driver._id}>
                                <td>{driver.number}</td>
                                <td>{driver.name}</td>
                                <td>{driver.team}</td>
                                <td>
                                    <span className="badge bg-secondary">{driver.country}</span>
                                </td>
                                <td>{driver.wins}</td>
                                <td>{driver.podiums}</td>
                                <td>{driver.poles}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
export default Favorites