
import React, { useState, useEffect } from "react";
import { MapPin, Search, X } from "lucide-react";
const AutocompleteSearch = ({ locations, savedProperty, setProperty }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Function to filter locations based on search query
  useEffect(() => {
    if (query.trim() === "") {
      setSuggestions([]);
      return;
    }

    const filteredLocations = locations.filter((location) =>
      location.toLowerCase().includes(query.toLowerCase())
    );

    setSuggestions(filteredLocations);
  }, [query, locations]);

  // Function to handle property filtering
  const handleLocationSelect = (location) => {
    setQuery(location);
    setShowSuggestions(false);
    
    // Filter properties based on selected location
    const filteredProperties = savedProperty.filter(
      (property) => property.locationBayut === location
    );
    console.log(savedProperty);
    console.log(filteredProperties);
    
    
    // Update properties with filtered results
    setProperty(filteredProperties);
  };

  // Function to handle input change
  const handleInputChange = (e) => {
    const newQuery = e.target.value;
    
    setQuery(newQuery);

    const filteredProperties = savedProperty.filter(
      (property) => property.locationBayut.toLowerCase().includes(newQuery.toLowerCase())
    );

    setProperty(filteredProperties)
    console.log(newQuery);
    
    if (newQuery.trim() === "") {
      // Reset to show all properties when search is cleared
      setProperty(savedProperty);
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto my-2">
      <div className="flex items-center relative">
        <input
          type="text"
          className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          placeholder="Search for a location..."
          value={query}
          onChange={handleInputChange}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 500)}
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5"/>
        {query && (
          <button 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            onClick={() => {
              setQuery("");
              setProperty(savedProperty);
            }}
          >
            
            <X className="h-5 w-5 text-gray-400 hover:text-gray-600"/>
          </button>
        )}
      </div>
      {showSuggestions && suggestions.length > 0 && (
       <ul className="absolute left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-md max-h-60 overflow-y-auto z-10">
       {suggestions.map((location, index) => (
         <li
           key={index}
           className="px-4 py-2 cursor-pointer hover:bg-blue-100 transition-colors flex items-center"
           onClick={() => handleLocationSelect(location)}
         >
           <div className="w-6 flex-shrink-0 flex justify-center">
             <MapPin className="h-5 w-5 text-gray-400" />
           </div>
           <span className="ml-2">{location}</span>
         </li>
       ))}
     </ul>
      )}
    </div>
  );
};

export default AutocompleteSearch;