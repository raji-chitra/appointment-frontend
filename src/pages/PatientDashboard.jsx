import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';   // ⬅️ SUPER IMPORTANT
import doctor1 from '../assets/doc1.png';
import doctor2 from '../assets/doc2.png';
import doctor3 from '../assets/doc3.png';

const PatientDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    upcoming: 0,
    completed: 0,
  });

  const recommendedDoctors = [
    { id: 1, name: 'Dr. Arjun Kumar', specialization: 'Cardiologist', image: doctor1 },
    { id: 2, name: 'Dr. Meera Iyer', specialization: 'Dermatologist', image: doctor2 },
    { id: 3, name: 'Dr. Vivek Sharma', specialization: 'Orthopedic', image: doctor3 },
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('userData');

    if (!token || !userData) {
      navigate('/patient-auth');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);

      const fetchAppointments = async () => {
        setLoading(true);
        try {
          const response = await API.get('/appointments/my-appointments');   // ⬅️ FIXED

          if (response.success) {
            const allAppointments = Array.isArray(response.appointments)
              ? response.appointments
              : [];

            setAppointments(allAppointments);

            const now = new Date();
            const upcomingAppts = allAppointments.filter(
              (appt) => new Date(appt.date) >= now && appt.status === 'scheduled'
            );
            const completedAppts = allAppointments.filter(
              (appt) => appt.status === 'completed'
            );

            setStats({
              total: allAppointments.length,
              upcoming: upcomingAppts.length,
              completed: completedAppts.length,
            });
          }
        } catch (error) {
          console.error('Error loading appointments:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchAppointments();
    } catch (err) {
      console.error('User parsing error:', err);
      navigate('/patient-auth');
    }
  }, [navigate]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const upcomingAppointments = appointments
    .filter(
      (appt) =>
        new Date(appt.date) >= new Date() && appt.status === 'scheduled'
    )
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3);

  const formatDate = (dateString) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4">

        {/* HEADER */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.name}!
          </h1>
          <p className="text-gray-600 mt-2">{user.email} • Patient Dashboard</p>
        </div>

        {/* STATS */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Stats Overview</h2>

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

        {/* MAIN DASHBOARD */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* QUICK ACTIONS */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <button
              onClick={() => navigate('/doctors')}
              className="w-full bg-blue-600 text-white py-2 mb-3 rounded hover:bg-blue-700"
            >
              Book Appointment
            </button>

            <button
              onClick={() => navigate('/my-appointments')}
              className="w-full bg-green-600 text-white py-2 mb-3 rounded hover:bg-green-700"
            >
              My Appointments
            </button>

            <button
              onClick={() => navigate('/my-profile')}
              className="w-full bg-gray-600 text-white py-2 rounded hover:bg-gray-700"
            >
              My Profile
            </button>
          </div>

          {/* USER INFO */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Your Information</h2>
            <p className="font-medium">Name: {user.name}</p>
            <p className="font-medium mt-2">Email: {user.email}</p>
            <p className="font-medium mt-2 capitalize">Role: {user.role}</p>
          </div>

          {/* UPCOMING APPOINTMENTS */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Upcoming Appointments</h2>

            {loading ? (
              <p>Loading...</p>
            ) : upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((appt) => (
                <div key={appt._id} className="border-l-4 border-blue-500 pl-3 py-2 mb-3">
                  <p className="font-medium">Dr. {appt.doctor.name}</p>
                  <p className="text-sm text-gray-600">{appt.doctor.specialization}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {formatDate(appt.date)} • {appt.time}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No upcoming appointments</p>
            )}
          </div>
        </div>

        {/* RECOMMENDED DOCTORS */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">Recommended Doctors</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendedDoctors.map((doc) => (
              <div key={doc.id} className="text-center bg-gray-50 p-4 rounded shadow">
                <img src={doc.image} className="w-24 h-24 mx-auto rounded-full mb-3" />
                <p className="font-medium">{doc.name}</p>
                <p className="text-gray-600 text-sm">{doc.specialization}</p>
                <button
                  onClick={() => navigate('/doctors')}
                  className="mt-3 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                >
                  Book Now
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* HEALTH TIP */}
        <div className="bg-blue-50 rounded-lg p-6 mt-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Health Tip of the Day
          </h3>
          <p className="text-blue-700">
            Regular exercise, a balanced diet, and adequate sleep keep your body strong.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
