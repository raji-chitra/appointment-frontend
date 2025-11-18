import React from "react";
import { useNavigate } from "react-router-dom";

import headerImg from "../assets/header_img.png"; // main hero doctor image
import SpecialityMenu from "../components/SpecialityMenu";
import TopDoctors from "../components/TopDoctors";
import Footer from "../components/Footer";
import Banner from "../components/Banner";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white">

      {/* HERO SECTION */}
      <section className="bg-[#5b6dff]">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 items-center px-6 py-28">
          {/* Left Content */}
          <div className="text-white">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Book Appointment <br /> With Trusted Doctors
            </h1>
            <p className="mt-6 text-lg max-w-md">
              Simply browse through our extensive list of trusted doctors, 
              schedule your appointment hassle-free.
            </p>
            <button
              onClick={() => navigate("/doctors")}
              className="mt-6 bg-white text-blue-600 font-medium px-6 py-3 rounded-full shadow hover:bg-gray-100 transition"
            >
              Book Appointment →
            </button>
          </div>

          {/* Right Content */}
          <div className="flex justify-center mt-10 md:mt-0">
            <div className="w-[520px] max-w-full">
              <img
                src={headerImg}
                alt="Doctors"
                className="w-full h-auto object-contain rounded-r-3xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SPECIALITY MENU */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-center text-2xl md:text-3xl font-bold mb-10">
          Our Medical Specialities
        </h2>
        <SpecialityMenu />
      </section>

      {/* BANNER */}
      <section className="max-w-7xl mx-auto px-6">
        <Banner />
      </section>

      {/* TOP DOCTORS */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-center text-2xl md:text-3xl font-bold mb-10">
          Top Doctors to Book
        </h2>
        <TopDoctors />
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
};

export default Home;
