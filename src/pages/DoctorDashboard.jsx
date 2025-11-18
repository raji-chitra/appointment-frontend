import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [doctorData, setDoctorData] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('userData');
      
      if (!token || !userData) {
        navigate('/doctor-login');
        return;
      }
      
      try {
        const parsedUser = JSON.parse(userData);
        console.log('Doctor data:', parsedUser); // Debug log
        
        if (parsedUser.role !== 'doctor') {
          navigate('/doctor-login');
          return;
        }
        
        setDoctorData(parsedUser);
        // Use the correct ID field from the doctor data
        const doctorId = parsedUser._id || parsedUser.id;
        console.log('Using doctor ID:', doctorId); // Debug log
        fetchAppointments(token, doctorId);
      } catch (error) {
        console.error('Error parsing user data:', error);
        navigate('/doctor-login');
      }
    };
    
    checkAuth();
  }, [navigate]);

  const fetchAppointments = async (token, doctorId) => {
    setLoading(true);
    try {
      console.log('Fetching appointments for doctor ID:', doctorId);
      const response = await axios.get(`http://localhost:5000/api/appointments/doctor/${doctorId}`, {
        headers: { 'x-auth-token': token }
      });
      
      if (response.data.success) {
        setAppointments(response.data.appointments);
      } else {
        setError('Failed to fetch appointments');
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setError('Error fetching appointments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Welcome, Dr. {doctorData?.name}
        </h1>
        <p className="text-gray-600">
          Manage your appointments and patient information
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Your Appointments</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {appointments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No appointments found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Patient</th>
                  <th className="py-3 px-6 text-left">Date & Time</th>
                  <th className="py-3 px-6 text-left">Status</th>
                  <th className="py-3 px-6 text-left">Symptoms</th>
                  <th className="py-3 px-6 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm">
                {appointments.map((appointment) => (
                  <tr key={appointment._id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-6 text-left">
                      <div className="font-medium">{appointment.patient?.name || 'Unknown'}</div>
                      <div className="text-xs">{appointment.patient?.email || 'No email'}</div>
                    </td>
                    <td className="py-3 px-6 text-left">
                      {appointment.date ? formatDate(appointment.date) : 'Invalid Date'}
                    </td>
                    <td className="py-3 px-6 text-left">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        appointment.status === 'scheduled' 
                          ? 'bg-green-100 text-green-800' 
                          : appointment.status === 'completed' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-left">
                      <div className="truncate max-w-xs">
                        {appointment.symptoms || 'Not specified'}
                      </div>
                    </td>
                    <td className="py-3 px-6 text-left">
                      <button 
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-xs"
                        onClick={() => {
                          alert(`Appointment Details:\nPatient: ${appointment.patient?.name || 'Unknown'}\nDate: ${formatDate(appointment.date)}\nTime: ${appointment.time}\nSymptoms: ${appointment.symptoms || 'None'}\nStatus: ${appointment.status}`);
                        }}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;