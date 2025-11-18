import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

const BookAppointment = () => {
  const navigate = useNavigate()
  const { doctorId } = useParams()
  // Get doctors from localStorage, handle both formats
  const doctors = JSON.parse(localStorage.getItem('doctors') || '[]')
  const doctor = doctors.find(d => String(d._id) === String(doctorId))
  
  // If doctor not found in localStorage, try to fetch it directly
  const [loading, setLoading] = useState(doctor ? false : true)

  const currentUser = JSON.parse(localStorage.getItem('user'))

  const [formData, setFormData] = useState({
    date: '',
    time: '',
    reason: '',
    contact: ''
  })

  // Add useEffect to fetch doctor if not found in localStorage
  useEffect(() => {
    if (!doctor && doctorId) {
      const fetchDoctor = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/doctors/${doctorId}`)
          if (response.data.success && response.data.doctor) {
            // Update doctors in localStorage with this doctor
            const updatedDoctors = [...doctors]
            updatedDoctors.push(response.data.doctor)
            localStorage.setItem('doctors', JSON.stringify(updatedDoctors))
            setLoading(false)
          }
        } catch (err) {
          console.error('Error fetching doctor:', err)
          setLoading(false)
        }
      }
      fetchDoctor()
    }
  }, [doctorId, doctor])

  if (loading) return <div className="max-w-md mx-auto mt-10 p-8">Loading doctor information...</div>
  if (!doctor) return <div className="max-w-md mx-auto mt-10 p-8">Doctor not found</div>
  
  // Format image URL correctly
  const doctorImage = doctor.image ? 
    (doctor.image.startsWith('http') ? doctor.image : `http://localhost:5000${doctor.image}`) : 
    '/src/assets/doc1.png'

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        alert('Please login first')
        navigate('/patient-auth')
        return
      }
      const res = await axios.post('http://localhost:5000/api/appointments/book', {
        doctor: doctorId,
        date: formData.date,
        time: formData.time,
        symptoms: formData.reason
      }, { headers: { Authorization: `Bearer ${token}` } })

      if (res.data.success) {
        alert('Appointment booked successfully!')
        navigate('/my-appointments')
      } else {
        alert(res.data.message || 'Failed to book appointment')
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Something went wrong')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Book Appointment with {doctor.name}</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Date</label>
          <input
            type="date"
            required
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label>Time</label>
          <input
            type="time"
            required
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label>Reason</label>
          <textarea
            required
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            className="w-full p-2 border rounded"
            placeholder="Enter reason"
          />
        </div>

        <div>
          <label>Contact Number</label>
          <input
            type="tel"
            required
            value={formData.contact}
            onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
            className="w-full p-2 border rounded"
            placeholder="Enter your contact number"
          />
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Book Appointment
        </button>
      </form>
    </div>
  )
}

export default BookAppointment
