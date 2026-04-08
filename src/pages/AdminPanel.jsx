import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import User from "../components/User";
import { getUsers } from "../api/api";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function AdminPanel() {
    const { user, loading, errorUser, onLogout } = useAuth();
    const [users, setUsers] = useState([]);
    const [usersError, setUsersError] = useState(null);

    useEffect(() => {
        async function fetchUsers() {
            const data = await getUsers();

            if (data?.error) {
                setUsersError(data.error);
                setUsers([]);
                return;
            }

            setUsers(data || []);
        }

        if (user && user.user_role === "admin") {
            fetchUsers();
        }
    }, [user]);

    if (loading) {
        return <p className="text-center mt-5">Töltés...</p>;
    }

    if (!user || user.user_role!="admin") {
        return <Navigate to="/" replace />;
    }

    return (
        <>
            <NavBar user={user} onLogout={onLogout} />
            <div
                className="container-fluid d-flex flex-column align-items-center min-vh-100 py-4"
                style={{ background: "linear-gradient(90deg, #000000, #1a0000)" }}
            >
                {errorUser && (
                    <div className="alert alert-danger w-75 text-center">
                        {errorUser}
                    </div>
                )}

                {usersError && (
                    <div className="alert alert-danger w-75 text-center">
                        {usersError}
                    </div>
                )}

                {users.length === 0 && !usersError ? (
                    <div className="border border-2 rounded-4 py-2 px-3 bg-danger border-danger">
                        <span className="text-white fw-bold fs-5">
                            Nem található felhasználó!
                        </span>
                    </div>
                ) : (
                    users.map((u) => (
                        <User
                            key={u.user_id}
                            user={u}
                            setUsers={setUsers}
                            users={users}
                        />
                    ))
                )}
            </div>
            <Footer />
        </>
    );
}