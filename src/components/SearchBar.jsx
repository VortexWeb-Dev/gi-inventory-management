import React, { useState, useRef } from "react";
import { Search, X } from "lucide-react";

const Searchbar = ({ searchTerm, setSearchTerm }) => {
  const inputRef = useRef(null);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleClear = () => {
    setSearchTerm("");
    inputRef.current.focus();
  };

  return (
    <div className="relative flex items-center rounded-full shadow-md border border-gray-200 overflow-hidden w-full max-w-md focus-within:shadow-lg transition-shadow duration-300">
      <div className="pl-4 absolute inset-y-0 left-0 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>

      <input
        ref={inputRef}
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        placeholder="Search by Location"
        className="pl-12 pr-16 py-3 w-full focus:outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent"
      />

      {searchTerm && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-10 flex items-center focus:outline-none"
        >
          <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
        </button>
      )}

      {/* <button
        onClick={handleSearch}
        className="absolute inset-y-0 right-0 bg-blue-600 text-white py-2 px-4 rounded-r-full hover:bg-blue-700 focus:outline-none text-sm font-medium"
      >
        Search
      </button> */}
    </div>
  );
};

export default Searchbar;
