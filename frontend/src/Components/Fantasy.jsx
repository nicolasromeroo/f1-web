import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext.jsx";
import { motion, AnimatePresence } from "framer-motion";
import classNames from "classnames";
import {
    FaCheckCircle,
    FaFlagCheckered,
    FaCrown,
    FaUserCheck,
    FaArrowLeft,
    FaSearch,
    FaTrophy,
    FaCalendarAlt,
    FaMapMarkerAlt,
    FaInfoCircle,
    FaUserPlus
} from "react-icons/fa";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const Loader = () => (
    <div className="d-flex justify-content-center align-items-center min-vh-50">
        <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Cargando...</span>
        </div>
    </div>
);

const DriverCard = React.memo(({
    driver,
    isSelected,
    isSecondary = false,
    onClick,
    isDisabled = false
}) => {
    const [imageSrc, setImageSrc] = useState(driver.image || '/img/drivers/default-driver.jpg');
    const [imageLoaded, setImageLoaded] = useState(false);

    useEffect(() => {
        if (driver.image) {
            const img = new Image();
            img.src = driver.image;
            img.onload = () => {
                setImageSrc(driver.image);
                setImageLoaded(true);
            };
            img.onerror = () => {
                setImageSrc('/img/drivers/default-driver.jpg');
                setImageLoaded(true);
            };

            return () => {
                img.onload = null;
                img.onerror = null;
            };
        } else {
            setImageLoaded(true);
        }
    }, [driver.image]);

    return (
        <motion.div
            className={classNames("card h-100 border-0 shadow-sm transition-all", {
                "border-danger border-2": isSelected && !isSecondary,
                "border-warning border-2": isSelected && isSecondary,
                "opacity-50": isDisabled,
                "cursor-pointer": !isDisabled,
                "cursor-not-allowed": isDisabled,
                "opacity-0": !imageLoaded,
                "opacity-100": imageLoaded
            })}
            whileHover={!isDisabled ? { scale: 1.03, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' } : {}}
            onClick={!isDisabled ? onClick : undefined}
            style={{
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                transition: 'opacity 0.3s ease-in-out'
            }}
        >
            <div className="position-relative">
                <div
                    className="card-img-top bg-light"
                    style={{
                        height: '180px',
                        backgroundImage: `url(${imageSrc})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center top',
                        backgroundRepeat: 'no-repeat',
                        transition: 'background-image 0.3s ease-in-out'
                    }}
                >
                    {!imageLoaded && (
                        <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Cargando...</span>
                            </div>
                        </div>
                    )}
                </div>
                {isSelected && imageLoaded && (
                    <div className="position-absolute top-2 right-2">
                        <div className="bg-white rounded-circle p-1 shadow-sm">
                            {isSecondary ? (
                                <FaUserCheck className="text-warning" />
                            ) : (
                                <FaCrown className="text-danger" />
                            )}
                        </div>
                    </div>
                )}
            </div>
            <div className="card-body text-center">
                <h5 className="card-title mb-1">{driver.name}</h5>
                <p className="card-text text-muted small mb-2">
                    {driver.team} • #{driver.number}
                </p>
                <div className="d-flex justify-content-center gap-2">
                    <span className="badge bg-dark">{driver.points || 0} pts</span>
                    <span className="badge bg-secondary">Pos: {driver.position || 'N/A'}</span>
                </div>
            </div>
        </motion.div>
    );
}, (prevProps, nextProps) => {
    return (
        prevProps.isSelected === nextProps.isSelected &&
        prevProps.isSecondary === nextProps.isSecondary &&
        prevProps.isDisabled === nextProps.isDisabled &&
        prevProps.driver._id === nextProps.driver._id
    );
});

const RaceCard = ({ race, onClick }) => (
    <motion.div
        className="card h-100 border-0 shadow-sm overflow-hidden hover-card"
        whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
        onClick={onClick}
    >
        <div className="position-relative">
            <img
                src={`/img/circuits/${race.circuitId}.jpg`}
                className="card-img-top"
                alt={race.circuitName}
                style={{ height: '140px', objectFit: 'cover' }}
                onError={(e) => {
                    e.target.src = '/img/circuits/default-circuit.jpg';
                }}
            />
            <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex flex-column justify-content-end p-3">
                <h5 className="text-white mb-0">{race.raceName}</h5>
                <p className="text-white-50 mb-0">{race.circuitName}</p>
            </div>
        </div>
        <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
                <div>
                    <FaCalendarAlt className="text-danger me-2" />
                    <small className="text-muted">
                        {new Date(race.date).toLocaleDateString('es-AR', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric'
                        })}
                    </small>
                </div>
                <div>
                    <FaMapMarkerAlt className="text-danger me-2" />
                    <small className="text-muted">{race.locality}, {race.country}</small>
                </div>
            </div>
        </div>
    </motion.div>
);

const Fantasy = () => {
    const { round } = useParams();
    const navigate = useNavigate();
    const auth = useAuth();

    const [drivers, setDrivers] = useState([]);
    const [filteredDrivers, setFilteredDrivers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMainDriver, setSelectedMainDriver] = useState(null);
    const [selectedSecondaryDrivers, setSelectedSecondaryDrivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [existingDraft, setExistingDraft] = useState(null);
    const [successMsg, setSuccessMsg] = useState("");
    const [race, setRace] = useState(null);
    const [availableRaces, setAvailableRaces] = useState([]);
    const [parsedRound, setRound] = useState(null);
    const [draftMode, setDraftMode] = useState(false);
    const [activeTab, setActiveTab] = useState('drivers');

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredDrivers(drivers);
        } else {
            const filtered = drivers.filter(driver =>
                driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                driver.team.toLowerCase().includes(searchTerm.toLowerCase()) ||
                driver.number.toString().includes(searchTerm)
            );
            setFilteredDrivers(filtered);
        }
    }, [searchTerm, drivers]);

    useEffect(() => {
        const fetchRaces = async () => {
            try {
                if (!auth.token) {
                    setError('No estás autenticado');
                    return;
                }

                const response = await axios.get(`${API_URL}/api/races`, {
                    headers: {
                        Authorization: `Bearer ${auth.token}`
                    }
                });
                setAvailableRaces(response.data);
            } catch (error) {
                console.error('Error detallado:', {
                    status: error.response?.status,
                    data: error.response?.data,
                    message: error.message
                });

                if (error.response?.status === 401) {
                    setError('No estás autenticado');
                    localStorage.removeItem('token');
                    setToken(null);
                } else {
                    setError('Error al cargar las carreras disponibles');
                }
            }
        };
        fetchRaces();
    }, [auth.token]);

    useEffect(() => {
        if (!round) {
            setError('');
            setLoading(true);
            return;
        }

        const parsedRoundValue = parseInt(round, 10);
        if (!isNaN(parsedRoundValue)) {
            setRound(parsedRoundValue);
            if (window.location.pathname.includes('/draft/')) {
                setDraftMode(true);
            }
        }
    }, [round]);

    useEffect(() => {
        if (parsedRound && availableRaces.length > 0) {
            const raceExists = availableRaces.some(race => race.round === parsedRound);
            if (!raceExists) {
                setError('Esta ronda no está disponible');
                setLoading(false);
            } else {
                fetchRaceDetails(parsedRound);
            }
        } else if (parsedRound && !availableRaces.length) {
            window.location.href = '/fantasy';
        }
    }, [parsedRound, availableRaces]);

    const fetchRaceDetails = async (round) => {
        try {
            const { data } = await axios.get(`${API_URL}/api/races/${round}`);
            setRace(data);
            setLoading(false);
        } catch (err) {
            console.error('Error detallado:', {
                status: err.response?.status,
                data: err.response?.data,
                message: err.message
            });

            if (err.response?.status === 404) {
                setError('Esta ronda no está disponible');
            } else {
                setError('Error al cargar la carrera');
            }
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchInitialData = async () => {
            if (!auth.token) {
                setError('No estás autenticado');
                return;
            }

            if (!parsedRound) {
                setError('Número de ronda no válido');
                return;
            }

            try {
                const profileRes = await axios.get(`${API_URL}/api/auth/profile`, {
                    headers: { Authorization: `Bearer ${auth.token}` }
                });
                console.log('Perfil verificado:', profileRes.data);

                const raceRes = await axios.get(`${API_URL}/api/races/${parsedRound}`, {
                    headers: { Authorization: `Bearer ${auth.token}` }
                });
                console.log('Carrera obtenida:', raceRes.data);
                setRace(raceRes.data);

                try {
                    const draftRes = await axios.get(`${API_URL}/api/fantasy/drafts/${parsedRound}`, {
                        headers: { Authorization: `Bearer ${auth.token}` },
                        validateStatus: (status) => (status === 200 || status === 404)
                    });

                    if (draftRes.status === 200) {
                        console.log('Draft encontrado:', draftRes.data);
                        setExistingDraft(draftRes.data);
                    } else {
                        console.log('No hay draft para esta ronda');
                        setExistingDraft(null);
                    }
                } catch (draftErr) {
                    console.log('Error al cargar el draft:', draftErr);
                    setExistingDraft(null);
                }

            } catch (err) {
                if (err.response?.status === 404 && err.config.url.includes('drafts')) {
                    console.log('No draft para esta ronda');
                    setExistingDraft(null);
                } else if (err.response?.status === 404 && err.config.url.includes('races')) {
                    setError('Esta ronda no existe');
                } else if (err.response?.status === 401) {
                    setError('Token inválido');
                    localStorage.removeItem('token');
                    setToken(null);
                } else {
                    setError('Error general al cargar datos');
                    console.error('Error:', err);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, [parsedRound, auth.token]);


    useEffect(() => {
        if (!auth.token) {
            setError('No estás autenticado');
            return;
        }

        const verifyToken = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/profile`, {
                    headers: { Authorization: `Bearer ${auth.token}` }
                });
                console.log('Token verificado:', response.data);
                setError('');
            } catch (err) {
                console.error('Error verificando token:', err);
                setError('No estás autenticado');
                localStorage.removeItem('token');
                auth.logout();
            }
        };
        verifyToken();
    }, [auth.token]);

    useEffect(() => {
        const fetchDrivers = async () => {
            try {
                setLoading(true);
                console.log('Cargando pilotos desde:', `${API_URL}/api/drivers`);
                const response = await axios.get(`${API_URL}/api/drivers`);
                console.log('Respuesta de la API de pilotos:', response.data);

                console.log('Datos crudos de pilotos:', response.data);

                const driversWithImages = response.data.map(driver => {
                    const generateImageName = (name) => {
                        if (!name) return 'default-driver.jpg';
                        return `${name.toLowerCase().replace(/\s+/g, '-')}.jpg`;
                    };

                    const imageUrl = driver.image || driver.imageUrl ||
                        `/img/drivers/${generateImageName(driver.name)}`;

                    const driverId = driver.driverId || driver._id || driver.id || 'default';

                    console.log(`Procesando piloto: ${driver.name}`, {
                        driverId,
                        imageUrl,
                        driverData: driver
                    });

                    return {
                        ...driver,
                        driverId,
                        image: imageUrl,
                        name: driver.name || 'Piloto Desconocido',
                        team: driver.team || 'Equipo Desconocido',
                        number: driver.number || '--',
                        points: driver.points || 0,
                        position: driver.position || '--'
                    };
                });

                const sortedDrivers = driversWithImages.sort((a, b) => (b.points || 0) - (a.points || 0));
                console.log('Pilotos procesados y ordenados:', sortedDrivers);

                setDrivers(sortedDrivers);
                setFilteredDrivers(sortedDrivers);
            } catch (err) {
                console.error('Error al cargar pilotos:', err);
                if (err.response) {
                    console.error('Respuesta del servidor:', err.response.data);
                    console.error('Status:', err.response.status);
                }
                setError('Error al cargar la lista de pilotos');
            } finally {
                setLoading(false);
            }
        };


        if (auth.token) {
            fetchDrivers();
        } else {
            console.log('No hay token de autenticación, no se pueden cargar los pilotos');
        }
    }, [auth.token]);

    const handleDriverSelect = (driver) => {
        if (isDriverDisabled(driver)) {
            return;
        }

        if (selectedMainDriver?._id === driver._id) {
            setSelectedMainDriver(null);
            return;
        }

        if (selectedSecondaryDrivers.some(d => d._id === driver._id)) {
            setSelectedSecondaryDrivers(prev => prev.filter(d => d._id !== driver._id));
            return;
        }
        if (!selectedMainDriver) {
            setSelectedMainDriver(driver);
            return;
        }

        if (selectedSecondaryDrivers.length >= 2) {
            return;
        }
        setSelectedSecondaryDrivers(prev => [...prev, driver]);
    };

    const isDriverSelected = (driverId) => {
        return (
            selectedMainDriver?._id === driverId ||
            selectedSecondaryDrivers.some(d => d._id === driverId)
        );
    };

    const isDriverDisabled = (driver) => {
        if (selectedSecondaryDrivers.length >= 2 &&
            !isDriverSelected(driver._id) &&
            selectedMainDriver?._id !== driver._id) {
            return true;
        }
        return false;
    };

    const renderDriversList = () => (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {filteredDrivers.map(driver => (
                <div className="col" key={driver._id}>
                    <DriverCard
                        driver={driver}
                        isSelected={isDriverSelected(driver._id)}
                        isSecondary={selectedSecondaryDrivers.some(d => d._id === driver._id)}
                        isDisabled={isDriverDisabled(driver)}
                        onClick={() => handleDriverSelect(driver)}
                    />
                </div>
            ))}
        </div>
    );

    useEffect(() => {
        const fetchDraft = async () => {
            try {
                if (!auth.token) {
                    setError('No estás autenticado');
                    return;
                }
                if (!parsedRound) {
                    setError('Número de ronda no válida');
                    return;
                }

                console.log('Buscando draft con:', { parsedRound });

                const { data } = await axios.get(`${API_URL}/api/fantasy/drafts/${parsedRound}`, {
                    headers: {
                        Authorization: `Bearer ${auth.token}`
                    }
                });
                setExistingDraft(data);
            } catch (err) {
                if (err.response?.status === 404) {
                    console.log('No draft found for this race, showing draft creation form');
                    setExistingDraft(null); // No hay draft aún
                } else if (err.response?.status === 401) {
                    setError('No estás autenticado');
                } else {
                    setError('Error al cargar el draft');
                    console.error('Error fetching draft:', err);
                }
            }
        };
        fetchDraft();
    }, [parsedRound, auth.token]);

    const toggleDriver = (id) => {
        if (selectedMainDriver === id) {
            setSelectedMainDriver(null);
        } else if (selectedSecondaryDrivers.includes(id)) {
            setSelectedSecondaryDrivers((prev) => prev.filter((d) => d !== id));
        } else if (!selectedMainDriver) {
            setSelectedMainDriver(id);
        } else if (selectedSecondaryDrivers.length < 2) {
            setSelectedSecondaryDrivers((prev) => [...prev, id]);
        }
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();

        if (!selectedMainDriver || selectedSecondaryDrivers.length < 2) {
            setError('Debes seleccionar un piloto principal y dos pilotos secundarios');
            return;
        }

        try {
            setLoading(true);
            setError('');

            const draftData = {
                mainDriverId: selectedMainDriver._id,
                secondaryDriversIds: selectedSecondaryDrivers.map(d => d._id),
                teamId: '',
                powerUnitId: ''
            };

            console.log('Enviando datos del draft:', draftData);

            if (race && race.startDate && new Date(race.startDate) < new Date()) {
                toast.error('No se puede crear un equipo para una carrera que ya ha finalizado');
                setLoading(false);
                return;
            }

            const response = await axios.post(
                `http://localhost:8080/api/fantasy/drafts/${race.round}`,
                draftData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${auth.token}`
                    }
                }
            );

            toast.success('¡Equipo guardado exitosamente!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });

            setExistingDraft(response.data);

            navigate(`/fantasy/${race.round}`, { state: { draftSaved: true } });

        } catch (err) {
            console.error('Error al guardar el equipo:', {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status
            });

            let errorMessage = 'Error al guardar el equipo. Por favor, inténtalo de nuevo.';

            if (err.response?.data?.msg) {
                errorMessage = err.response.data.msg;
            } else if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err.message === 'Network Error') {
                errorMessage = 'Error de conexión. Verifica tu conexión a internet.';
            }

            toast.error(errorMessage, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    };

    if (!auth.token) {
        return (
            <div className="container my-5">
                <div className="row justify-content-center">
                    <div className="col-md-8 text-center">
                        <div className="card border-0 shadow">
                            <div className="card-body p-5">
                                <h2 className="text-danger mb-4">Acceso Restringido</h2>
                                <p className="lead mb-4">Debes iniciar sesión para acceder a Fantasy F1</p>
                                <button
                                    className="btn btn-danger btn-lg px-4"
                                    onClick={() => navigate('/login')}
                                >
                                    Iniciar Sesión
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!parsedRound) {
        return (
            <div className="container my-5">
                <div className="text-center mb-5">
                    <h1 className="display-5 fw-bold text-danger mb-3">Fantasy F1</h1>
                    <p className="lead text-muted">Selecciona una carrera para crear tu equipo</p>
                </div>

                <div className="mb-4">
                    <div className="input-group input-group-lg">
                        <span className="input-group-text bg-white border-end-0">
                            <FaSearch className="text-muted" />
                        </span>
                        <input
                            type="text"
                            className="form-control border-start-0 ps-0"
                            placeholder="Buscar circuito o país..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? (
                    <Loader />
                ) : error ? (
                    <div className="alert alert-danger">{error}</div>
                ) : (
                    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                        {availableRaces.map(race => (
                            <div className="col" key={race._id}>
                                <RaceCard
                                    race={race}
                                    onClick={() => navigate(`/fantasy/draft/${race.round}`)}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    if (existingDraft) {
        return (
            <div className="container my-5">
                <button
                    className="btn btn-outline-secondary mb-4"
                    onClick={() => navigate('/fantasy')}
                >
                    <FaArrowLeft className="me-2" /> Volver a carreras
                </button>

                <div className="card border-0 shadow-lg overflow-hidden">
                    <div className="card-header bg-dark text-white py-3">
                        <div className="d-flex justify-content-between align-items-center">
                            <h2 className="h4 mb-0">
                                <FaFlagCheckered className="me-2 text-danger" />
                                Mi Equipo - {race?.raceName}
                            </h2>
                            <span className="badge bg-danger">Completado</span>
                        </div>
                    </div>

                    <div className="card-body p-4">
                        <div className="alert alert-success">
                            <FaCheckCircle className="me-2" />
                            Has completado tu equipo para esta carrera. ¡Buena suerte!
                        </div>

                        <div className="row g-4 mt-3">
                            <div className="col-12">
                                <h5 className="text-uppercase text-muted mb-3">Piloto Principal</h5>
                                <div className="card border-danger border-2">
                                    <div className="card-body">
                                        <div className="row align-items-center">
                                            {/* <div className="col-md-2"> */}
                                            {/* <img
                                                    src={existingDraft?.mainDriver?.image || '/img/drivers/default-driver.jpg'}
                                                    alt={existingDraft?.mainDriver?.name || 'Piloto'}
                                                    className="img-fluid rounded-circle border border-danger"
                                                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                                    onError={(e) => e.target.src = '/img/drivers/default-driver.jpg'}
                                                </div> */}
                                            <div className="col-md-10">
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <div>
                                                        <h4 className="mb-1">{existingDraft?.mainDriver?.name || 'Piloto Principal'}</h4>
                                                        <p className="text-muted mb-1">
                                                            {existingDraft?.mainDriver?.team ? `${existingDraft.mainDriver.team} • ` : ''}
                                                            {existingDraft?.mainDriver?.number ? `#${existingDraft.mainDriver.number}` : ''}
                                                        </p>
                                                        <span className="badge bg-danger">Doble Puntos</span>
                                                    </div>
                                                    <div className="text-end">
                                                        <div className="display-5 fw-bold text-danger">
                                                            {existingDraft?.mainDriver?.points || '0'}
                                                        </div>
                                                        <small className="text-muted">Puntos</small>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-12 mt-4">
                                <h5 className="text-uppercase text-muted mb-3">Pilotos Secundarios</h5>
                                <div className="row g-4">
                                    {existingDraft?.secondaryDrivers?.map((driver, index) => (
                                        <div className="col-md-6" key={driver?._id || index}>
                                            <div className="card h-100 border-warning">
                                                <div className="card-body">
                                                    <div className="row align-items-center">
                                                        {/* <div className="col-3">
                                                            {/* <img
                                                                src={driver?.image || '/img/drivers/default-driver.jpg'}
                                                                alt={driver?.name || 'Piloto'}
                                                                className="img-fluid rounded-circle border border-warning"
                                                                style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                                                onError={(e) => e.target.src = '/img/drivers/default-driver.jpg'}
                                                            /> 
                                                        </div> */}
                                                        <div className="col-9">
                                                            <div className="d-flex justify-content-between align-items-center">
                                                                <div>
                                                                    <h5 className="mb-1">{driver?.name || 'Piloto'}</h5>
                                                                    <p className="text-muted mb-1 small">
                                                                        {driver?.team ? `${driver.team} • ` : ''}
                                                                        {driver?.number ? `#${driver.number}` : ''}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="col-12 mt-4">
                                <div className="card bg-light">
                                    <div className="card-body">
                                        <div className="row text-center">
                                            <div className="col-md-4 border-end">
                                                <h4 className="text-muted mb-1">Puntos Totales</h4>
                                                <h2 className="text-danger fw-bold">
                                                    {existingDraft.totalPoints || '0'}
                                                </h2>
                                            </div>
                                            <div className="col-md-4 border-end">
                                                <h4 className="text-muted mb-1">Posición</h4>
                                                <h2 className="text-primary fw-bold">
                                                    {existingDraft.position || '--'}
                                                    {existingDraft.position && <small className="text-muted">°</small>}
                                                </h2>
                                            </div>
                                            <div className="col-md-4">
                                                <h4 className="text-muted mb-1">Diferencia</h4>
                                                <h2 className="fw-bold">
                                                    {existingDraft.gapToLeader ? `${existingDraft.gapToLeader} pts` : '--'}
                                                </h2>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card-footer bg-light border-0 py-3">
                        <div className="d-flex justify-content-between align-items-center">
                            <small className="text-muted">
                                Creado el {new Date(existingDraft.createdAt).toLocaleDateString()}
                            </small>
                            <button
                                className="btn btn-outline-danger"
                                onClick={() => navigate('/fantasy')}
                            >
                                Ver Otras Carreras
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container my-5">
                <div className="alert alert-warning">
                    <div className="d-flex align-items-center">
                        <div className="flex-grow-1">
                            <h5 className="alert-heading">¡Ups! Algo salió mal</h5>
                            <p className="mb-0">{error}</p>
                        </div>
                        <button
                            className="btn btn-outline-secondary ms-3"
                            onClick={() => navigate('/fantasy')}
                        >
                            <FaArrowLeft className="me-2" /> Volver
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="container my-5">
                <div className="d-flex justify-content-center align-items-center min-vh-50">
                    <div className="text-center">
                        <div className="spinner-border text-danger" style={{ width: '3rem', height: '3rem' }} role="status">
                            <span className="visually-hidden">Cargando...</span>
                        </div>
                        <h4 className="mt-3">Cargando datos del equipo...</h4>
                        <p className="text-muted">Estamos preparando todo para que armes tu equipo</p>
                    </div>
                </div>
            </div>
        );
    }
    console.log("Drivers para seleccionar:", filteredDrivers);

    return (
        <div className="container my-5">
            <button
                className="btn btn-outline-secondary mb-4"
                onClick={() => navigate('/fantasy')}
            >
                <FaArrowLeft className="me-2" /> Volver a carreras
            </button>

            <div className="card border-0 shadow-lg overflow-hidden">
                <div className="card-header bg-dark text-white py-3">
                    <h2 className="h4 mb-0">
                        <FaFlagCheckered className="me-2 text-danger" />
                        Crear Equipo - {race?.raceName}
                    </h2>
                </div>

                <div className="card-body p-4">
                    <div className="alert alert-info">
                        <FaInfoCircle className="me-2" />
                        Selecciona 1 piloto principal (doble puntos) y 2 pilotos secundarios para tu equipo.
                    </div>

                    <div className="row mb-4">
                        <div className="col-md-4 mb-3 mb-md-0">
                            <div className="card h-100 border-2 border-danger">
                                <div className="card-body text-center">
                                    <h6 className="text-uppercase text-muted small mb-2">Piloto Principal</h6>
                                    {selectedMainDriver ? (
                                        <div>
                                            <img
                                                src={`/img/${selectedMainDriver.image || 'default-driver.jpg'}`}
                                                alt={selectedMainDriver.name}
                                                className="img-fluid rounded-circle border border-danger mb-2"
                                                style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                            />
                                            <h5 className="mb-1">{selectedMainDriver.name}</h5>
                                            <p className="text-muted small mb-0">
                                                {selectedMainDriver.team} • #{selectedMainDriver.number}
                                            </p>
                                            <span className="badge bg-danger mt-2">Doble Puntos</span>
                                        </div>
                                    ) : (
                                        <div className="text-muted py-4">
                                            <FaUserPlus size={24} className="mb-2" />
                                            <p className="mb-0">Selecciona un piloto</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="col-md-8">
                            <div className="card h-100 border-0 bg-light">
                                <div className="card-body">
                                    <h6 className="text-uppercase text-muted small mb-3">Pilotos Secundarios</h6>
                                    <div className="row g-3">
                                        {[1, 2].map((_, index) => (
                                            <div className="col-md-6" key={index}>
                                                <div className="card h-100 border-2 border-warning">
                                                    <div className="card-body text-center">
                                                        {selectedSecondaryDrivers[index] ? (
                                                            <div>
                                                                <img
                                                                    src={`/img/${selectedSecondaryDrivers[index].image || 'default-driver.jpg'}`}
                                                                    alt={selectedSecondaryDrivers[index].name}
                                                                    className="img-fluid rounded-circle border border-warning mb-2"
                                                                    style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                                                                />
                                                                <h6 className="mb-1">{selectedSecondaryDrivers[index].name}</h6>
                                                                <p className="text-muted small mb-0">
                                                                    {selectedSecondaryDrivers[index].team} • #{selectedSecondaryDrivers[index].number}
                                                                </p>
                                                            </div>
                                                        ) : (
                                                            <div className="text-muted py-3">
                                                                <FaUserPlus className="mb-2" />
                                                                <p className="mb-0 small">Piloto {index + 1}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Lista de pilotos
                    <div className="mb-4">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="mb-0">Selecciona tus pilotos</h5>
                            <div className="input-group" style={{ maxWidth: '300px' }}>
                                <span className="input-group-text bg-white border-end-0">
                                    <FaSearch className="text-muted" />
                                </span>
                                <input
                                    type="text"
                                    className="form-control border-start-0 ps-0"
                                    placeholder="Buscar piloto o equipo..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        {loading ? (
                            <Loader />
                        ) : (
                            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                                {filteredDrivers.map(driver => (
                                    <div div className="col" key={driver._id}>
                                        {/* Mostrás la imagen directamente */}
                    {/* <img
                                            src={`/img/${driver.image}`}
                                            alt={driver.name}
                                            className="img-fluid rounded shadow mb-2"
                                            style={{ height: '180px', objectFit: 'cover' }}
                                        />

                                        <DriverCard
                                            driver={driver}
                                            isSelected={isDriverSelected(driver._id)}
                                            isSecondary={selectedSecondaryDrivers.some(d => d._id === driver._id)}
                                            isDisabled={isDriverDisabled(driver)}
                                            onClick={() => handleDriverSelect(driver)}
                                        /> *
                                    </div>
                                ))}
                            </div>
                        )}
                    </div> */}
                    <div className="container mt-5">
                        <h2 className="text-danger text-center mb-4" style={{ fontFamily: 'F1, Arial, sans-serif' }}>
                            Seleccioná tus pilotos
                        </h2>
                        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                            {filteredDrivers.map(driver => {
                                const isSelected = isDriverSelected(driver._id);
                                const isDisabled = isDriverDisabled(driver);

                                return (
                                    <div className="col" key={driver._id}>
                                        <div
                                            className={`card h-100 text-center shadow border-0 ${isDisabled ? 'opacity-50' : 'hover-shadow'}`}
                                            onClick={!isDisabled ? () => handleDriverSelect(driver) : undefined}
                                            style={{ cursor: isDisabled ? 'not-allowed' : 'pointer', backgroundColor: '#1c1c1e' }}
                                        >
                                            <div className="position-relative">
                                                <img
                                                    src={`/img/${driver.image}`}
                                                    alt={driver.name}
                                                    className="card-img-top rounded-top"
                                                    style={{
                                                        height: '250px',
                                                        objectFit: 'cover',
                                                        objectPosition: 'center top',
                                                        transition: 'transform 0.3s ease'
                                                    }}
                                                />
                                                {isSelected && (
                                                    <FaCheckCircle
                                                        className="position-absolute top-0 end-0 m-2 text-success"
                                                        size={24}
                                                        title="Seleccionado"
                                                    />
                                                )}
                                            </div>
                                            <div className="card-body text-white" style={{ backgroundColor: '#1c1c1e' }}>
                                                <h6 className="card-title mb-1 fw-bold">{driver.name}</h6>
                                                <p className="card-text text-muted small">{driver.team}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-4 text-center text-light">
                            <p>
                                Piloto principal:{" "}
                                <strong className={selectedMainDriver ? "text-success" : "text-danger"}>
                                    {selectedMainDriver ? "Seleccionado" : "Ninguno"}
                                </strong>
                            </p>
                            <p>
                                Pilotos secundarios:{" "}
                                <strong className={selectedSecondaryDrivers.length === 2 ? "text-success" : "text-warning"}>
                                    {selectedSecondaryDrivers.length}/2
                                </strong>
                            </p>

                            <button
                                className="btn btn-danger mt-3 fw-bold"
                                disabled={!selectedMainDriver || selectedSecondaryDrivers.length !== 2}
                                onClick={handleSubmit}
                            >
                                Confirmar Selección
                            </button>
                        </div>
                    </div>


                    <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => {
                                setSelectedMainDriver(null);
                                setSelectedSecondaryDrivers([]);
                            }}
                            disabled={!selectedMainDriver && selectedSecondaryDrivers.length === 0}
                        >
                            Limpiar selección
                        </button>

                        <button
                            type="button"
                            className="btn btn-danger px-4"
                            disabled={!selectedMainDriver || selectedSecondaryDrivers.length < 2}
                            onClick={handleSubmit}
                        >
                            <FaCheckCircle className="me-2" />
                            Confirmar equipo
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

};

export default Fantasy;
