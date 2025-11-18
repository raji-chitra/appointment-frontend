import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const RelatedDoctors = ({ speciality, docId }) => {
  const { doctors } = useContext(AppContext)
  const navigate = useNavigate()
  const [relDocs, setRelDocs] = useState([])

  useEffect(() => {
    if (doctors.length > 0 && speciality) {
      const doctorsData = doctors.filter(
        (doc) => doc.speciality === speciality && doc._id !== docId
      )
      setRelDocs(doctorsData)
    }
  }, [doctors, speciality, docId])

  return (
    <div className="flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10">
      <h1 className="text-3xl font-medium">Top Doctors to Book</h1>
      <p className="sm:w-1/3 text-center text-sm">
        Browse through our top-rated doctors and book your appointment with ease.
      </p>

      {/* Doctor Cards */}
      <div className="w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0">
        {relDocs.slice(0, 5).map((item) => (
          <div
            key={item._id}
            onClick={() => {
              navigate(`/appointment/${item._id}`)
              window.scrollTo(0, 0) // ensures page goes to top
            }}
            className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-2 transition-all duration-500"
          >
            {/* Doctor Image */}
            <img
              className="bg-blue-50 w-full h-48 object-cover"
              src={item.image}
              alt={item.name}
              onError={(e) => (e.target.src = '/fallback.png')} // fallback if broken
            />
            <div className="p-4">
              <div className="flex items-center gap-2 text-sm text-green-500">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <p>Available</p>
              </div>
              <p className="text-gray-900 text-lg font-medium">{item.name}</p>
              <p className="text-gray-600 text-sm">{item.speciality}</p>
            </div>
          </div>
        ))}
      </div>

      {/* More button */}
      <button
        onClick={() => {
          navigate('/doctors')
          window.scrollTo(0, 0)
        }}
        className="bg-blue-50 text-blue-600 px-12 py-3 rounded-full mt-10"
      >
        More
      </button>
    </div>
  )
}

export default RelatedDoctors
