import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'

const MyAppointments = () => {
  const { appointments, getMyAppointments, cancelAppointment, userData } = useContext(AppContext)
  const [cancellingId, setCancellingId] = useState(null)

  useEffect(() => {
    // Check for userData in context or localStorage
    const storedUserData = !userData && localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')) : null;
    const currentUserData = userData || storedUserData;
    
    if (currentUserData) {
      getMyAppointments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Filter appointments for current user
  const userAppointments = Array.isArray(appointments) ? appointments : []

  const canCancelAppointment = (appointmentDate, appointmentTime) => {
    // Always allow cancellation for appointments in the future
    return true
  }

  const handleCancelAppointment = async (appointmentId, appointmentDate, appointmentTime) => {
    if (!canCancelAppointment(appointmentDate, appointmentTime)) {
      alert('You can only cancel appointments at least 24 hours in advance.')
      return
    }

    setCancellingId(appointmentId)
    
    try {
      if (window.confirm('Are you sure you want to cancel this appointment?')) {
        const res = await cancelAppointment(appointmentId)
        if (res?.success) alert('Appointment cancelled successfully!')
        else alert(res?.message || 'Failed to cancel appointment')
      }
    } catch (e) {
      console.error(e)
      alert('Failed to cancel appointment')
    }
    
    setCancellingId(null)
  }

  const getStatusBadge = (status) => {
    const statusClasses = {
      confirmed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800'
    }

    return (
      <span className={`px-2 py-1 rounded text-xs ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    )
  }

  // Check for userData in context or localStorage
  const storedUserData = !userData && localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')) : null;
  const currentUserData = userData || storedUserData;
  
  // Only show login message if no user data is found anywhere
  if (!currentUserData) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Please log in to view your appointments.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[80vh] p-6">
      <h1 className="text-3xl font-bold mb-6">My Appointments</h1>
      
      {userAppointments.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">You don't have any appointments yet.</p>
          <button 
            onClick={() => window.location.href = '/doctors'}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Book an Appointment
          </button>
        </div>
      ) : (
        <div className="grid gap-6">
          {userAppointments.map((appt) => {
            const doctor = appt.doctor || {}
            const canCancel = canCancelAppointment(appt.date, appt.time) && (appt.status === 'scheduled' || appt.status === 'confirmed')
            
            return (
              <div key={appt._id || appt.id} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <img 
  src={doctor?.image ? (doctor.image.startsWith('http') ? doctor.image : `http://localhost:5000${doctor.image}`) : '/src/assets/doc1.png'} 
  alt={doctor?.name || 'Doctor'} 
  className="w-16 h-16 rounded-full mr-4" 
  onError={(e) => {
    e.target.onerror = null;
    e.target.src = '/src/assets/doc1.png';
  }}
/>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{doctor?.name || 'Unknown Doctor'}</h3>
                    <p className="text-gray-600">{doctor?.specialization || doctor?.speciality || 'General Physician'}</p>
                    <p className="text-sm text-gray-500">{doctor?.degree || ''}</p>
                  </div>
                  <div className="text-right">
                    {getStatusBadge(appt.status)}
                    <p className="text-sm text-gray-500 mt-1">Fee: ₹{doctor?.fees || 'N/A'}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Date & Time</p>
                    <p className="font-medium">{appt.date} at {appt.time}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Reason</p>
                    <p className="font-medium">{appt.symptoms || appt.reason}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Contact</p>
                    <p className="font-medium">{appt.phone || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Booked On</p>
                    <p className="font-medium">
                      {appt.createdAt ? new Date(appt.createdAt).toLocaleDateString() : 'Unknown'}
                    </p>
                  </div>
                </div>

                {(appt.status === 'scheduled' || appt.status === 'confirmed') && (
                  <div className="flex gap-3">
                    {canCancel ? (
                      <button
                        onClick={() => handleCancelAppointment(appt._id || appt.id, appt.date, appt.time)}
                        disabled={cancellingId === (appt._id || appt.id)}
                        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:bg-red-300"
                      >
                        {cancellingId === (appt._id || appt.id) ? 'Cancelling...' : 'Cancel Appointment'}
                      </button>
                    ) : (
                      <p className="text-sm text-red-600">
                        Cannot cancel - less than 24 hours until appointment
                      </p>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default MyAppointments