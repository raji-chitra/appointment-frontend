import React, { useEffect, useState } from "react";
import API, { adminAPI } from "../services/api";


const AdminDashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [showAddDoctor, setShowAddDoctor] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const [newDoctor, setNewDoctor] = useState({
    name: "",
    email: "",
    password: "",
    speciality: "",
    experience: "",
    fees: "",
    degree: "MBBS",
  });

  const adminToken = localStorage.getItem("adminToken");

  // Redirect if not logged in
  useEffect(() => {
    if (!adminToken) window.location.href = "/admin-login";
  }, []);

  // Fetch doctors + appointments
  const fetchData = async () => {
    try {
      const docRes = await adminAPI.getDoctors();
      const apptRes = await adminAPI.getAppointments();

      if (docRes.success) setDoctors(docRes.doctors);
      if (apptRes.success) setAppointments(apptRes.appointments);
    } catch (e) {
      console.error("Fetch failed", e);
      if (e.response?.status === 401) {
        alert("Session expired. Login again.");
        localStorage.clear();
        window.location.href = "/admin-login";
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Save doctor
  const handleAddDoctor = async () => {
    try {
      const formData = new FormData();
      formData.append("name", newDoctor.name);
      formData.append("email", newDoctor.email);
      formData.append("password", newDoctor.password || "doctor123");
      formData.append("specialization", newDoctor.speciality);
      formData.append("experience", Number(newDoctor.experience));
      formData.append("fees", Number(newDoctor.fees));
      formData.append("degree", newDoctor.degree);

      if (imageFile) formData.append("image", imageFile);

      const res = await adminAPI.addDoctor(formData);
      if (res.success) {
        setShowAddDoctor(false);
        setNewDoctor({
          name: "",
          email: "",
          password: "",
          speciality: "",
          experience: "",
          fees: "",
          degree: "MBBS",
        });
        setImageFile(null);
        fetchData();
      }
    } catch (e) {
      alert(e?.response?.data?.message || "Add doctor failed");
    }
  };

  // Remove doctor
  const handleRemoveDoctor = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      await adminAPI.removeDoctor(id);
      fetchData();
    } catch (e) {
      alert("Delete failed");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      {/* Doctor management */}
      <div className="bg-white p-4 mt-4 shadow">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Doctor Management</h2>
          <button
            onClick={() => setShowAddDoctor(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add Doctor
          </button>
        </div>

        {showAddDoctor && (
          <div className="mt-4 p-3 bg-gray-100 rounded">
            <input
              className="border p-2 w-full mb-2"
              placeholder="Name"
              value={newDoctor.name}
              onChange={(e) =>
                setNewDoctor({ ...newDoctor, name: e.target.value })
              }
            />

            <input
              className="border p-2 w-full mb-2"
              placeholder="Email"
              value={newDoctor.email}
              onChange={(e) =>
                setNewDoctor({ ...newDoctor, email: e.target.value })
              }
            />

            <input
              className="border p-2 w-full mb-2"
              placeholder="Password"
              type="password"
              value={newDoctor.password}
              onChange={(e) =>
                setNewDoctor({ ...newDoctor, password: e.target.value })
              }
            />

            <input
              className="border p-2 w-full mb-2"
              placeholder="Speciality"
              value={newDoctor.speciality}
              onChange={(e) =>
                setNewDoctor({ ...newDoctor, speciality: e.target.value })
              }
            />

            <input
              className="border p-2 w-full mb-2"
              placeholder="Experience"
              value={newDoctor.experience}
              onChange={(e) =>
                setNewDoctor({ ...newDoctor, experience: e.target.value })
              }
            />

            <input
              className="border p-2 w-full mb-2"
              placeholder="Fees"
              value={newDoctor.fees}
              onChange={(e) =>
                setNewDoctor({ ...newDoctor, fees: e.target.value })
              }
            />

            <input
              className="border p-2 w-full mb-2"
              type="file"
              onChange={(e) => setImageFile(e.target.files[0])}
            />

            <button
              onClick={handleAddDoctor}
              className="bg-green-600 text-white px-4 py-2 mt-2 rounded"
            >
              Save Doctor
            </button>
          </div>
        )}

        {/* Doctors list */}
        <table className="mt-4 w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Name</th>
              <th className="p-2">Speciality</th>
              <th className="p-2">Fees</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {doctors.map((d) => (
              <tr key={d._id} className="border-b">
                <td className="p-2">{d.name}</td>
                <td className="p-2">{d.specialization}</td>
                <td className="p-2">₹{d.fees}</td>
                <td className="p-2">
                  <button
                    className="bg-red-600 text-white px-3 py-1 rounded"
                    onClick={() => handleRemoveDoctor(d._id)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Appointment data omitted — follow same pattern */}
    </div>
  );
};

export default AdminDashboard;
