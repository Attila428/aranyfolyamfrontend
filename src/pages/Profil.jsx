import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import { updateProfile } from "../users";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Profil() {
    const { user, loading, errorUser, onLogout, refreshUser } = useAuth();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [psw, setPsw] = useState("");
    const [pswAgain, setPswAgain] = useState("");
    const [saveError, setSaveError] = useState("");
    const [saveSuccess, setSaveSuccess] = useState("");
    const [saveLoading, setSaveLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setUsername(user.user_username || "");
            setEmail(user.user_email || "");
        }
    }, [user]);

    async function handleLogout() {
        await onLogout();
    }

    const handleSave = async () => {
        setSaveError("");
        setSaveSuccess("");

        if (psw !== pswAgain) {
            setSaveError("A két jelszó nem egyezik!");
            return;
        }

        setSaveLoading(true);

        try {
            const payload = {
                username,
                email,
            };

            if (psw.trim() !== "") {
                payload.psw = psw;
            }

            const res = await updateProfile(payload);

            if (res?.error) {
                setSaveError(res.error);
                setSaveLoading(false);
                return;
            }

            setSaveSuccess("Sikeres módosítás!");
            setPsw("");
            setPswAgain("");

            await refreshUser();
        } catch (err) {
            setSaveError("Hiba történt a módosítás közben.");
        }

        setSaveLoading(false);
    };

    // ⬇️ loading alatt ne redirecteljen
    if (loading) {
        return <p className="text-center mt-5">Töltés...</p>;
    }

    // ⬇️ HA NINCS USER → AZONNAL DOBJA VISSZA
    if (!user) {
        return <Navigate to="/" replace />;
    }

    return (
        <>
            <NavBar user={user} onLogout={handleLogout} />

            <div
                className="container-fluid d-flex min-vh-100 text-light py-5"
                style={{ background: "linear-gradient(90deg, #000000, #1a0000)" }}
            >
                <div className="container text-light" style={{ maxWidth: "500px" }}>
                    <div className="text-danger mb-4 fs-2 text-center fw-bold">
                        Profil szerkesztése
                    </div>

                    {errorUser && (
                        <div className="alert alert-danger">
                            {errorUser}
                        </div>
                    )}

                    {saveError && (
                        <div className="alert alert-danger">
                            {saveError}
                        </div>
                    )}

                    {saveSuccess && (
                        <div className="alert alert-success">
                            {saveSuccess}
                        </div>
                    )}

                    <div className="mb-3">
                        <label className="form-label text-danger fw-bold fs-5">
                            Felhasználónév
                        </label>
                        <input
                            type="text"
                            className="form-control bg-black text-light border-danger"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label text-danger fw-bold fs-5">
                            Email cím
                        </label>
                        <input
                            type="email"
                            className="form-control bg-black text-light border-danger"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label text-danger fw-bold fs-5">
                            Új jelszó
                        </label>
                        <input
                            type="password"
                            className="form-control bg-black text-light border-danger"
                            value={psw}
                            onChange={(e) => setPsw(e.target.value)}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="form-label text-danger fw-bold fs-5">
                            Jelszó megerősítése
                        </label>
                        <input
                            type="password"
                            className="form-control bg-black text-light border-danger"
                            value={pswAgain}
                            onChange={(e) => setPswAgain(e.target.value)}
                        />
                    </div>

                    <button
                        className="btn btn-danger w-100 text-white fw-bold"
                        onClick={handleSave}
                        disabled={saveLoading}
                    >
                        {saveLoading ? "Mentés..." : "Mentés"}
                    </button>
                </div>
            </div>

            <Footer />
        </>
    );
}