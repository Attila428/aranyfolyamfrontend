import { useState } from "react"
import Button from "./button"
import { Link } from "react-router-dom"
import logo from "../assets/aranyfolyamlogo.png"

export default function NavBar({ user, onLogout }) {

    const [menuOpen, setMenuOpen] = useState(false)

    const isLoggedIn = !!user
    const isAdmin = user?.role === "admin"

    return (
        <div
            className="container-fluid px-4"
            style={{
                background: "linear-gradient(135deg, #000000, #1a0000)"
            }}
        >

            <div className="d-flex align-items-center justify-content-between py-3">

                {/* LOGO */}
                <img
                    src={logo}
                    alt="logo"
                    className="img-fluid"
                    style={{ height: 80 }}
                />

                {/* DESKTOP MENU */}
                <div className="d-none d-md-flex align-items-center gap-3">

                    {isLoggedIn ? (
                        <>
                            <Button
                                buttonClass="btn btn-danger px-4"
                                content="Kijelentkezés"
                                onClick={onLogout}

                            />
                            <Link
                                className="px-3 py-1 text-decoration-none rounded"
                                style={{ fontSize: 20, color: "red" }}
                                to="/login"
                            >
                                HomePage
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link
                                className="px-3 py-1 text-decoration-none rounded"
                                style={{ fontSize: 20, color: "red" }}
                                to="/login"
                            >
                                Bejelentkezés
                            </Link>
                            <Link
                                className="px-3 py-1 text-decoration-none rounded"
                                style={{ fontSize: 20, color: "red" }}
                                to="/register"
                            >
                                Regisztráció
                            </Link>
                        </>

                    )}

                </div>

                {/* MOBILE HAMBURGER */}
                <div className="d-md-none">

                    <button
                        className="btn btn-outline-light"
                        onClick={() => setMenuOpen(!menuOpen)}
                        style={{ fontSize: 24, color: "red", borderColor: "red" }}
                    >
                        ☰
                    </button>

                </div>
            </div>

            {/* mobil menü */}
            {menuOpen && (
                <div className="d-md-none pb-3">

                    {isLoggedIn ? (
                        <Button
                            buttonClass="btn btn-danger w-100"
                            content="Kijelentkezés"
                            onClick={onLogout}
                        />
                    ) : (
                        <Link
                            className="d-block text-center py-2 text-decoration-none rounded"
                            style={{ fontSize: 18, color: "red" }}
                            to="/login"
                        >
                            Bejelentkezés
                        </Link>
                    )}

                </div>
            )}
        </div>
    )
}