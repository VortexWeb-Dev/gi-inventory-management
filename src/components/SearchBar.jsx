
import React, { useState, useEffect } from "react";
import { MapPin, Search, X } from "lucide-react";
import Fuse from 'fuse.js';

const AutocompleteSearch = ({ locations, savedProperty, setProperty, searchTerm, setSearchTerm }) => {
  // const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Function to filter locations based on search searchTerm
  // useEffect(() => {
  //   if (searchTerm.trim() === "") {
  //     setSuggestions([]);
  //     return;
  //   }

  //   const filteredLocations = locations.filter((location) =>
  //     location.toLowerCase().includes(searchTerm.toLowerCase())
  //   );

  //   setSuggestions(filteredLocations);
  // }, [searchTerm, locations]);



  const [fuseInstance, setFuseInstance] = useState(null);
  
  // Initialize Fuse instance once when locations change
  useEffect(() => {
    // Safeguard against null or undefined locations
    const locationsArray = Array.isArray(locations) ? locations : [];
    
    // Configure Fuse options specifically for strings like "tower C, place, street, city"
    const options = {
      includeScore: true,
      threshold: 0.4, // Increased threshold for better partial matching
      ignoreLocation: true, // Important for location strings where the match can be anywhere
      distance: 100, // Allow matching across the entire string
    };
    
    // Only create instance if we have valid locations
    if (locationsArray.length > 0) {
      setFuseInstance(new Fuse(locationsArray, options));
    } else {
      setFuseInstance(null);
    }
  }, [locations]);
  
  // Perform search when searchTerm changes
  useEffect(() => {
    if (!fuseInstance || searchTerm.trim() === "") {
      setSuggestions([]);
      return;
    }
    
    try {
      // Perform fuzzy search
      const results = fuseInstance.search(searchTerm);
      
      // Extract just the matched strings
      const fuzzyResults = results
  .map(result => result.item)
  .sort((a, b) => b.score - a.score);
      
      setSuggestions(fuzzyResults);
      
      // Debug - log results with scores to understand matches
      console.log('Search results with scores:', 
        fuzzyResults
      );
    } catch (error) {
      console.error('Error performing fuzzy search:', error);
      setSuggestions([]);
    }
  }, [searchTerm, fuseInstance]);
  
  // Function to handle property filtering
  const handleLocationSelect = (location) => {
    setSearchTerm(location);
    setShowSuggestions(false);
    
    // Filter properties based on selected location
    // const filteredProperties = savedProperty.filter(
    //   (property) => property.locationBayut === location
    // );
    // console.log(savedProperty);
    // console.log(filteredProperties);
    
    
    // // Update properties with filtered results
    // setProperty(filteredProperties);
  };

  // Function to handle input change
  const handleInputChange = (e) => {
    const newsearchTerm = e.target.value;
    
    setSearchTerm(newsearchTerm);

    // const filteredProperties = savedProperty.filter(
    //   (property) => property.locationBayut.toLowerCase().includes(newsearchTerm.toLowerCase())
    // );

    // setProperty(filteredProperties)
    console.log(newsearchTerm);
    
    if (newsearchTerm.trim() === "") {
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
          placeholder="Search for a city, community or building..."
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 500)}
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5"/>
        {searchTerm && (
          <button 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            onClick={() => {
              setSearchTerm("");
              // setProperty(savedProperty);
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