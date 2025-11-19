import React, { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

// IMPORT API BASE URL for images
import API from '../services/api';

const Appointment = () => {
  const { docId } = useParams();
  const { doctors, bookAppointment, userData } = useContext(AppContext);
  const navigate = useNavigate();

  // Prepare API base (remove /api for images)
  const API_BASE = API.defaults.baseURL.replace("/api", "");

  // Check login
  useEffect(() => {
    const hasToken = localStorage.getItem('token');
    const hasUserData = userData || localStorage.getItem('userData');

    if (!hasUserData && !hasToken) {
      navigate('/patient-auth', { state: { from: `/appointment/${docId}` } });
    }
  }, [userData, navigate, docId]);

  const doctor = doctors.find((d) => String(d._id) === String(docId));

  const storedUser = (() => {
    try {
      if (userData) return userData;
      const data = localStorage.getItem('userData');
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  })();

  const [formData, setFormData] = useState({
    name: storedUser?.name || '',
    phone: '',
    date: '',
    time: '',
    reason: ''
  });

  const [errors, setErrors] = useState({});
  const [minDate, setMinDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);

  // Generate time slots & min date
  useEffect(() => {
    if (userData?.name) {
      setFormData((prev) => ({ ...prev, name: userData.name }));
    }

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setMinDate(tomorrow.toISOString().split('T')[0]);

    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      if (hour !== 12) {
        const hour12 = hour > 12 ? hour - 12 : hour;
        const ampm = hour >= 12 ? "PM" : "AM";
        slots.push(`${hour12}:00 ${ampm}`);
        if (hour < 17) slots.push(`${hour12}:30 ${ampm}`);
      }
    }
    setAvailableSlots(slots);
  }, [userData]);

  const validatePhone = (n) => /^\d{10}$/.test(n);
  const isValidObjectId = (id) => /^[a-f\d]{24}$/i.test(id);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!validatePhone(formData.phone)) {
      return setErrors({ phone: 'Enter a valid 10-digit number' });
    }
    if (!formData.date) return setErrors({ date: 'Select a date' });
    if (!formData.time) return setErrors({ time: 'Select a time' });
    if (!formData.reason.trim()) return setErrors({ reason: 'Enter a reason' });

    setErrors({});

    if (!isValidObjectId(docId)) {
      alert("This is a demo doctor. Ask admin to add real doctor.");
      return;
    }

    const userStored = storedUser;
    if (!userStored) {
      alert('Please log in first.');
      navigate('/patient-auth', { state: { from: `/appointment/${docId}` } });
      return;
    }

    const appointment = {
      doctor: docId,
      date: formData.date,
      time: formData.time,
      symptoms: formData.reason
    };

    try {
      const res = await bookAppointment(appointment);

      if (res?.success) {
        alert("Appointment booked successfully!");
        navigate('/my-appointments');
      } else {
        alert(res?.message || "Failed to book appointment");
      }
    } catch (error) {
      alert("Something went wrong");
    }
  };

  if (!doctor) {
    return <div className="min-h-[80vh] flex items-center justify-center">Doctor not found</div>;
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-8">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Book Appointment</h2>

        {/* Doctor details */}
        <div className="flex items-center mb-6">
          <img
            src={
              doctor.image
                ? (doctor.image.startsWith("http")
                    ? doctor.image
                    : `${API_BASE}${doctor.image}`)
                : "/src/assets/doc1.png"
            }
            alt={doctor.name}
            className="w-16 h-16 rounded-full mr-4"
            onError={(e) => {
              e.target.src = "/src/assets/doc1.png";
            }}
          />
          <div>
            <h3 className="font-semibold">{doctor.name}</h3>
            <p className="text-gray-600">{doctor.speciality}</p>
            <p className="text-sm text-gray-500">{doctor.experience}</p>
            <p className="text-sm text-green-600 font-semibold">Fee: ₹{doctor.fees}</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <input
            type="text"
            required
            className="w-full p-2 border rounded"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          {/* Phone */}
          <div>
            <input
              type="tel"
              required
              maxLength="10"
              className="w-full p-2 border rounded"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, "");
                if (v.length <= 10) setFormData({ ...formData, phone: v });
              }}
            />
            {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}
          </div>

          {/* Date */}
          <div>
            <input
              type="date"
              required
              className="w-full p-2 border rounded"
              value={formData.date}
              min={minDate}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
            {errors.date && <p className="text-red-500 text-xs">{errors.date}</p>}
          </div>

          {/* Time */}
          <div>
            <select
              className="w-full p-2 border rounded"
              required
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            >
              <option value="">Select Time</option>
              {availableSlots.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            {errors.time && <p className="text-red-500 text-xs">{errors.time}</p>}
          </div>

          {/* Reason */}
          <div>
            <textarea
              required
              rows="3"
              className="w-full p-2 border rounded"
              placeholder="Reason for appointment"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            />
            {errors.reason && <p className="text-red-500 text-xs">{errors.reason}</p>}
          </div>

          <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            Book Appointment
          </button>
        </form>
      </div>
    </div>
  );
};

export default Appointment;
