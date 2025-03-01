import React from "react";

export const Navbar = () => {
  return (
    <nav className="bg-gradient-to-r from-blue-700 to-blue-800 text-white p-4 shadow-lg backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold tracking-tight">
            PDF<span className="text-blue-300">Utils</span>
          </h1>
        </div>
      </div>
    </nav>
  );
};
