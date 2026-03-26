import InputField from "../components/InputField"
import Button from "../components/button"
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from "../users"
import Footer from "../components/Footer"
export default function Login() {


    const [hiba, setHiba] = useState('')
    const [uzenet, setUzenet] = useState('')

    const [email, setEmail] = useState('')
    const [psw, setPsw] = useState('')

    const navigate = useNavigate()
    async function onLogin() {



        try {
            setUzenet('')
            setHiba('')
            if (!email || !psw) {
                return setHiba('Minden mezőt tölts ki!')
            }
            const data = await login(email, psw)
            if (data.error) {
                setHiba(data.error)
            } else {
                setUzenet(data.message)
                setTimeout(() => navigate('/'), 600)
            }


        } catch (err) {
            setHiba('Nem sikerült kapcsolódni a backendhez.')
        }

    }
    return (
        <>
            <div
                className="container-fluid min-vh-100 d-flex align-items-center"
                style={{
                    background: "linear-gradient(135deg, #000000, #1a0000)"
                }}
            >

                <div className="row w-100">


                    <div className="col-lg-7 d-none d-lg-flex align-items-center justify-content-center">
                        <div className="text-center text-light">
                            <h2 className="fw-light display-6 text-danger">
                                Aranyfolyam
                            </h2>
                            <p className="lead text-secondary">
                                2026 legmenőbb zálogháza
                            </p>
                        </div>
                    </div>


                    <div className="col-lg-5 d-flex justify-content-center">
                        
                        <div
                            className="card shadow-lg border-0 rounded-4 p-4 bg-dark text-light"
                            style={{
                                width: "100%",
                                maxWidth: 480
                            }}
                        >

                            <h3 className="text-center fw-semibold mb-4 text-danger">
                                Bejelentkezés
                            </h3>

                            {hiba &&
                                <div className='alert alert-danger text-center py-2'>
                                    {hiba}
                                </div>
                            }

                            {uzenet &&
                                <div className='alert alert-success text-center py-2'>
                                    {uzenet}
                                </div>
                            }

                            <InputField
                                label={<span className="text-danger">E-mail</span>}
                                type="email"
                                placeholder="E-mail"
                                value={email}
                                setValue={setEmail}
                            />

                            <InputField
                                label={<span className="text-danger">Jelszó</span>}
                                type="password"
                                placeholder="Jelszó"
                                value={psw}
                                setValue={setPsw}
                            />

                            <div className="d-grid mb-3">
                                <Button
                                    buttonClass="btn btn-danger btn-lg rounded-3"
                                    content="Bejelentkezés"
                                    onClick={onLogin}
                                />
                            </div>

                            <div className="text-center">
                                <Link
                                    to="/register"
                                    className="text-decoration-none small text-secondary"
                                >
                                    Még nincs fiókom?
                                    <strong className="text-danger"> Regisztrálok</strong>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>

    )
}