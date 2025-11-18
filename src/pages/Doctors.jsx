import { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Doctors = () => {
  const { speciality } = useParams();
  const [filterDoc, setFilterDoc] = useState([]);
  const navigate = useNavigate();
  const { doctors, userData } = useContext(AppContext);

  // Apply filter
  // Helper to get label from slug
  const getLabelFromSlug = (slug) => {
    const found = specialities.find((s) => s.slug === slug);
    return found ? found.label : slug;
  };

  // Apply filter using label
  const applyFilter = () => {
    if (speciality) {
      const label = getLabelFromSlug(speciality);
      setFilterDoc(
        doctors.filter((doc) => {
          const docSpeciality = (doc.specialization || doc.speciality || '').toLowerCase();
          return docSpeciality === label.toLowerCase();
        })
      );
    } else {
      setFilterDoc(doctors);
    }
  };

  useEffect(() => {
    applyFilter();
  }, [doctors, speciality]);

  // Use URL-friendly slugs for navigation and filtering
  const specialities = [
    { label: "General Physician", slug: "general-physician" },
    { label: "Gynecologist", slug: "gynecologist" },
    { label: "Dermatologist", slug: "dermatologist" },
    { label: "Pediatrician", slug: "pediatrician" },
    { label: "Neurologist", slug: "neurologist" },
    { label: "Gastroenterologist", slug: "gastroenterologist" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <p className="text-gray-600 text-lg">
        Browse through the doctors{" "}
        {speciality ? `specializing in ${speciality}` : ""}
      </p>

      <div className="flex flex-col sm:flex-row items-start gap-6 mt-6">
        {/* Sidebar Filters */}
        <div className="flex flex-col gap-4 text-sm text-gray-600 w-full sm:w-60">
          {specialities.map((spec) => (
            <p
              key={spec.slug}
              onClick={() =>
                speciality === spec.slug
                  ? navigate("/doctors")
                  : navigate(`/doctors/${spec.slug}`)
              }
              className={`pl-3 py-2 border border-gray-300 rounded cursor-pointer transition-all text-center sm:text-left 
                ${
                  speciality === spec.slug
                    ? "bg-indigo-100 text-black font-medium"
                    : "hover:bg-gray-100"
                }`}
            >
              {spec.label}
            </p>
          ))}
        </div>

        {/* Doctors List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
          {filterDoc.map((item, index) => (
            <div
              key={index}
              onClick={() => navigate(`/appointment/${item._id}`)}
              className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <img
                className="w-full h-56 object-cover bg-blue-50"
                src={item.image ? (item.image.startsWith('http') ? item.image : `http://localhost:5000${item.image}`) : '/src/assets/doc1.png'}
                alt={item.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/src/assets/doc1.png';
                }}
              />
              <div className="p-4">
                <div className="flex items-center gap-2 text-sm text-green-500 mb-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>Available</span>
                </div>
                <p className="text-gray-900 text-lg font-semibold">
                  {item.name}
                </p>
                <p className="text-gray-600 text-sm">{item.specialization || item.speciality}</p>
              </div>
            </div>
          ))}

          {filterDoc.length === 0 && (
            <p className="text-gray-500 col-span-full text-center">
              No doctors found for "{speciality ? getLabelFromSlug(speciality) : ''}"
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Doctors;
