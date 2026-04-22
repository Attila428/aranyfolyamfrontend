import NavBar from "../components/NavBar"
import { useEffect, useState } from "react"
import { whoami,logout } from '../users'
import Footer from "../components/Footer" 


export default function AboutUs(){

  const [user,setUser] = useState(null)
  const [userError, setUserError] = useState(null)


  useEffect(()=>{
    async function load() {
        const data = await whoami()
        //console.log(data);
        if (!data.error) {
            setUser(data)
        }
        setUserError(data.error)
    }
    load()
}, [])

async function onLogout() {
    const data = await logout ()
    if (data.error) {
        return setUserError(data.error) 
    }
    setUser(null)
    navigate('/')
}

    return (
        <>
        <div>
          <NavBar user={user} onLogout={onLogout}/>
        </div>
        <div 
  className="container-fluid d-flex vh-100 text-light" 
  style={{ background: "linear-gradient(90deg, #000000, #1a0000)" }}
>
  <div className="container">
    
    <div className="mb-5">
      <h2 className="fw-bold text-danger">Rólunk <span className="text-light fs-5">AranyFolyam Zálogház</span></h2>
      
      <p>
        Üdvözöljük az <strong className="text-danger">AranyFolyam</strong> oldalán! Cégünk célja, hogy megbízható és gyors pénzügyi 
        megoldásokat kínáljon ügyfeleink számára, amikor szükségük van rá. 
        Zálogházunkban biztos kezekben tudhatja értékeit, legyen szó aranyról, elektronikai vagy egyéb értékes tárgyakról.
      </p>

      <p>
        Mi az AranyFolyamnál a diszkrécióra, a tisztességre és a gyors ügyintézésre helyezzük a hangsúlyt. 
        Szakképzett csapatunk mindent megtesz annak érdekében, hogy Ön biztonságban tudhassa pénzügyeit.
      </p>

      <p>
        Az <strong className="text-danger">AranyFolyam</strong> nemcsak egy hely, ahol gyorsan pénzhez juthat, hanem egy megbízható partner is,
        aki segít a nehéz időkben.
      </p>
    </div>

    <div>
      <h2 className="fw-bold text-danger">Kapcsolat <span className="text-light fs-5">AranyFolyam Zálogház</span></h2>
      
      <p>
        Örömmel állunk rendelkezésére! Ha kérdése van, vagy személyesen szeretne egyeztetni,
        ne habozzon kapcsolatba lépni velünk.
      </p>

      <ul className="list-unstyled">
        <li><strong>Cím:</strong> 9999 AranyFolyam, Királyi körút 45.</li>
        <li><strong>Telefon:</strong> +36 1 234 5678</li>
        <li><strong>Email:</strong> aranyfolyam@gmail.com</li>
        <li><strong>Nyitvatartás:</strong> H-P: 9:00-18:00 | Sz: 10:00-14:00</li> 
      </ul>
    </div>

  </div>
</div>
<Footer/>
        </>
    )
}