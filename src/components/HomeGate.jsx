import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import Home from '../pages/Home'

const HomeGate = () => {
  const { token } = useContext(AppContext)
  const adminToken = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null

  if (!token && !adminToken) {
    return <Navigate to="/choose-login" replace />
  }

  return <Home />
}

export default HomeGate


