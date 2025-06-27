import React from 'react'
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa'
const Footer = () => {
    const currentYear = new Date().getFullYear()
    return (
        <footer className="bg-dark text-white pt-5 pb-4 mt-5">
            <div className="container">
                <div className="row">
                    {}
                    <div className="col-md-4 mb-4">
                        <h5 className="text-uppercase mb-4 f1-title">
                            <img src="/img/f1-logo.png" alt="F1 Logo" style={{ height: '30px' }} className="me-2" />
                            Fantasy F1
                        </h5>
                        <p className="small mb-0">
                            La mejor experiencia de Fantasy para los fanáticos de la Fórmula 1. 
                            Crea tu equipo y compite contra otros aficionados.
                        </p>
                    </div>
                    
                    <div className="col-md-3">
                        <h5 className="text-uppercase mb-4 f1-title">Enlaces Rápidos</h5>
                        <ul className="list-unstyled">
                            <li className="mb-2">
                                <a href="/" className="text-light text-decoration-none">Inicio</a>
                            </li>
                            <li className="mb-2">
                                <a href="/drivers" className="text-light text-decoration-none">Pilotos</a>
                            </li>
                            <li className="mb-2">
                                <a href="/races" className="text-light text-decoration-none">Carreras</a>
                            </li>
                            <li>
                                <a href="/fantasy" className="text-light text-decoration-none">Fantasy</a>
                            </li>
                        </ul>
                    </div>
                    
                    <div className="col-md-3">
                        <h5 className="text-uppercase mb-4 f1-title">Síguenos</h5>
                        <div className="d-flex gap-3">
                            <a href="#" className="text-light">
                                <FaFacebook size={20} />
                            </a>
                            <a href="#" className="text-light">
                                <FaTwitter size={20} />
                            </a>
                            <a href="#" className="text-light">
                                <FaInstagram size={20} />
                            </a>
                            <a href="#" className="text-light">
                                <FaYoutube size={20} />
                            </a>
                        </div>
                    </div>
                </div>
                
                <hr className="my-4 border-secondary" />
                
                <div className="row">
                    <div className="col-12 text-center">
                        <p className="small mb-0">
                            &copy; {currentYear} F1 Fantasy App. Todos los derechos reservados.
                            <br className="d-md-none" />
                            <span className="d-none d-md-inline"> | </span>
                            <a href="#" className="text-light ms-md-2">Términos y Condiciones</a>
                            <span> | </span>
                            <a href="#" className="text-light">Política de Privacidad</a>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    )
}
export default Footer