// pages/Admin.jsx
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Admin = () => {
  const navigate = useNavigate()
  const [appointments, setAppointments] = useState([])
  const [filteredAppointments, setFilteredAppointments] = useState([])
  const [filterStatus, setFilterStatus] = useState('all')
  const [doctorId] = useState('doc1') // In a real app, this would come from auth

  // Sample appointments data - in a real app, this would come from an API
  const sampleAppointments = [
    {
      _id: 'app1',
      patientName: 'John Doe',
      patientEmail: 'john@example.com',
      patientPhone: '+1 123-456-7890',
      doctorId: 'doc1',
      doctorName: 'Dr. Richard James',
      appointmentDate: '2025-09-20',
      appointmentTime: '10:00 AM',
      status: 'confirmed',
      notes: 'Regular checkup'
    },
    {
      _id: 'app2',
      patientName: 'Jane Smith',
      patientEmail: 'jane@example.com',
      patientPhone: '+1 987-654-3210',
      doctorId: 'doc1',
      doctorName: 'Dr. Richard James',
      appointmentDate: '2025-09-21',
      appointmentTime: '2:30 PM',
      status: 'pending',
      notes: 'Follow-up appointment'
    },
    {
      _id: 'app3',
      patientName: 'Robert Johnson',
      patientEmail: 'robert@example.com',
      patientPhone: '+1 555-123-4567',
      doctorId: 'doc1',
      doctorName: 'Dr. Richard James',
      appointmentDate: '2025-09-22',
      appointmentTime: '11:15 AM',
      status: 'completed',
      notes: 'Annual physical examination'
    },
    {
      _id: 'app4',
      patientName: 'Sarah Williams',
      patientEmail: 'sarah@example.com',
      patientPhone: '+1 444-555-6666',
      doctorId: 'doc2',
      doctorName: 'Dr. Emily Larson',
      appointmentDate: '2025-09-20',
      appointmentTime: '9:00 AM',
      status: 'confirmed',
      notes: 'Gynecological consultation'
    }
  ]

  useEffect(() => {
    // Filter appointments for this doctor only
    const doctorAppointments = sampleAppointments.filter(
      app => app.doctorId === doctorId
    )
    setAppointments(doctorAppointments)
    setFilteredAppointments(doctorAppointments)
  }, [doctorId])

  useEffect(() => {
    if (filterStatus === 'all') {
      setFilteredAppointments(appointments)
    } else {
      setFilteredAppointments(
        appointments.filter(app => app.status === filterStatus)
      )
    }
  }, [filterStatus, appointments])

  const handleStatusChange = (appointmentId, newStatus) => {
    setAppointments(prevAppointments =>
      prevAppointments.map(app =>
        app._id === appointmentId ? { ...app, status: newStatus } : app
      )
    )
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Doctor Panel</h1>

        {/* Filter Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Appointment Filters</h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-full ${filterStatus === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 text-gray-700'
                }`}
            >
              All Appointments
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-4 py-2 rounded-full ${filterStatus === 'pending'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-200 text-gray-700'
                }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilterStatus('confirmed')}
              className={`px-4 py-2 rounded-full ${filterStatus === 'confirmed'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-700'
                }`}
            >
              Confirmed
            </button>
            <button
              onClick={() => setFilterStatus('completed')}
              className={`px-4 py-2 rounded-full ${filterStatus === 'completed'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700'
                }`}
            >
              Completed
            </button>
            <button
              onClick={() => setFilterStatus('cancelled')}
              className={`px-4 py-2 rounded-full ${filterStatus === 'cancelled'
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-200 text-gray-700'
                }`}
            >
              Cancelled
            </button>
          </div>
        </div>

        {/* Appointments List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <h2 className="text-xl font-semibold p-6 border-b">
            My Appointments ({filteredAppointments.length})
          </h2>

          {filteredAppointments.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No appointments found for the selected filter.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Patient
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Notes
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAppointments.map((appointment) => (
                    <tr key={appointment._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {appointment.patientName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {appointment.patientEmail}
                        </div>
                        <div className="text-sm text-gray-500">
                          {appointment.patientPhone}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {appointment.appointmentDate}
                        </div>
                        <div className="text-sm text-gray-500">
                          {appointment.appointmentTime}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                            appointment.status
                          )}`}
                        >
                          {appointment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {appointment.notes}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {appointment.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(appointment._id, 'confirmed')}
                              className="text-green-600 hover:text-green-900 mr-3"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => handleStatusChange(appointment._id, 'cancelled')}
                              className="text-red-600 hover:text-red-900"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        {appointment.status === 'confirmed' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(appointment._id, 'completed')}
                              className="text-blue-600 hover:text-blue-900 mr-3"
                            >
                              Complete
                            </button>
                            <button
                              onClick={() => handleStatusChange(appointment._id, 'cancelled')}
                              className="text-red-600 hover:text-red-900"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        {(appointment.status === 'completed' || appointment.status === 'cancelled') && (
                          <span className="text-gray-400">No actions</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Statistics Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800">Total Appointments</h3>
            <p className="text-3xl font-bold text-primary">{appointments.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800">Pending</h3>
            <p className="text-3xl font-bold text-yellow-600">
              {appointments.filter(a => a.status === 'pending').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800">Confirmed</h3>
            <p className="text-3xl font-bold text-green-600">
              {appointments.filter(a => a.status === 'confirmed').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800">Completed</h3>
            <p className="text-3xl font-bold text-blue-600">
              {appointments.filter(a => a.status === 'completed').length}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Admin