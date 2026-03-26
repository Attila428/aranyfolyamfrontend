import { useState,useEffect } from 'react'
import Product from "../components/Product"
import NavBar from '../components/NavBar'
import { whoami,logout } from '../users'
import Footer from '../components/Footer'
import { getAllProduct } from '../api/api'

export default function Products() {
    const [user,setUser] = useState(null)
    const [userError, setUserError] = useState(null)
    const [allProduct, setAllProduct] = useState(null)

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

    useEffect(() =>{
        async function loadProduct() {
            const data = await getAllProduct()
            if(!data.error){
                return setAllProduct(data)
            }
            return setErrorAllUsers(data.error)
        }

        loadProduct()
    }, [])
    return (

        <>
        <NavBar user={user} onLogout={onLogout}/>
            <div className="container-fluid min-vh-100 d-flex align-items-center py-4" style={{
                background: "linear-gradient(90deg, #000000, #1a0000)"

            }}>
                <div className='container'>
                    <div className='row row-gap-4'>
                        <Product allProduct={allProduct}/>
                    </div>
                </div>
            </div>
            <Footer/>
        </>

    )
}
