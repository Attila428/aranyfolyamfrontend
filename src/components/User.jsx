import Button from "./button";

export default function User({ user_username, user_email, user_role }) {
  return (
    <div className="container col-12 mb-2">
      <div className="d-flex align-items-center justify-content-between bg-danger border border-light p-3 rounded">

        <div className="fw-semibold text-light flex-grow-1 me-3">
          Felhasználó név: {user_username}
        </div>

        <div className="fw-semibold text-light flex-grow-1 me-3">
          Email cím: {user_email}
        </div>

        <div className="fw-semibold text-light flex-grow-1 me-3">
          Felhasználó jogosultsága: {user_role}
        </div>

        <div className="d-flex gap-2">
          <Button
            buttonClass="btn btn-primary text-light border-2 border-light fw-semibold"
            content="Módosítás"
          />
          <Button
            buttonClass="btn btn-danger text-light border-2 border-light fw-semibold"
            content="Törlés"
          />
        </div>

      </div>
    </div>
  );
}