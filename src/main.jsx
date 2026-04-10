import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { useState,useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../src/inputfield.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Register from './pages/RegisterPage'
import Login from './pages/LoginPage'
import AboutUs from './pages/AboutUsPage'
import ProductPage from './pages/ProductPage';
import AdminPanel from './pages/AdminPanel';
import Profil from './pages/Profil';
import UserOrder from './pages/UserOrders';
import { AuthProvider } from './context/AuthContext';
import AdminOrders from './pages/AdminOrders'
import { HashRouter } from "react-router-dom";

createRoot(document.getElementById('root')).render(
  <StrictMode>
   <AuthProvider>
    <HashRouter>
    <Routes>
        <Route path='/register' element={<Register />}/>
        <Route path='/login' element={<Login />}/>
        <Route path='/aboutus' element={<AboutUs />}/>
        <Route path='/' element={<ProductPage/>}/>
        <Route path='/AdminPanel' element={<AdminPanel/>}/>
        <Route path='/profil' element={<Profil/>}/>
        <Route path='/rendeleseim' element={<UserOrder/>}/>
        <Route path="/adminorders" element={<AdminOrders />} />
      </Routes>
   </HashRouter>
   </AuthProvider>
  </StrictMode>
)

