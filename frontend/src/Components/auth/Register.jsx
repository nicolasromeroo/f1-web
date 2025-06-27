import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { FaFlagCheckered, FaUserPlus } from "react-icons/fa"
const Register = () => {
    const [user, setUser] = useState({ email: '', password: '', role: 'user' })
    const [error, setError] = useState('')
    const navigate = useNavigate()
    const handleChange = (e) => {
        const { name, value } = e.target
        setUser({ ...user, [name]: value })
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        try {
            await axios.post('http://localhost:8080/api/auth/register', user)
            navigate('/login')
        } catch (error) {
            if (error.response && error.response.status === 409) {
                setError('El email ya está registrado.')
            } else {
                setError('Error al registrar el usuario.')
            }
        }
    }
    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow border-0">
                        <div className="card-body">
                            <h3
                                className="card-title mb-4 text-center text-danger fw-bold"
                                style={{ fontFamily: 'F1, Arial, sans-serif', letterSpacing: '2px' }}
                            >
                                <FaFlagCheckered className="me-2" />
                                Registro
                            </h3>
                            {error && <div className="alert alert-danger">{error}</div>}
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        placeholder="correo@ejemplo.com"
                                        name="email"
                                        value={user.email}
                                        onChange={handleChange}
                                        required
                                        style={{ fontFamily: 'F1, Arial, sans-serif' }}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Contraseña</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        placeholder="Contraseña"
                                        name="password"
                                        value={user.password}
                                        onChange={handleChange}
                                        required
                                        style={{ fontFamily: 'F1, Arial, sans-serif' }}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Rol</label>
                                    <select
                                        className="form-select"
                                        name="role"
                                        value={user.role}
                                        onChange={handleChange}
                                        style={{ fontFamily: 'F1, Arial, sans-serif' }}
                                    >
                                        <option value="user">Usuario</option>
                                        <option value="admin">Administrador</option>
                                    </select>
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-danger w-100 fw-bold"
                                    style={{ fontFamily: 'F1, Arial, sans-serif', letterSpacing: '1px' }}
                                >
                                    <FaUserPlus className="me-2" />
                                    Registrarse
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Register