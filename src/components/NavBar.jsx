import { useState } from "react";
import Button from "./button";
import { Link } from "react-router-dom";
import logo from "../assets/aranyfolyamlogo.png";

export default function NavBar({ user, onLogout }) {
    const [menuOpen, setMenuOpen] = useState(false);

    const isLoggedIn = !!user;
    const isAdmin = user?.user_role === "admin";

    return (
        <div
            className="container-fluid px-4"
            style={{
                background: "linear-gradient(135deg, #000000, #1a0000)",
            }}
        >
            <div className="d-flex align-items-center justify-content-between py-3">
                <Link to="/">
                    <img
                        src={logo}
                        alt="logo"
                        className="img-fluid"
                        style={{ height: 80, cursor: "pointer" }}
                    />
                </Link>

                <div className="d-none d-md-flex align-items-center gap-3">
                    {isLoggedIn ? (
                        <>
                            {isAdmin && (
                                <Link
                                    className="px-3 py-1 text-decoration-none rounded"
                                    style={{ fontSize: 20, color: "red" }}
                                    to="/AdminPanel"
                                >
                                    AdminPanel
                                </Link>
                            )}

                            <Link
                                className="px-3 py-1 text-decoration-none rounded"
                                style={{ fontSize: 20, color: "red" }}
                                to="/profil"
                            >
                                Profilom
                            </Link>

                            <Link
                                className="px-3 py-1 text-decoration-none rounded"
                                style={{ fontSize: 20, color: "red" }}
                                to="/rendeleseim"
                            >
                                Rendeléseim
                            </Link>

                            <Button
                                buttonClass="btn btn-danger px-4"
                                content="Kijelentkezés"
                                onClick={onLogout}
                            />
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

            {menuOpen && (
                <div className="d-md-none pb-3 d-flex flex-column gap-2">
                    {isLoggedIn ? (
                        <>
                            {isAdmin && (
                                <Link
                                    className="d-block text-center py-2 text-decoration-none rounded"
                                    style={{ fontSize: 18, color: "red" }}
                                    to="/AdminPanel"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    AdminPanel
                                </Link>
                            )}

                            <Link
                                className="d-block text-center py-2 text-decoration-none rounded"
                                style={{ fontSize: 18, color: "red" }}
                                to="/profil"
                                onClick={() => setMenuOpen(false)}
                            >
                                Profilom
                            </Link>

                            <Link
                                className="d-block text-center py-2 text-decoration-none rounded"
                                style={{ fontSize: 18, color: "red" }}
                                to="/rendeleseim"
                                onClick={() => setMenuOpen(false)}
                            >
                                Rendeléseim
                            </Link>

                            <Button
                                buttonClass="btn btn-danger w-100"
                                content="Kijelentkezés"
                                onClick={onLogout}
                            />
                        </>
                    ) : (
                        <>
                            <Link
                                className="d-block text-center py-2 text-decoration-none rounded"
                                style={{ fontSize: 18, color: "red" }}
                                to="/login"
                                onClick={() => setMenuOpen(false)}
                            >
                                Bejelentkezés
                            </Link>

                            <Link
                                className="d-block text-center py-2 text-decoration-none rounded"
                                style={{ fontSize: 18, color: "red" }}
                                to="/register"
                                onClick={() => setMenuOpen(false)}
                            >
                                Regisztráció
                            </Link>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}