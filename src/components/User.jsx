import Button from "./button";
import { deleteUser } from "../api/api";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import EditUserByAdmin from "./EditUserByAdmin";

export default function User({ user, setUsers, users }) {
  const nav = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteUser(user.user_id);

      setUsers(
        users.filter((x) => x.user_id !== user.user_id)
      );

      nav("/AdminPanel");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="container col-12 mb-2">
        <div className="d-flex align-items-center justify-content-between bg-danger border border-light p-3 rounded">

          <div className="fw-semibold text-light flex-grow-1 me-3">
            Felhasználó név:
            <span className="text-dark fw-bold ms-1">
              {user.user_username}
            </span>
          </div>

          <div className="fw-semibold text-light flex-grow-1 me-3">
            Email cím:
            <span className="text-dark fw-bold ms-1">
              {user.user_email}
            </span>
          </div>

          <div className="fw-semibold text-light flex-grow-1 me-3">
            Felhasználó jogosultsága:
            <span className="text-dark fw-bold ms-1">
              {user.user_role}
            </span>
          </div>

          <div className="d-flex gap-2">
            <Button
              buttonClass="btn btn-primary text-light border-2 border-light fw-semibold"
              content="Módosítás"
              onClick={() => setIsOpen(true)}
            />

            <Button
              buttonClass="btn btn-danger text-light border-2 border-light fw-semibold"
              content="Törlés"
              onClick={handleDelete}
            />
          </div>
        </div>
      </div>

      {isOpen && (
        <EditUserByAdmin
          user={user}
          onClose={() => setIsOpen(false)}
          setUsers={setUsers}
          users={users}
        />
      )}
    </>
  );
}