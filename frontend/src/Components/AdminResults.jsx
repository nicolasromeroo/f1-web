import { useState, useEffect } from "react"
import axios from "axios"
import { FaCloudDownloadAlt } from "react-icons/fa"
import { useAuth } from "../Contexts/AuthContext.jsx"

const AdminResults = () => {
    const [round, setRound] = useState("")
    const [availableRounds, setAvailableRounds] = useState([])
    const [preview, setPreview] = useState(null)
    const [msg, setMsg] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const { token } = useAuth()

    useEffect(() => {
        setAvailableRounds(Array.from({ length: 24 }, (_, i) => i + 1))
    }, [])

    const handleImport = async () => {
        if (!token) {
            setError('No estás autorizado. Inicia sesión para continuar.');
            return;
        }

        try {
            const res = await axios.post(
                `http://localhost:8080/api/results/import-local/${round}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setMsg(res.data.msg);
            setError('');
        } catch (err) {
            setError(err.response?.data?.msg || 'Error al importar');
            setMsg('');
        }
    };


    const handleSelectChange = (e) => {
        setRound(e.target.value)
        setMsg("")
        setError("")
        setPreview(null)
    }

    return (
        <div className="container my-5">
            <h2 className="mb-4 text-center">Panel de Administración de Resultados</h2>

            <div className="row align-items-end">
                <div className="col-md-4">
                    <label className="form-label">Seleccionar Ronda:</label>
                    <select className="form-select" value={round} onChange={handleSelectChange}>
                        <option value="">-- Selecciona una ronda --</option>
                        {availableRounds.map(r => (
                            <option key={r} value={r}>{`Ronda ${r}`}</option>
                        ))}
                    </select>
                </div>
                <div className="col-md-4 mt-3 mt-md-0">
                    <button
                        className="btn btn-success w-100 d-flex align-items-center justify-content-center gap-2"
                        onClick={handleImport}
                        disabled={loading}
                    >
                        <FaCloudDownloadAlt />
                        {loading ? "Importando..." : "Importar Resultados"}
                    </button>
                </div>
            </div>

            {msg && <div className="alert alert-success mt-4">{msg}</div>}
            {error && <div className="alert alert-danger mt-4">{error}</div>}

            {preview && (
                <div className="mt-4">
                    <h5>Resultados Importados</h5>
                    <div className="table-responsive">
                        <table className="table table-bordered table-hover">
                            <thead className="table-dark">
                                <tr>
                                    <th>Posición</th>
                                    <th>Piloto</th>
                                    <th>Equipo</th>
                                    <th>Puntos</th>
                                </tr>
                            </thead>
                            <tbody>
                                {preview.map((result, idx) => (
                                    <tr key={idx}>
                                        <td>{result.position}</td>
                                        <td>{result.driverName}</td>
                                        <td>{result.team}</td>
                                        <td>{result.points}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminResults
