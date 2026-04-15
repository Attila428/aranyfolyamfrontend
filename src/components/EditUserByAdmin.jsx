import { useState } from "react";
import { editUser } from "../api/api";

export default function EditUserByAdmin({ user, onClose, setUsers, users }) {
  const [username, setUsername] = useState(user.user_username || "");
  const [email, setEmail] = useState(user.user_email || "");
  const [role, setRole] = useState(user.user_role || "user");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  const userDataSubmit = async () => {
    setError("");

    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim();

    if (!trimmedUsername || !trimmedEmail) {
      setError("Nem lehet üres mezőt menteni!");
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      setError("Adj meg érvényes email címet!");
      return;
    }

    setLoading(true);

    try {
      const res = await editUser(
        user.user_id,
        trimmedUsername,
        trimmedEmail,
        role
      );

      if (res?.error) {
        setError(res.error);
        setLoading(false);
        return;
      }

      const ujLista = users.map((u) => {
        if (u.user_id === user.user_id) {
          return {
            ...u,
            user_username: trimmedUsername,
            user_email: trimmedEmail,
            user_role: role
          };
        } else {
          return u;
        }
      });

      setUsers(ujLista);
      onClose();
    } catch (err) {
      setError("Hiba a mentés során.");
    }

    setLoading(false);
  };

  return (
    <>
      <div className="modal show d-block" style={{ zIndex: 1050 }}>
        <div className="modal-dialog">
          <div className="modal-content bg-danger border border-light rounded">

            <div className="modal-header border-light">
              <h5 className="modal-title text-light fw-bold">
                Felhasználó szerkesztése
              </h5>
              <button className="btn-close btn-close-white" onClick={onClose}></button>
            </div>

            <div className="modal-body">

              {error && (
                <div className="alert alert-danger">
                  {error}
                </div>
              )}

              <label className="text-light small">Felhasználónév:</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="form-control mb-2"
              />

              <label className="text-light small">Email cím:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control mb-2"
              />

              <label className="text-light small">Jogosultság:</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="form-select"
              >
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>

            <div className="modal-footer border-light">
              <button className="btn btn-outline-light" onClick={onClose}>
                Mégse
              </button>

              <button
                className="btn btn-dark"
                onClick={userDataSubmit}
                disabled={loading || !username.trim() || !email.trim()}
              >
                {loading ? "Mentés..." : "Mentés"}
              </button>
            </div>

          </div>
        </div>
      </div>

      <div className="modal-backdrop show" style={{ zIndex: 1040 }}></div>
    </>
  );
}