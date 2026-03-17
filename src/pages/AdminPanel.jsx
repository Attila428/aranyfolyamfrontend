import Footer from "../components/Footer"
import NavBar from "../components/NavBar"
import User from "../components/User"

export default function AdminPanel() {
    return (
        <>
            <NavBar/>
            <div className="container-fluid d-flex justify-content-center vh-100" style={{
                background: "linear-gradient(90deg, #000000, #1a0000)"
            }}>
                <User />
            </div>
            <Footer/>
        </>

    )
}