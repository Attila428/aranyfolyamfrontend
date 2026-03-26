import { useEffect, useState } from "react"
import Footer from "../components/Footer"
import NavBar from "../components/NavBar"
import User from "../components/User"
import { getUsers } from "../api/api"

export default function AdminPanel() {

    const [users, setUsers] = useState([])

    useEffect(() => {
        async function fetchUsers() {
            const data = await getUsers()
            setUsers(data)
        }

        fetchUsers()
    }, [])

    return (
        <>
            <NavBar />
            <div
                className="container-fluid d-flex flex-column align-items-center vh-100"
                style={{ background: "linear-gradient(90deg, #000000, #1a0000)" }}
            >
                {
                    users.length === 0 ? (
                        <div className="border border-2 rounded-4 py-2 px-3 bg-danger border-danger">
                            <span className="text-white fw-bold fs-5">Nem található Felhasználó!</span>
                        </div>
                    )
                        :
                        (
                            users.map(user => (
                                <User key={user.user_id} user={user} setUsers={setUsers} users={users}
                                />
                            ))
                        )
                }
            </div>
            <Footer />
        </>
    )
}