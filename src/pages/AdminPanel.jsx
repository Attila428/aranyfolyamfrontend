import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import User from "../components/User";
import { getUsers } from "../api/api";
import { useAuth } from "../context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";

export default function AdminPanel() {
    const { user, loading, errorUser, onLogout } = useAuth();
    const [users, setUsers] = useState([]);
    const [usersError, setUsersError] = useState(null);
    const nav = useNavigate();

    useEffect(() => {
        async function fetchUsers() {
            const data = await getUsers();

            if (data?.error) {
                setUsersError(data.error);
                setUsers([]);
                return;
            }

            setUsersError(null);
            setUsers(data || []);
        }

        if (user && user.user_role === "admin") {
            fetchUsers();
        }
    }, [user]);

    if (loading) {
        return <p className="text-center mt-5">Töltés...</p>;
    }

    if (!loading && (!user || user.user_role !== "admin")) {
        return <Navigate to="/" replace />;
    }

    return (
        <>
            <NavBar user={user} onLogout={onLogout} />

            <div
                className="container-fluid min-vh-100 py-3 py-md-4 px-2 px-md-3 overflow-x-hidden"
                style={{ background: "linear-gradient(90deg, #000000, #1a0000)" }}
            >
                <div className="container">
                    <div className="mx-auto" style={{ maxWidth: "1100px" }}>
                        <div className="d-flex flex-column flex-md-row align-items-stretch align-items-md-center justify-content-between gap-3 mb-4">
                            <h1 className="text-white text-center text-md-start mb-0">
                                Admin panel
                            </h1>

                            <div className="d-flex flex-column flex-md-row gap-2">
                                <button
                                    className="btn btn-warning fw-bold px-4 py-2"
                                    onClick={() => nav("/adminorders")}
                                >
                                    Rendelések kezelése
                                </button>

                                <button
                                    className="btn btn-success fw-bold px-4 py-2"
                                    onClick={() => nav("/adminproducts")}
                                >
                                    Termékek kezelése
                                </button>
                            </div>
                        </div>

                        {errorUser && (
                            <div className="alert alert-danger text-center w-100 mb-3 rounded-4">
                                {errorUser}
                            </div>
                        )}

                        {usersError && (
                            <div className="alert alert-danger text-center w-100 mb-3 rounded-4">
                                {usersError}
                            </div>
                        )}

                        {users.length === 0 && !usersError ? (
                            <div className="border border-2 rounded-4 py-3 px-3 bg-danger border-danger text-center shadow-sm">
                                <span className="text-white fw-bold fs-6">
                                    Nem található felhasználó!
                                </span>
                            </div>
                        ) : (
                            <div className="d-flex flex-column gap-3">
                                {users.map((u) => (
                                    <div key={u.user_id} className="w-100">
                                        <User
                                            user={u}
                                            setUsers={setUsers}
                                            users={users}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}