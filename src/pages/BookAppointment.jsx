import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import API from '../services/api'; // ← Use your API wrapper

const BookAppointment = () => {
  const navigate = useNavigate();
  const { doctorId } = useParams();

  // Base URL for images (remove /api)
  const API_BASE = API.defaults.baseURL.replace("/api", "");

  // Load doctors from localStorage
  const doctors = JSON.parse(localStorage.getItem("doctors") || "[]");
  const doctor = doctors.find((d) => String(d._id) === String(doctorId));

  const [loading, setLoading] = useState(!doctor);

  const [formData, setFormData] = useState({
    date: "",
    time: "",
    reason: "",
    contact: "",
  });

  /* ----------------------------------------
     Fetch doctor if not in localStorage
  ---------------------------------------- */
  useEffect(() => {
    if (!doctor && doctorId) {
      const fetchDoctor = async () => {
        try {
          const response = await API.get(`/doctors/${doctorId}`);
          if (response.data.success) {
            const updated = [...doctors, response.data.doctor];
            localStorage.setItem("doctors", JSON.stringify(updated));
          }
        } catch (err) {
          console.error("Error fetching doctor:", err);
        }
        setLoading(false);
      };
      fetchDoctor();
    }
  }, [doctorId, doctor]);

  if (loading)
    return (
      <div className="max-w-md mx-auto mt-10 p-8">
        Loading doctor information...
      </div>
    );

  if (!doctor)
    return (
      <div className="max-w-md mx-auto mt-10 p-8">
        Doctor not found
      </div>
    );

  // Correct image URL
  const doctorImage = doctor.image
    ? doctor.image.startsWith("http")
      ? doctor.image
      : `${API_BASE}${doctor.image}`
    : "/src/assets/doc1.png";

  /* ----------------------------------------
      Submit Handler
  ---------------------------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first");
      navigate("/patient-auth");
      return;
    }

    try {
      const res = await API.post(
        "/appointments/book",
        {
          doctor: doctorId,
          date: formData.date,
          time: formData.time,
          symptoms: formData.reason,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        alert("Appointment booked successfully!");
        navigate("/my-appointments");
      } else {
        alert(res.data.message || "Failed to book appointment");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">
        Book Appointment with {doctor.name}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label>Date</label>
          <input
            type="date"
            required
            value={formData.date}
            onChange={(e) =>
              setFormData({ ...formData, date: e.target.value })
            }
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label>Time</label>
          <input
            type="time"
            required
            value={formData.time}
            onChange={(e) =>
              setFormData({ ...formData, time: e.target.value })
            }
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label>Reason</label>
          <textarea
            required
            value={formData.reason}
            onChange={(e) =>
              setFormData({ ...formData, reason: e.target.value })
            }
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
            onChange={(e) =>
              setFormData({ ...formData, contact: e.target.value })
            }
            className="w-full p-2 border rounded"
            placeholder="Enter your contact number"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Book Appointment
        </button>
      </form>
    </div>
  );
};

export default BookAppointment;
