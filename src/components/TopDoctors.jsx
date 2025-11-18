import React from "react";

// import doctor images from assets
import doc1 from "../assets/doc1.png";
import doc2 from "../assets/doc2.png";
import doc3 from "../assets/doc3.png";
import doc4 from "../assets/doc4.png";
import doc5 from "../assets/doc5.png";
import doc6 from "../assets/doc6.png";
import doc7 from "../assets/doc7.png";
import doc8 from "../assets/doc8.png";

const TopDoctors = () => {
  // static doctors data (later can replace with API/context)
  const doctors = [
    { id: 1, name: "Dr. Richard James", specialization: "Cardiologist", image: doc1 },
    { id: 2, name: "Dr. Emily Larson", specialization: "Gynecologist", image: doc2 },
    { id: 3, name: "Dr. Sarah Patel", specialization: "Dermatologist", image: doc3 },
    { id: 4, name: "Dr. Christopher Lee", specialization: "Neurologist", image: doc4 },
    { id: 5, name: "Dr. Jennifer Garcia", specialization: "Pediatrician", image: doc5 },
    { id: 6, name: "Dr. Daniel Kim", specialization: "Orthopedic", image: doc6 },
    { id: 7, name: "Dr. Monica Brown", specialization: "ENT Specialist", image: doc7 },
    { id: 8, name: "Dr. David Wilson", specialization: "General Physician", image: doc8 },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {doctors.map((doctor) => (
        <div
          key={doctor.id}
          className="bg-white rounded-xl shadow p-4 text-center hover:shadow-lg transition"
        >
          {/* Doctor Image */}
          <img
            src={doctor.image}
            alt={doctor.name}
            className="w-24 h-24 object-cover rounded-full mx-auto mb-4"
          />
          {/* Doctor Info */}
          <h3 className="font-semibold text-lg">{doctor.name}</h3>
          <p className="text-sm text-gray-500">{doctor.specialization}</p>
          {/* Button */}
          <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition">
            Book Appointment
          </button>
        </div>
      ))}
    </div>
  );
};

export default TopDoctors;
