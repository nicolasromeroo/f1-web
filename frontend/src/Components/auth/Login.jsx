import axios from "axios"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../Contexts/AuthContext.jsx"
import { FaFlagCheckered, FaSignInAlt } from "react-icons/fa"
const Login = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' })
    const { login } = useAuth()
    const navigate = useNavigate()
    const [error, setError] = useState("")

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await login(credentials)
            navigate('/')
        } catch (error) {
            return console.error('Email o contraseña incorrectos.', error)
        }
    }
    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-5">
                    <div className="card shadow border-0">
                        <div className="card-body">
                            <h3
                                className="card-title mb-4 text-center text-danger fw-bold"
                                style={{ fontFamily: "F1, Arial, sans-serif", letterSpacing: "2px" }}
                            >
                                <FaFlagCheckered className="me-2" />
                                Iniciar Sesión
                            </h3>

                            {error && <div className="alert alert-danger">{error}</div>}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        placeholder="correo electrónico"
                                        name="email"
                                        value={credentials.email}
                                        onChange={handleChange}
                                        required
                                        style={{ fontFamily: "F1, Arial, sans-serif" }}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Contraseña</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        placeholder="Contraseña"
                                        name="password"
                                        value={credentials.password}
                                        onChange={handleChange}
                                        required
                                        style={{ fontFamily: "F1, Arial, sans-serif" }}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-danger w-100 fw-bold"
                                    style={{ fontFamily: "F1, Arial, sans-serif", letterSpacing: "1px" }}
                                >
                                    <FaSignInAlt className="me-2" />
                                    Ingresar
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Login