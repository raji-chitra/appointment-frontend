import React from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'

const Card = ({ label, role, onClick }) => (
  <button onClick={() => onClick(role)} className="w-full text-left bg-white/95 hover:bg-white transition rounded-xl shadow-md p-8 sm:p-10 border border-gray-200">
    <div className="text-3xl sm:text-4xl font-semibold text-gray-900">{label} <span className="font-normal">Login</span></div>
  </button>
)

const RoleLogin = () => {
  const navigate = useNavigate()
  const go = (role) => navigate(`/login?role=${role}`)

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Background */}
      <img src={assets.about_image} alt="background" className="absolute inset-0 w-full h-full object-cover opacity-80" />
      <div className="absolute inset-0 bg-white/30" />

      <div className="relative w-full max-w-4xl mx-4">
        {/* Logo */}
        <div className="w-full flex justify-center mb-8">
          <img src={assets.logo} alt="logo" className="h-24 opacity-95" />
        </div>

        <div className="flex flex-col gap-6">
          <Card label="Patient" role="patient" onClick={go} />
          <Card label="Doctor" role="doctor" onClick={go} />
          <Card label="Admin" role="admin" onClick={go} />
        </div>
      </div>
    </div>
  )
}

export default RoleLogin


