import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import { whoami, updateProfile, logout } from "../users";
import { useNavigate } from "react-router-dom";

export default function Profil() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [userError, setUserError] = useState(null);

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [psw, setPsw] = useState("");
    const [pswAgain, setPswAgain] = useState("");

    useEffect(() => {
        async function load() {
            const data = await whoami();
            if (!data.error) {
                setUser(data);
            } else {
                setUserError(data.error);
            }
        }
        load();
    }, []);

    async function onLogout() {
        const data = await logout();
        if (data.error) return setUserError(data.error);
        setUser(null);
        navigate("/");
    }

    const handleSave = async () => {
        if (psw !== pswAgain) {
            alert("A két jelszó nem egyezik!");
            return;
        }

        try {
            const res = await updateProfile({
                username,
                email,
                psw
            });

            if (res.error) {
                alert(res.error);
                return;
            }

            alert("Sikeres módosítás!");
            setPsw("");
            setPswAgain("");
        } catch (err) {
            alert("Hiba történt a módosítás közben.");
        }
    };

    return (
        <>
            <NavBar user={user} onLogout={onLogout} />

            <div
                className="container-fluid d-flex vh-100 text-light"
                style={{ background: "linear-gradient(90deg, #000000, #1a0000)" }}
            >
                <div className="container mt-5 text-light" style={{ maxWidth: "500px" }}>
                    <div className="text-danger mb-4 fs-2 text-center fw-bold">
                        Profil szerkesztése
                    </div>

                    <div className="mb-3">
                        <label className="form-label text-danger fw-bold fs-5">Felhasználónév</label>
                        <input
                            type="text"
                            className="form-control bg-black text-light border-danger"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label text-danger fw-bold fs-5">Email cím</label>
                        <input
                            type="email"
                            className="form-control bg-black text-light border-danger"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label text-danger fw-bold fs-5">Új jelszó</label>
                        <input
                            type="password"
                            className="form-control bg-black text-light border-danger"
                            value={psw}
                            onChange={(e) => setPsw(e.target.value)}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="form-label text-danger fw-bold fs-5">Jelszó megerősítése</label>
                        <input
                            type="password"
                            className="form-control bg-black text-light border-danger"
                            value={pswAgain}
                            onChange={(e) => setPswAgain(e.target.value)}
                        />
                    </div>

                    <button className="btn btn-danger w-100 text-white fw-bold" onClick={handleSave}>
                        Mentés
                    </button>
                </div>
            </div>

            <Footer />
        </>
    );
}