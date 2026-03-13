import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import InputField from '../components/InputField.jsx'
import Button from '../components/button.jsx'
import { register } from '../users.js'

export default function Register() {
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [psw, setPsw] = useState('')
    const [psw2, setPsw2] = useState('')

    const [hiba, setHiba] = useState('')
    const [uzenet, setUzenet] = useState('')


    const navigate = useNavigate()
    async function onRegister() {
        setHiba('')
        setUzenet('')
        console.log(email, username, psw, psw2)

        if (!email || !username || !psw || !psw2) {
            return setHiba('Minden mezőt tölts ki!')
        }

        if (psw !== psw2) {
            return setHiba('A két jelszó nem egyezik!')
        }

        try {
            const data = await register(email, username, psw)
            //console.log(data)
            if (data.error) {
                setHiba(data.error)
            }
            setUzenet(data.message)

        } catch (err) {
            console.log(err);
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
                            Regisztráció
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
                            label={<span className="text-danger">Név</span>}
                            type="text"
                            placeholder="Név"
                            value={username}
                            setValue={setUsername}
                        />

                        <InputField
                            label={<span className="text-danger">Jelszó</span>}
                            type="password"
                            placeholder="Jelszó"
                            value={psw}
                            setValue={setPsw}
                        />

                        <InputField
                            label={<span className="text-danger">Jelszó megerősítése</span>}
                            type="password"
                            placeholder="Jelszó megerősítése"
                            value={psw2}
                            setValue={setPsw2}
                        />

                        <div className="d-grid mb-3">
                            <Button
                                buttonClass="btn btn-danger btn-lg rounded-3"
                                content="Regisztráció"
                                onClick={onRegister}
                            />
                        </div>

                        <div className="text-center">
                            <Link
                                to="/login"
                                className="text-decoration-none small text-secondary"
                            >
                                Már van fiókom? <strong className="text-danger">Belépek</strong>
                            </Link>
                        </div>

                    </div>
                </div>

            </div>
        </div>


       <Footer/>
        </>
        
    )
}