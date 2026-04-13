import { useNavigate } from "react-router-dom";

export default function Footer() {
    const navigate = useNavigate();

    return (
        <div className="sticky-bottom">
            <footer
                className="container-fluid py-3"
                style={{
                    background: "linear-gradient(90deg, #000000, #1a0000)",
                    borderTop: "1px solid #333"
                }}
            >
                <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center text-danger gap-3">

                    <div className="small text-center text-md-start">
                        © 2026 Minden jog fenntartva
                    </div>

                    <button
                        type="button"
                        className="footer-brand-button fw-semibold"
                        onClick={() => navigate("/aboutus")}
                    >
                        AranyFolyam
                    </button>

                    <div className="d-flex gap-3 social-icons">
                        <a
                            href="https://www.facebook.com"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <i className="bi bi-facebook"></i>
                        </a>
                        <a
                            href="https://twitter.com"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <i className="bi bi-twitter-x"></i>
                        </a>
                        <a
                            href="https://www.tiktok.com"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <i className="bi bi-tiktok"></i>
                        </a>
                        <a
                            href="https://www.instagram.com"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <i className="bi bi-instagram"></i>
                        </a>
                    </div>

                </div>
            </footer>

            <style>{`
                .social-icons a {
                    color: #dc3545;
                    transition: color 0.2s ease-in-out;
                    font-size: 1.2rem;
                }

                .social-icons a:hover {
                    color: #e4606d;
                }

                .footer-brand-button {
                    background: transparent;
                    border: none;
                    color: #dc3545;
                    transition: color 0.2s ease-in-out, transform 0.2s ease-in-out;
                    cursor: pointer;
                    padding: 0;
                }

                .footer-brand-button:hover {
                    color: #e4606d;
                    transform: scale(1.03);
                }
            `}</style>
        </div>
    );
}