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



createRoot(document.getElementById('root')).render(
  <StrictMode>
   <BrowserRouter>
      <Routes>
        <Route path='/register' element={<Register />}/>
        <Route path='/login' element={<Login />}/>
        <Route path='/aboutus' element={<AboutUs />}/>
        <Route path='/' element={<ProductPage/>}/>
        <Route path='/AdminPanel' element={<AdminPanel/>}/>
      </Routes>
    </BrowserRouter>
  </StrictMode>
)

