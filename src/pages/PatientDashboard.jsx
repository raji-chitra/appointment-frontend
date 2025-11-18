import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

// Import doctor images from assets
import doctor1 from '../assets/doc1.png'
import doctor2 from '../assets/doc2.png'
import doctor3 from '../assets/doc3.png'

const PatientDashboard = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    upcoming: 0,
    completed: 0
  })

  // Recommended doctors (static sample)
  const recommendedDoctors = [
    { id: 1, name: 'Dr. Arjun Kumar', specialization: 'Cardiologist', image: doctor1 },
    { id: 2, name: 'Dr. Meera Iyer', specialization: 'Dermatologist', image: doctor2 },
    { id: 3, name: 'Dr. Vivek Sharma', specialization: 'Orthopedic', image: doctor3 },
  ]

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('userData')

    if (!token || !userData) {
      navigate('/patient-auth')
      return
    }

    try {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)

      const fetchAppointments = async () => {
        try {
          setLoading(true)
          const response = await axios.get(
            `http://localhost:5000/api/appointments/my-appointments?patientId=${parsedUser._id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          )

          if (response.data.success) {
            const allAppointments = response.data.appointments
            setAppointments(allAppointments)

            const now = new Date()
            const upcomingAppts = allAppointments.filter(
              appt => new Date(appt.date) >= now && appt.status === 'scheduled'
            )
            const completedAppts = allAppointments.filter(
              appt => appt.status === 'completed'
            )

            setStats({
              total: allAppointments.length,
              upcoming: upcomingAppts.length,
              completed: completedAppts.length
            })
          }
        } catch (error) {
          console.error('Error fetching appointments:', error)
          // Don't set loading to false here, do it in finally
        } finally {
          setLoading(false)
        }
      }

      // Ensure user data is valid before fetching appointments
      if (parsedUser && parsedUser._id) {
        fetchAppointments()
      } else {
        setLoading(false)
        console.error('Invalid user data')
      }
    } catch (error) {
      console.error('Error parsing user data:', error)
      setLoading(false)
      // If there's an error parsing user data, redirect to login
      navigate('/patient-auth')
    }
  }, [navigate])

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Filter upcoming appointments
  const upcomingAppointments = appointments
    .filter(appt => new Date(appt.date) >= new Date() && appt.status === 'scheduled')
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3)

  const formatDate = (dateString) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' }
    return new Date(dateString).toLocaleDateString('en-US', options)
  }

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.name}!
          </h1>
          <p className="text-gray-600 mt-2">{user.email} • Patient Dashboard</p>
        </div>

        {/* Stats Overview */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Stats Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-blue-800 text-sm font-medium">Total Appointments</p>
              <p className="text-3xl font-bold text-blue-900">{stats.total}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-green-800 text-sm font-medium">Upcoming</p>
              <p className="text-3xl font-bold text-green-900">{stats.upcoming}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-purple-800 text-sm font-medium">Completed</p>
              <p className="text-3xl font-bold text-purple-900">{stats.completed}</p>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/doctors')}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
              >
                Book Appointment
              </button>
              <button
                onClick={() => navigate('/my-appointments')}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition"
              >
                My Appointments
              </button>
              <button
                onClick={() => navigate('/my-profile')}
                className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition"
              >
                My Profile
              </button>
            </div>
          </div>

          {/* User Info */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Information</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="text-gray-900 font-medium">{user.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-gray-900 font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Role</p>
                <p className="text-gray-900 font-medium capitalize">{user.role}</p>
              </div>
            </div>
          </div>

          {/* Upcoming Appointments */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Appointments</h2>
            {loading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            ) : upcomingAppointments.length > 0 ? (
              <div className="space-y-3">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment._id} className="border-l-4 border-blue-500 pl-3 py-2">
                    <p className="font-medium">Dr. {appointment.doctor.name}</p>
                    <p className="text-sm text-gray-600">{appointment.doctor.specialization}</p>
                    <div className="flex items-center mt-1 text-sm text-gray-500">
                      {formatDate(appointment.date)} • {appointment.time}
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => navigate('/my-appointments')}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-2"
                >
                  View all appointments →
                </button>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500 mb-3">No upcoming appointments</p>
                <button
                  onClick={() => navigate('/doctors')}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Book an appointment →
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Recommended Doctors */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recommended Doctors</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendedDoctors.map((doc) => (
              <div key={doc.id} className="bg-gray-50 rounded-lg shadow p-4 text-center">
                <img src={doc.image} alt={doc.name} className="w-24 h-24 rounded-full mx-auto mb-3" />
                <h3 className="font-medium text-gray-900">{doc.name}</h3>
                <p className="text-sm text-gray-600">{doc.specialization}</p>
                <button
                  onClick={() => navigate('/doctors')}
                  className="mt-3 px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                >
                  Book Now
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Health Tips */}
        <div className="bg-blue-50 rounded-lg p-6 mt-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Health Tip of the Day</h3>
          <p className="text-blue-700">
            Regular exercise, a balanced diet, and adequate sleep are the
            cornerstones of good health. Try to incorporate at least 30 minutes of physical activity into your daily routine.
          </p>
        </div>

      </div>
    </div>
  )
}

export default PatientDashboard
