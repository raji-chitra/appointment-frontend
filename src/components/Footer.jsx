import { } from "react";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <div className="md:mx-10">
      {/* --- Main Footer Sections --- */}
      <div className="flex flex-col sm:grid sm:grid-cols-3 gap-14 my-10 mt-40 text-sm text-gray-700">
        
        {/* --- Left section --- */}
        <div>
          <img className="mb-5 w-40" src={assets.logo} alt="Logo" />
          <p className="w-full md:w-4/5 text-gray-600 leading-6 text-justify">
            Prescripto is a healthcare platform that connects patients with trusted doctors,
            enabling easy appointment booking and access to quality medical care. 
            Our mission is to simplify healthcare for everyone.
          </p>
        </div>

        {/* --- Center section --- */}
        <div className="flex flex-col items-start">
          <p className="text-xl font-medium mb-5">COMPANY</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li className="cursor-pointer hover:text-primary">Home</li>
            <li className="cursor-pointer hover:text-primary">About us</li>
            <li className="cursor-pointer hover:text-primary">Contact us</li>
            <li className="cursor-pointer hover:text-primary">Privacy Policy</li>
          </ul>
        </div>

        {/* --- Right section --- */}
        <div className="flex flex-col items-start">
          <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>+91 93456 63342</li>
            <li>rajalakshmimurugesan@gmail.com</li>
          </ul>
        </div>
      </div>

      {/* --- Copyright Section --- */}
      <div className="border-t pt-4 pb-6 text-center text-xs text-gray-500">
        <p className="py-3 text-sm">
          Copyright 2025 @Prescripto — All Rights Reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
