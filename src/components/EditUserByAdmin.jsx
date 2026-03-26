import { useState } from "react";
import { editUser } from "../api/api";

export default function EditUserByAdmin({ user, onClose, setUsers, users }) {
  const [username, setUsername] = useState(user.user_username);
  const [email, setEmail] = useState(user.user_email);
  const [role, setRole] = useState(user.user_role);

  const userDataSubmit = async () => {
    try {
      const updatedData = {
        user_username: username,
        user_email: email,
        user_role: role
      };

      await editUser(user.user_id, updatedData.user_username, updatedData.user_email, updatedData.user_role);
      console.log(updatedData);

      const ujLista = users.map((u) => {
        if (u.user_id === user.user_id) {
          return {
            user_id: u.user_id,
            user_username: username,
            user_email: email,
            user_role: role
          };
        } else {
          return u;
        }
      });

      setUsers(ujLista);

      onClose();
    } catch (err) {
      console.error("Hiba a mentés során:", err);
    }
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
              <button className="btn btn-dark" onClick={userDataSubmit}>
                Mentés
              </button>
            </div>

          </div>
        </div>
      </div>

      <div className="modal-backdrop show" style={{ zIndex: 1040 }}></div>
    </>
  );
}