import React, { useEffect, useState, useRef } from 'react';
import { Search, Bed, Bath, Home, ListChecks, Building, House, PersonStanding } from 'lucide-react';
import AutocompleteSearch from './SearchBar';

const RangeFilter = ({ label, fromValue, toValue, onFromChange, onToChange, onClose }) => {
  return (
    <div className="absolute bg-white border rounded-md shadow-md p-4 mt-2 z-10">
      <h3 className="text-lg font-semibold mb-2">{label} Range</h3>
      <div className="flex items-center space-x-2">
        <input
          type="number"
          value={fromValue}
          onChange={(e) => onFromChange(e.target.value)}
          placeholder="From"
          className="border rounded-md p-2 w-24"
        />
        <span>-</span>
        <input
          type="number"
          value={toValue}
          onChange={(e) => onToChange(e.target.value)}
          placeholder="To"
          className="border rounded-md p-2 w-24"
        />
      </div>
      <button onClick={onClose} className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md">
        Apply
      </button>
    </div>
  );
};

const FilterBar = ({ filteredData, setFilteredData }) => {
  const savedFilteredData = useRef(null);
  const hasRun = useRef(false);

  const [locationsArray, setLocationsArray] = useState(null);

useEffect(() => {
  if (hasRun.current || filteredData.length === 0) return;

  savedFilteredData.current = filteredData;
  hasRun.current = true;
  setLocationsArray(savedFilteredData.current.map(item => item.locationBayut));
}, [filteredData]);

  const [filters, setFilters] = useState({
    agentName: '',
    ownerName: '',
    bedrooms: '',
    bathrooms: '',
    unitType: '',
    status: '',
    comm: '',
    subComm: '',
    building: ''
  });

  const [showPriceFilter, setShowPriceFilter] = useState(false);
  const [showSizeFilter, setShowSizeFilter] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);

  const clearPriceFilter = () => {
    setFilters({ ...filters, priceFrom: '', priceTo: '' });
  };

  const clearSizeFilter = () => {
    setFilters({ ...filters, sizeFrom: '', sizeTo: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  function processLocations(locationPf, locationBayut) {
    // Split both strings by " - "
    let pfParts = locationPf.split(" - ");
    let bayutParts = locationBayut.split(" - ");
    
    let result = [];
    
    // First element: first part of both
    result.push(`${pfParts[0]} ${bayutParts[0]}`);
    
    // Second element: second part of both
    result.push(`${pfParts[1] || ''} ${bayutParts[1] || ''}`.trim());
    
    // Third element: remaining middle part of bayut excluding already used ones in pf
    let remainingBayutParts = bayutParts.slice(2, -1);
    let remainingPfParts = pfParts.slice(2, -1);
    let middlePart = [...remainingPfParts, ...remainingBayutParts].join(" ");
    result.push(middlePart);
    
    // Fourth element: last part of both
    result.push(`${pfParts.at(-1)} ${bayutParts.at(-1)}`);
    
    return result;
  }



  const handleFilterClick = () => {
    const newFilteredData = savedFilteredData.current.filter(item =>
      Object.entries(filters).every(([key, value]) => {
        if (value !== '' && value !== null) {
          if (["comm", "subComm", "building"].includes(key)) {
            const locationData = processLocations(item.locationPf, item.locationBayut);
            const lowerValue = value.toString().toLowerCase();
            
            if (key === "comm") {
              return locationData[1]?.toString().toLowerCase().includes(lowerValue);
            } else if (key === "subComm") {
              if (locationData[3] && locationData[2] != '') {
                return locationData[2].toString().toLowerCase().includes(lowerValue);
              } else {
                return locationData[1]?.toString().toLowerCase().includes(lowerValue);
              }
            } else if (key === "building") {
              return locationData[3]?.toString().toLowerCase().includes(lowerValue);
            }
          } else {
            return item[key]?.toString().toLowerCase().includes(value.toString().toLowerCase());
          }
        }
        return true;
      })
    );

    setFilteredData(newFilteredData);
    // On mobile, collapse the filter after applying
    if (window.innerWidth < 768) {
      setIsCollapsed(true);
    }
  };

  const handleReset = () => {
    setFilters({
      agentName: '',
      ownerName: '',
      bedrooms: '',
      bathrooms: '',
      unitType: '',
      status: '',
      comm: '',
      subComm: '',
      building: ''
    });
    setFilteredData(savedFilteredData.current);
  };

  const toggleFilters = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Input groups for the form
  const textInputs = [
    
    { name: "ownerName", placeholder: "Owners", Icon: Search },
    { name: "comm", placeholder: "Community", Icon: House },
    { name: "subComm", placeholder: "Sub Community", Icon: PersonStanding },
    { name: "building", placeholder: "Building", Icon: Building },
  ];

  const selectInputs = [
    { name: "bedrooms", label: "Beds", Icon: Bed, options: [0, 1, 2, 3, 4, 5] },
    { name: "bathrooms", label: "Baths", Icon: Bath, options: [0, 1, 2, 3, 4, 5] },
    { name: "unitType", label: "Unit Type", Icon: Home, options: ["Apartment", "Villa", "Short Term / Hotel Apartment"] },
    { name: "status", label: "Status", Icon: ListChecks, options: ["Published", "Pocketed"] },
  ];

  return (
    <div className="w-full px-4 py-2">

      <AutocompleteSearch locations ={locationsArray} savedProperty={savedFilteredData.current} setProperty={setFilteredData}/>

      <div className="bg-white bg-opacity-10 rounded-xl shadow-md p-4 md:p-6 backdrop-filter backdrop-blur-lg w-full max-w-4xl mx-auto">
        {/* Mobile toggle button */}
        <button 
          className="w-full md:hidden flex justify-between items-center bg-blue-600 text-white p-3 rounded-md mb-4"
          onClick={toggleFilters}
        >
          <span className="font-medium">Filters</span>
          <span>{isCollapsed ? '▼' : '▲'}</span>
        </button>

        {/* Filter form - will be hidden on mobile when collapsed */}
        <div className={`${isCollapsed ? 'hidden' : 'flex'} md:flex flex-col md:flex-row flex-wrap justify-center gap-2 md:gap-4`}>
          {textInputs.map(({ name, placeholder, Icon }) => (
            <div key={name} className="flex items-center space-x-2 w-full md:w-56 mb-2">
              <Icon className="text-blue-300 h-5 w-5" />
              <input
                type="text"
                name={name}
                value={filters[name]}
                onChange={handleInputChange}
                placeholder={placeholder}
                className="bg-transparent border border-blue-600 rounded-md p-2 text-gray-500 placeholder-blue-300 focus:outline-none focus:border-blue-400 w-full"
              />
            </div>
          ))}
          
          {selectInputs.map(({ name, label, Icon, options }) => (
            <div key={name} className="flex items-center space-x-2 w-full md:w-56 mb-2">
              <Icon className="text-blue-300 h-5 w-5" />
              <select
                name={name}
                value={filters[name]}
                onChange={handleInputChange}
                className="bg-transparent border border-blue-600 rounded-md p-2 text-gray-500 focus:outline-none focus:border-blue-400 w-full"
              >
                <option value="">{label}</option>
                {options.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          ))}
          
          <div className="flex flex-row justify-center gap-3 w-full mt-2">
            <button
              type="button"
              onClick={handleFilterClick}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 text-lg rounded-md"
            >
              Search
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-6 text-lg rounded-md"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;