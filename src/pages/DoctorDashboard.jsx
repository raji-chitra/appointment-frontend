import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api'; // ✅ use central axios instance

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [doctorData, setDoctorData] = useState(null);

  // Base URL for images (remove /api)
  const API_BASE = API.defaults.baseURL.replace("/api", "");

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

        if (parsedUser.role !== 'doctor') {
          navigate('/doctor-login');
          return;
        }

        setDoctorData(parsedUser);
        const doctorId = parsedUser._id || parsedUser.id;

        fetchAppointments(doctorId);
      } catch (error) {
        console.error('Error parsing user data:', error);
        navigate('/doctor-login');
      }
    };

    checkAuth();
  }, [navigate]);

  /* ----------------------------------------
      FETCH APPOINTMENTS (USES API WRAPPER)
  ---------------------------------------- */
  const fetchAppointments = async (doctorId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const response = await API.get(
        `/appointments/doctor/${doctorId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setAppointments(response.data.appointments);
      } else {
        setError("Failed to fetch appointments");
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setError("Error fetching appointments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
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
          <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {appointments.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No appointments found
          </p>
        ) : (
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100 text-sm text-gray-600">
                <th className="py-3 px-6 text-left">Patient</th>
                <th className="py-3 px-6 text-left">Date & Time</th>
                <th className="py-3 px-6 text-left">Status</th>
                <th className="py-3 px-6 text-left">Symptoms</th>
                <th className="py-3 px-6 text-left">Actions</th>
              </tr>
            </thead>

            <tbody className="text-sm text-gray-700">
              {appointments.map((appointment) => (
                <tr key={appointment._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-6">
                    <p className="font-medium">
                      {appointment.patient?.name || "Unknown"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {appointment.patient?.email}
                    </p>
                  </td>

                  <td className="py-3 px-6">
                    {formatDate(appointment.date)}
                  </td>

                  <td className="py-3 px-6">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        appointment.status === "scheduled"
                          ? "bg-green-100 text-green-800"
                          : appointment.status === "completed"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {appointment.status}
                    </span>
                  </td>

                  <td className="py-3 px-6 truncate max-w-xs">
                    {appointment.symptoms}
                  </td>

                  <td className="py-3 px-6">
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded"
                      onClick={() =>
                        alert(`
Patient: ${appointment.patient?.name}
Date: ${formatDate(appointment.date)}
Time: ${appointment.time}
Symptoms: ${appointment.symptoms}
Status: ${appointment.status}
`)
                      }
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;
