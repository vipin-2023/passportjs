import React from 'react'
import './App.css'
import {BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import HomePage from './pages/homePage/homePage'
import RegisterPage from './pages/registerPage/registerPage'
import LoginPage from './pages/loginPage/loginPage'
import ErrorPage from './pages/errorPage/errorPage'

const App:React.FC =()=>{
  return (
    <Router>
      <Routes>
      <Route path='/' Component={HomePage}/>
      <Route path='/login' Component={LoginPage}/>
      <Route path='/signup' Component={RegisterPage}/>
      <Route path='*' Component={ErrorPage}/>
      </Routes>
    </Router>
  )
}

export default App
