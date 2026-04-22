import Button from "./Button";
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

            setUsers(users.filter((x) => x.user_id !== user.user_id));

            nav("/AdminPanel");
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            <div className="w-100 mb-3">
                <div className="bg-danger border border-light rounded-4 p-3 p-md-4 w-100 overflow-hidden">
                    <div className="row g-3 align-items-start">
                        <div className="col-12 col-md-6 col-lg-3">
                            <div className="fw-semibold text-light">
                                Felhasználó név:
                            </div>
                            <div className="text-dark fw-bold text-break">
                                {user.user_username}
                            </div>
                        </div>

                        <div className="col-12 col-md-6 col-lg-3">
                            <div className="fw-semibold text-light">
                                Email cím:
                            </div>
                            <div className="text-dark fw-bold text-break">
                                {user.user_email}
                            </div>
                        </div>

                        <div className="col-12 col-md-6 col-lg-3">
                            <div className="fw-semibold text-light">
                                Felhasználó jogosultsága:
                            </div>
                            <div className="text-dark fw-bold text-break">
                                {user.user_role}
                            </div>
                        </div>

                        <div className="col-12 col-md-6 col-lg-3">
                            <div className="d-grid gap-2 d-sm-flex d-lg-grid justify-content-sm-start justify-content-lg-stretch">
                                <Button
                                    buttonClass="btn btn-primary text-light border-2 border-light fw-semibold w-100"
                                    content="Módosítás"
                                    onClick={() => setIsOpen(true)}
                                />

                                <Button
                                    buttonClass="btn btn-danger text-light border-2 border-light fw-semibold w-100"
                                    content="Törlés"
                                    onClick={handleDelete}
                                />
                            </div>
                        </div>
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