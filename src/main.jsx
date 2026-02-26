import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../src/style.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Register from '../pages/RegisterPage'
import Login from '../pages/LoginPage'

createRoot(document.getElementById('root')).render(
  <StrictMode>
   <BrowserRouter>
      <Routes>
        <Route path='/register' element={<Register />}/>
        <Route path='/login' element={<Login />}/>
      </Routes>
    </BrowserRouter>
  </StrictMode>
)

