import React from "react";
import { FaStar, FaRegStar } from "react-icons/fa"; // Font Awesome React Icons

const RateThisApp = () => {
  return (
    <div className="flex items-center gap-2 mt-6">
      <p className="font-bold text-lg text-gray-800">Rate This Tool</p>

      {/* Stars */}
      <div className="flex items-center text-yellow-500 text-xl">
        <FaStar />
        <FaStar />
        <FaStar />
        <FaStar />
        <FaRegStar />
      </div>

      {/* Score */}
      <span className="text-gray-700 font-medium ml-2">4/5</span>

      {/* Votes */}
      <span className="text-sm text-gray-500 ml-1">(52421 Votes)</span>
    </div>
  );
};

export default RateThisApp;
