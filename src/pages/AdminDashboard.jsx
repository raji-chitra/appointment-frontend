import React, { useEffect, useState } from 'react'
import axios from 'axios'

const AdminDashboard = () => {
  const [doctors, setDoctors] = useState([])
  const [appointments, setAppointments] = useState([])
  const [showAddDoctor, setShowAddDoctor] = useState(false)
  const [newDoctor, setNewDoctor] = useState({
    name: '',
    email: '',
    password: '',
    speciality: '',
    experience: '',
    fees: '',
    degree: 'MBBS',
    image: null
  })
  
  const [imageFile, setImageFile] = useState(null)
  
  // Pagination states
  const [currentDoctorPage, setCurrentDoctorPage] = useState(1)
  const [currentAppointmentPage, setCurrentAppointmentPage] = useState(1)
  const doctorsPerPage = 5 // 5 logs per page
  const appointmentsPerPage = 3 // 3 logs per page

  const adminToken = localStorage.getItem('adminToken')
  
  // Redirect to admin login if no token is found
  useEffect(() => {
    if (!adminToken) {
      window.location.href = '/admin-login'
    }
  }, [adminToken])

  const fetchData = async () => {
    try {
      if (!adminToken) {
        console.error('Admin token not found')
        return
      }
      
      const [docRes, apptRes] = await Promise.all([
        axios.get('http://localhost:5000/api/admin/doctors', { headers: { Authorization: `Bearer ${adminToken}` } }),
        axios.get('http://localhost:5000/api/admin/appointments', { headers: { Authorization: `Bearer ${adminToken}` } })
      ])
      if (docRes.data.success) setDoctors(docRes.data.doctors)
      if (apptRes.data.success) setAppointments(apptRes.data.appointments)
    } catch (e) {
      console.error('Admin fetch failed', e)
      // If token is invalid, redirect to login
      if (e.response && (e.response.status === 401 || e.response.status === 403)) {
        alert('Your session has expired. Please login again.')
        localStorage.removeItem('adminToken')
        localStorage.removeItem('adminUser')
        window.location.href = '/admin-login'
      }
    }
  }

  useEffect(() => { fetchData() }, [])

  const handleAddDoctor = async () => {
    try {
      if (!adminToken) {
        alert('Your session has expired. Please login again.')
        window.location.href = '/admin-login'
        return
      }
      
      const formData = new FormData()
      formData.append('name', newDoctor.name)
      formData.append('email', (newDoctor.email && newDoctor.email.trim()) || `${newDoctor.name.replace(/\s+/g,'').toLowerCase()}@prescripto.com`)
      formData.append('password', newDoctor.password || 'doctor123')
      formData.append('specialization', (newDoctor.speciality || newDoctor.specialization || '').trim())
      formData.append('experience', Number(newDoctor.experience) || 0)
      formData.append('fees', Number(newDoctor.fees) || 0)
      formData.append('availability', JSON.stringify([]))
      formData.append('bio', '')
      
      if (imageFile) {
        formData.append('image', imageFile)
      }
      if (!newDoctor.name || !newDoctor.speciality || !newDoctor.fees) {
        alert('Please fill name, specialization and fees')
        return
      }
      if (!newDoctor.email) {
        alert('Please enter a valid email')
        return
      }
      const res = await axios.post('http://localhost:5000/api/admin/doctors', formData, { 
        headers: { 
          Authorization: `Bearer ${adminToken}`,
          'Content-Type': 'multipart/form-data'
        } 
      })
      if (res.data.success) {
        setShowAddDoctor(false)
        setNewDoctor({ name: '', email: '', password: '', speciality: '', experience: '', fees: '', degree: 'MBBS', image: null })
        setImageFile(null)
        fetchData()
      }
    } catch (e) {
      console.error('Add doctor failed', e?.response?.data || e)
      
      // If token is invalid, redirect to login
      if (e.response && (e.response.status === 401 || e.response.status === 403)) {
        alert('Your session has expired. Please login again.')
        localStorage.removeItem('adminToken')
        localStorage.removeItem('adminUser')
        window.location.href = '/admin-login'
        return
      }
      
      alert(e?.response?.data?.message || 'Add doctor failed')
    }
  }

  const [editDoctor, setEditDoctor] = useState(null)
  const [showEditDoctor, setShowEditDoctor] = useState(false)
  const [editImageFile, setEditImageFile] = useState(null)

  const handleEditDoctor = (doctor) => {
    setEditDoctor({
      id: doctor._id,
      name: doctor.name,
      email: doctor.email,
      speciality: doctor.specialization || doctor.speciality || '',
      experience: doctor.experience || '',
      fees: doctor.fees || '',
      degree: doctor.degree || 'MBBS',
      image: doctor.image || '/src/assets/doc1.png'
    })
    setShowEditDoctor(true)
  }

  const handleUpdateDoctor = async () => {
    try {
      if (!adminToken) {
        alert('Your session has expired. Please login again.')
        window.location.href = '/admin-login'
        return
      }
      
      if (!editDoctor.name || !editDoctor.speciality || !editDoctor.fees) {
        alert('Please fill name, specialization and fees')
        return
      }
      
      const formData = new FormData()
      formData.append('name', editDoctor.name)
      formData.append('email', editDoctor.email)
      formData.append('specialization', editDoctor.speciality)
      formData.append('experience', Number(editDoctor.experience) || 0)
      formData.append('fees', Number(editDoctor.fees) || 0)
      formData.append('degree', editDoctor.degree)
      
      if (editImageFile) {
        formData.append('image', editImageFile)
      }
      
      const res = await axios.put(`http://localhost:5000/api/admin/doctors/${editDoctor.id}`, formData, { 
        headers: { 
          Authorization: `Bearer ${adminToken}`,
          'Content-Type': 'multipart/form-data'
        } 
      })
      if (res.data.success) {
        setShowEditDoctor(false)
        setEditDoctor(null)
        fetchData()
      }
    } catch (e) {
      console.error('Update doctor failed', e?.response?.data || e)
      
      // If token is invalid, redirect to login
      if (e.response && (e.response.status === 401 || e.response.status === 403)) {
        alert('Your session has expired. Please login again.')
        localStorage.removeItem('adminToken')
        localStorage.removeItem('adminUser')
        window.location.href = '/admin-login'
        return
      }
      
      alert(e?.response?.data?.message || 'Update doctor failed')
    }
  }

  const handleRemoveDoctor = async (doctorId) => {
    if (!window.confirm('Are you sure you want to remove this doctor?')) return
    
    if (!adminToken) {
      alert('Your session has expired. Please login again.')
      window.location.href = '/admin-login'
      return
    }
    
    try {
      await axios.delete(`http://localhost:5000/api/admin/doctors/${doctorId}`, { headers: { Authorization: `Bearer ${adminToken}` } })
      fetchData()
    } catch (e) { 
      console.error('Remove doctor failed', e)
      
      // If token is invalid, redirect to login
      if (e.response && (e.response.status === 401 || e.response.status === 403)) {
        alert('Your session has expired. Please login again.')
        localStorage.removeItem('adminToken')
        localStorage.removeItem('adminUser')
        window.location.href = '/admin-login'
        return
      }
      
      alert(e?.response?.data?.message || 'Failed to remove doctor')
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
      <p className="text-gray-600 mb-6">Manage doctors and appointments</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Stats Cards */}
        <div className="bg-blue-100 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-800">Total Doctors</h3>
          <p className="text-2xl font-bold text-blue-600">{doctors.length}</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg">
          <h3 className="font-semibold text-green-800">Total Appointments</h3>
          <p className="text-2xl font-bold text-green-600">{appointments.length}</p>
        </div>
        <div className="bg-purple-100 p-4 rounded-lg">
          <h3 className="font-semibold text-purple-800">Pending Appointments</h3>
          <p className="text-2xl font-bold text-purple-600">
            {appointments.filter(a => a.status === 'pending').length}
          </p>
        </div>
      </div>

      {/* Doctor Management */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Doctor Management</h2>
          <button 
            onClick={() => setShowAddDoctor(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Doctor
          </button>
        </div>

        {showAddDoctor && (
          <div className="mb-6 p-4 border rounded-lg bg-gray-50">
            <h3 className="font-semibold mb-3">Add New Doctor</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Doctor Name"
                value={newDoctor.name}
                onChange={(e) => setNewDoctor({...newDoctor, name: e.target.value})}
                className="p-2 border rounded"
              />
              <input
                type="email"
                placeholder="Doctor Email"
                value={newDoctor.email}
                onChange={(e) => setNewDoctor({...newDoctor, email: e.target.value})}
                className="p-2 border rounded"
              />
              <input
                type="password"
                placeholder="Password"
                value={newDoctor.password}
                onChange={(e) => setNewDoctor({...newDoctor, password: e.target.value})}
                className="p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Speciality"
                value={newDoctor.speciality}
                onChange={(e) => setNewDoctor({...newDoctor, speciality: e.target.value})}
                className="p-2 border rounded"
              />
              <input
                type="number"
                placeholder="Experience (years)"
                value={newDoctor.experience}
                onChange={(e) => setNewDoctor({...newDoctor, experience: e.target.value})}
                className="p-2 border rounded"
              />
              <input
                type="number"
                placeholder="Fees"
                value={newDoctor.fees}
                onChange={(e) => setNewDoctor({...newDoctor, fees: e.target.value})}
                className="p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Degree"
                value={newDoctor.degree}
                onChange={(e) => setNewDoctor({...newDoctor, degree: e.target.value})}
                className="p-2 border rounded"
              />
              <div className="p-2 border rounded">
                <label className="block mb-1 text-sm">Doctor Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  className="w-full"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <button 
                onClick={handleAddDoctor}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Save Doctor
              </button>
              <button 
                onClick={() => setShowAddDoctor(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {showEditDoctor && (
          <div className="mb-6 p-4 border rounded-lg bg-blue-50">
            <h3 className="font-semibold mb-3">Edit Doctor</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Doctor Name"
                value={editDoctor.name}
                onChange={(e) => setEditDoctor({...editDoctor, name: e.target.value})}
                className="p-2 border rounded"
              />
              <input
                type="email"
                placeholder="Doctor Email"
                value={editDoctor.email}
                onChange={(e) => setEditDoctor({...editDoctor, email: e.target.value})}
                className="p-2 border rounded"
                disabled
              />
              <input
                type="text"
                placeholder="Speciality"
                value={editDoctor.speciality}
                onChange={(e) => setEditDoctor({...editDoctor, speciality: e.target.value})}
                className="p-2 border rounded"
              />
              <input
                type="number"
                placeholder="Experience (years)"
                value={editDoctor.experience}
                onChange={(e) => setEditDoctor({...editDoctor, experience: e.target.value})}
                className="p-2 border rounded"
              />
              <input
                type="number"
                placeholder="Fees"
                value={editDoctor.fees}
                onChange={(e) => setEditDoctor({...editDoctor, fees: e.target.value})}
                className="p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Degree"
                value={editDoctor.degree}
                onChange={(e) => setEditDoctor({...editDoctor, degree: e.target.value})}
                className="p-2 border rounded"
              />
              <div className="p-2 border rounded">
                <label className="block mb-1 text-sm">Doctor Image</label>
                {editDoctor.image && (
                  <div className="mb-2">
                    <img 
                      src={editDoctor.image.startsWith('http') ? editDoctor.image : `http://localhost:5000${editDoctor.image}`} 
                      alt="Doctor" 
                      className="h-20 w-20 object-cover rounded"
                    />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEditImageFile(e.target.files[0])}
                  className="w-full"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <button 
                onClick={handleUpdateDoctor}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Update Doctor
              </button>
              <button 
                onClick={() => {
                  setShowEditDoctor(false)
                  setEditDoctor(null)
                }}
                className="bg-gray-600 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left">Doctor</th>
                <th className="px-4 py-2 text-left">Speciality</th>
                <th className="px-4 py-2 text-left">Experience</th>
                <th className="px-4 py-2 text-left">Fees</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {doctors
                .slice(
                  (currentDoctorPage - 1) * doctorsPerPage,
                  currentDoctorPage * doctorsPerPage
                )
                .map((doctor) => (
                <tr key={doctor._id} className="border-b">
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <img 
                        src={doctor.image ? (doctor.image.startsWith('http') ? doctor.image : `http://localhost:5000${doctor.image}`) : '/src/assets/doc1.png'} 
                        alt={doctor.name} 
                        className="w-12 h-12 rounded-full mr-3 object-cover border-2 border-blue-200" 
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/src/assets/doc1.png';
                        }}
                      />
                      <div>
                        <p className="font-semibold">{doctor.name}</p>
                        <p className="text-sm text-gray-600">{doctor.degree || 'MBBS'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">{doctor.specialization || doctor.speciality}</td>
                  <td className="px-4 py-3">{doctor.experience ? `${doctor.experience} years` : 'N/A'}</td>
                  <td className="px-4 py-3">₹{doctor.fees}</td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEditDoctor(doctor)}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleRemoveDoctor(doctor._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Doctors Pagination */}
          {doctors.length > doctorsPerPage && (
            <div className="flex justify-center mt-4">
              <nav className="flex items-center">
                <button 
                  onClick={() => setCurrentDoctorPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentDoctorPage === 1}
                  className="px-3 py-1 rounded border mr-2 disabled:opacity-50"
                >
                  Previous
                </button>
                <div className="flex space-x-1">
                  {Array.from({ length: Math.ceil(doctors.length / doctorsPerPage) }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentDoctorPage(index + 1)}
                      className={`px-3 py-1 rounded border ${
                        currentDoctorPage === index + 1 ? 'bg-blue-600 text-white' : ''
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
                <button 
                  onClick={() => setCurrentDoctorPage(prev => 
                    Math.min(prev + 1, Math.ceil(doctors.length / doctorsPerPage))
                  )}
                  disabled={currentDoctorPage === Math.ceil(doctors.length / doctorsPerPage)}
                  className="px-3 py-1 rounded border ml-2 disabled:opacity-50"
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>
      
      {/* Appointments Management */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Appointment Management</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left">Patient</th>
                <th className="px-4 py-2 text-left">Doctor</th>
                <th className="px-4 py-2 text-left">Date & Time</th>
                <th className="px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments
                .slice(
                  (currentAppointmentPage - 1) * appointmentsPerPage,
                  currentAppointmentPage * appointmentsPerPage
                )
                .map((appointment) => (
                <tr key={appointment._id} className="border-b">
                  <td className="px-4 py-3">{appointment.patient?.name || 'Unknown Patient'}</td>
                  <td className="px-4 py-3">{appointment.doctor?.name || 'Unknown Doctor'}</td>
                  <td className="px-4 py-3">
                    {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs ${
                      appointment.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' :
                      appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Appointments Pagination */}
          {appointments.length > appointmentsPerPage && (
            <div className="flex justify-center mt-4">
              <nav className="flex items-center">
                <button 
                  onClick={() => setCurrentAppointmentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentAppointmentPage === 1}
                  className="px-3 py-1 rounded border mr-2 disabled:opacity-50"
                >
                  Previous
                </button>
                <div className="flex space-x-1">
                  {Array.from({ length: Math.ceil(appointments.length / appointmentsPerPage) }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentAppointmentPage(index + 1)}
                      className={`px-3 py-1 rounded border ${
                        currentAppointmentPage === index + 1 ? 'bg-blue-600 text-white' : ''
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
                <button 
                  onClick={() => setCurrentAppointmentPage(prev => 
                    Math.min(prev + 1, Math.ceil(appointments.length / appointmentsPerPage))
                  )}
                  disabled={currentAppointmentPage === Math.ceil(appointments.length / appointmentsPerPage)}
                  className="px-3 py-1 rounded border ml-2 disabled:opacity-50"
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard