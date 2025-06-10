import React from "react";
import { MenuItem, Select } from "@mui/material";

const Footer = () => {
  const [language, setLanguage] = React.useState("en");

  return (
    <footer className="bg-gray-100 text-black py-4 px-6 mt-10">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Left Copyright Section */}
        <div className="text-sm">&copy; 2025 Voice Annotator. All rights reserved.</div>

        {/* Center Links Section */}
        <div className="text-sm flex gap-4 flex-wrap">
          <span className="hover:underline hover:text-blue-600 cursor-pointer transition">Privacy</span>
          <span className="hover:underline hover:text-blue-600 cursor-pointer transition">Policy</span>
          <span className="hover:underline hover:text-blue-600 cursor-pointer transition">Refund</span>
          <span className="hover:underline hover:text-blue-600 cursor-pointer transition">Contact us</span>
        </div>

        {/* Right Language Selector Section */}
        <div>
          <Select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            size="small"
            variant="outlined"
            sx={{ minWidth: 120, fontSize: "0.875rem", backgroundColor: "white" }}
          >
            <MenuItem value="en">English</MenuItem>
            <MenuItem value="hi">Hindi</MenuItem>
            <MenuItem value="fr">French</MenuItem>
            <MenuItem value="es">Spanish</MenuItem>
          </Select>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
