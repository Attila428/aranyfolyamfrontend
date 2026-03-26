export default function Footer() {
    return (
        <div className="sticky-bottom">
            <footer
                className="container-fluid py-3"
                style={{ background: "linear-gradient(90deg, #000000, #1a0000)", borderTop: "1px solid #333" }}
            >
                <div className="container d-flex justify-content-between align-items-center text-danger">

                    <div className="small">
                        © 2026 Minden jog fenntartva
                    </div>

                    <div className="fw-semibold">
                        AranyFolyam
                    </div>

                    <div className="d-flex gap-3 social-icons">
                        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                            <i className="bi bi-facebook"></i>
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                            <i className="bi bi-twitter-x"></i>
                        </a>
                        <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer">
                            <i className="bi bi-tiktok"></i>
                        </a>
                        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                            <i className="bi bi-instagram"></i>
                        </a>
                    </div>

                </div>
            </footer>

            <style>{`
                .social-icons a {
                    color: #dc3545; /* Bootstrap text-danger piros */
                    transition: color 0.2s ease-in-out;
                    font-size: 1.2rem;
                }
                .social-icons a:hover {
                    color: #e4606d; /* világosabb árnyalat hoverre */
                }
            `}</style>
        </div>
    )
}