import React, { useState, useEffect } from "react";

const MyProfile = () => {
  const storedUser = JSON.parse(localStorage.getItem("userData")) || {};

  const [formData, setFormData] = useState({
    name: storedUser?.name || "John Doe",
    email: storedUser?.email || "user@example.com",
    phone: storedUser?.phone || "1234567890",
    address: storedUser?.address || {
      line1: "123 Main Street",
      line2: "New York, USA",
    },
  });

  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  // phone validation
  const validatePhone = (phone) => {
    const regex = /^[0-9]{10}$/;
    return regex.test(phone);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "line1" || name === "line2") {
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSave = async () => {
    if (formData.phone && !validatePhone(formData.phone)) {
      setErrors({ phone: "Please enter a valid 10-digit phone number" });
      return;
    }

    setErrors({});

    // ✅ Apply default address if empty
    const finalFormData = {
      ...formData,
      address: {
        line1: formData.address.line1 || "123 Default Street",
        line2: formData.address.line2 || "City, Country",
      },
    };

    try {
      // --- If you have backend API uncomment this ---
      /*
      await fetch("http://localhost:5000/api/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalFormData),
      });
      */

      // Save in localStorage
      const updatedUser = { ...storedUser, ...finalFormData };
      localStorage.setItem("userData", JSON.stringify(updatedUser));

      alert("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">My Profile</h2>

      {/* Name */}
      <div className="mb-4">
        <label className="block font-medium">Name</label>
        {isEditing ? (
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
        ) : (
          <p className="p-2 bg-gray-50 rounded-md">
            {formData.name || "Not provided"}
          </p>
        )}
      </div>

      {/* Email */}
      <div className="mb-4">
        <label className="block font-medium">Email</label>
        {isEditing ? (
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
        ) : (
          <p className="p-2 bg-gray-50 rounded-md">
            {formData.email || "Not provided"}
          </p>
        )}
      </div>

      {/* Phone */}
      <div className="mb-4">
        <label className="block font-medium">Phone</label>
        {isEditing ? (
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
        ) : (
          <p className="p-2 bg-gray-50 rounded-md">
            {formData.phone || "Not provided"}
          </p>
        )}
        {errors.phone && (
          <p className="text-red-500 text-sm">{errors.phone}</p>
        )}
      </div>

      {/* Address */}
      <div className="mb-4">
        <label className="block font-medium">Address</label>
        {isEditing ? (
          <>
            <input
              type="text"
              name="line1"
              placeholder="Line 1"
              value={formData.address.line1}
              onChange={handleChange}
              className="w-full p-2 border rounded-md mb-2"
            />
            <input
              type="text"
              name="line2"
              placeholder="Line 2"
              value={formData.address.line2}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </>
        ) : (
          <>
            <p className="p-2 bg-gray-50 rounded-md">
              {formData.address.line1 || "123 Default Street"}
            </p>
            <p className="p-2 bg-gray-50 rounded-md">
              {formData.address.line2 || "City, Country"}
            </p>
          </>
        )}
      </div>

      {/* Buttons */}
      {isEditing ? (
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Save
        </button>
      ) : (
        <button
          onClick={() => setIsEditing(true)}
          className="px-4 py-2 bg-green-500 text-white rounded-md"
        >
          Edit
        </button>
      )}
    </div>
  );
};

export default MyProfile;
