import React, { useState, useContext, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Appointment = () => {
  const { docId } = useParams()
  const { doctors, bookAppointment, userData } = useContext(AppContext)
  const navigate = useNavigate()

  // Redirect to login if user is not authenticated
  useEffect(() => {
    // Check if we have userData in context or localStorage
    const hasToken = localStorage.getItem('token');
    const hasUserData = userData || localStorage.getItem('userData');
    
    if (!hasUserData && !hasToken) {
      navigate('/patient-auth', { state: { from: `/appointment/${docId}` } });
      return;
    }
    
    // If we have userData in localStorage but not in context, try to load it
    if (!userData && localStorage.getItem('userData')) {
      try {
        const storedUserData = JSON.parse(localStorage.getItem('userData'));
        if (storedUserData && storedUserData.name) {
          setFormData(prev => ({ ...prev, name: storedUserData.name }));
        }
      } catch (error) {
        console.error('Error parsing userData from localStorage:', error);
      }
    }
  }, [userData, navigate, docId]);

  const doctor = doctors.find(d => String(d._id) === String(docId))

  // Try to get userData from localStorage if not available in context
  const getUserDataFromStorage = () => {
    if (userData) return userData;
    try {
      const storedUserData = localStorage.getItem('userData');
      return storedUserData ? JSON.parse(storedUserData) : null;
    } catch (error) {
      console.error('Error parsing userData from localStorage:', error);
      return null;
    }
  };
  
  const storedUserData = getUserDataFromStorage();
  
  const [formData, setFormData] = useState({
    name: storedUserData?.name || '',
    phone: '',
    date: '',
    time: '',
    reason: ''
  })

  const [errors, setErrors] = useState({})
  const [minDate, setMinDate] = useState('')
  const [availableSlots, setAvailableSlots] = useState([])

  useEffect(() => {
    if (userData && userData.name) {
      setFormData(prev => ({ ...prev, name: userData.name }))
    }

    // Set minimum date to tomorrow
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    setMinDate(tomorrow.toISOString().split('T')[0])

    generateTimeSlots()
  }, [userData])

  const generateTimeSlots = () => {
    const slots = []
    for (let hour = 9; hour <= 17; hour++) {
      if (hour === 12) continue // Skip lunch
      const amPm = hour >= 12 ? 'PM' : 'AM'
      const hour12 = hour > 12 ? hour - 12 : hour
      slots.push(`${hour12}:00 ${amPm}`)
      if (hour < 17) slots.push(`${hour12}:30 ${amPm}`)
    }
    setAvailableSlots(slots)
  }

  const validatePhone = (phone) => /^\d{10}$/.test(phone)

  const isValidObjectId = (id) => /^[a-f\d]{24}$/i.test(id)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validatePhone(formData.phone)) {
      setErrors({ phone: 'Please enter a valid 10-digit phone number' })
      return
    }
    if (!formData.date) return setErrors({ date: 'Please select a date' })
    if (!formData.time) return setErrors({ time: 'Please select a time' })
    if (!formData.reason.trim()) return setErrors({ reason: 'Please provide a reason' })

    setErrors({})

    if (!isValidObjectId(docId)) {
      alert('Selected doctor is from demo data. Please ask admin to add this doctor first, then try again.')
      return
    }

    // Check if we have userData from context or try to get it from localStorage
    const userDataFromStorage = !userData && localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')) : null;
    const currentUserData = userData || userDataFromStorage;
    
    // Make sure we have user data before proceeding
    if (!currentUserData) {
      alert('Please log in to book an appointment')
      navigate('/patient-auth', { state: { from: `/appointment/${docId}` } })
      return
    }

    const appointment = {
      doctor: docId,
      date: formData.date,
      time: formData.time,
      symptoms: formData.reason
    }

    try {
      const result = await bookAppointment(appointment)
      
      if (result?.success) {
        alert('Appointment booked successfully!')
        navigate('/my-appointments')
      } else {
        alert(result?.message || 'Failed to book appointment. Please try again.')
      }
    } catch (error) {
      console.error('Error booking appointment:', error)
      alert('Something went wrong. Please try again.')
    }
  }

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, '')
    if (value.length <= 10) {
      setFormData({ ...formData, phone: value })
      if (errors.phone) setErrors({ ...errors, phone: '' })
    }
  }

  if (!doctor) {
    return <div className="min-h-[80vh] flex items-center justify-center">Doctor not found</div>
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-8">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Book Appointment</h2>

        {/* Doctor details */}
        <div className="flex items-center mb-6">
          <img 
            src={doctor.image ? (doctor.image.startsWith('http') ? doctor.image : `http://localhost:5000${doctor.image}`) : '/src/assets/doc1.png'} 
            alt={doctor.name} 
            className="w-16 h-16 rounded-full mr-4" 
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/src/assets/doc1.png';
            }}
          />
          <div>
            <h3 className="font-semibold">{doctor.name}</h3>
            <p className="text-gray-600">{doctor.speciality}</p>
            <p className="text-sm text-gray-500">{doctor.experience}</p>
            <p className="text-sm text-green-600 font-semibold">Fee: ${doctor.fees}</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={handlePhoneChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter 10-digit number"
              maxLength="10"
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md"
              min={minDate}
            />
            {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time *</label>
            <select
              required
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Select time</option>
              {availableSlots.map(slot => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>
            {errors.time && <p className="text-red-500 text-xs mt-1">{errors.time}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Visit *</label>
            <textarea
              required
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md"
              rows="3"
              placeholder="Please describe your symptoms or reason for appointment"
            ></textarea>
            {errors.reason && <p className="text-red-500 text-xs mt-1">{errors.reason}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
          >
            Book Appointment
          </button>
        </form>
      </div>
    </div>
  )
}

export default Appointment
