import React from 'react'
import { useNavigate } from 'react-router-dom'

const RoleSelection = () => {
  const navigate = useNavigate()

  const handleRoleSelect = (role) => {
    if (role === 'patient') {
      navigate('/patient-auth')
    } else if (role === 'doctor') {
      navigate('/doctor-login')
    } else if (role === 'admin') {
      navigate('/admin-login')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Select Your Role</h2>
          <p className="mt-2 text-gray-600">Choose how you want to access the system</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => handleRoleSelect('patient')}
            className="w-full bg-blue-600 text-white py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition duration-200"
          >
            I'm a Patient
          </button>
          
          <button
            onClick={() => handleRoleSelect('doctor')}
            className="w-full bg-green-600 text-white py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition duration-200"
          >
            I'm a Doctor
          </button>
          
          <button
            onClick={() => handleRoleSelect('admin')}
            className="w-full bg-red-600 text-white py-4 rounded-lg text-lg font-semibold hover:bg-red-700 transition duration-200"
          >
            I'm an Admin
          </button>
        </div>

        <div className="text-center">
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
           
          </button>
        </div>
      </div>
    </div>
  )
}

export default RoleSelection