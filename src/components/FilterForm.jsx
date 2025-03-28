import React, { useEffect, useState, useRef } from 'react';
import { Search, Bed, Bath, Home, ListChecks, Building, House, PersonStanding } from 'lucide-react';

const RangeFilter = ({ label, fromValue, toValue, onFromChange, onToChange, onClose }) => {
    return (
      <div className="absolute bg-white border rounded-md shadow-md p-4 mt-2">
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

const FilterBar = ({filteredData,setFilteredData}) => {

const savedFilteredData = useRef(null); 
const hasRun = useRef(false);

    useEffect(()=>{
        if (hasRun.current || filteredData.length === 0) return;
        
            savedFilteredData.current = filteredData
            hasRun.current = true;
            console.log("savedFilteredData: ", savedFilteredData)

        
    },[filteredData])

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
    // price: null,
    // size: null
  });

  const [showPriceFilter, setShowPriceFilter] = useState(false);
  const [showSizeFilter, setShowSizeFilter] = useState(false);


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

//   const handleFilterClick = () => {
//     // console.log('Filters:', filters);

//     const newFilteredData = filteredData.filter(item =>
//         Object.entries(filters).every(([key, value]) => {
//             // Only filter by fields that have a non-empty, non-null value
//             if (value !== '' && value !== null) {
//                 return item[key]?.toString().toLowerCase().includes(value.toString().toLowerCase());
//             }
//             return true;
//         })
//     );

//     // console.log('Filtered Data:', newFilteredData);
//     setFilteredData(newFilteredData);
// };

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
    const newFilteredData = filteredData.filter(item =>
        Object.entries(filters).every(([key, value]) => {
            if (value !== '' && value !== null) {
                if (["comm", "subComm", "building"].includes(key)) {
                    const locationData = processLocations(item.locationPf, item.locationBayut);
                    // console.log(locationData)
                    const lowerValue = value.toString().toLowerCase();
                    // console.log(key)
                    // console.log(lowerValue)
                    
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
    //   priceFrom: '',
    //   priceTo: '',
    //   sizeFrom: '',
    //   sizeTo: '',
    });
    // setShowPriceFilter(false);
    // setShowSizeFilter(false);
    setFilteredData(savedFilteredData.current)
  };

  return (
    <div className="flex justify-center px-4 py-2 w-full">
    <div className="bg-white bg-opacity-10 rounded-xl shadow-md p-6 flex flex-wrap justify-center gap-4 backdrop-filter backdrop-blur-lg w-full max-w-4xl">
      {[
        { name: "agentName", placeholder: "Agents", Icon: Search },
        { name: "ownerName", placeholder: "Owners", Icon: Search },
        { name: "comm", placeholder: "Community", Icon: House },
        { name: "subComm", placeholder: "Sub Community", Icon: PersonStanding },
        { name: "building", placeholder: "Building", Icon: Building },
      ].map(({ name, placeholder, Icon }) => (
        <div key={name} className="flex items-center space-x-2 w-56">
          <Icon className="text-blue-300" />
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
      {[
        { name: "bedrooms", label: "Beds", Icon: Bed, options: [0, 1, 2, 3, 4, 5] },
        { name: "bathrooms", label: "Baths", Icon: Bath, options: [0, 1, 2, 3, 4, 5] },
        { name: "unitType", label: "Unit Type", Icon: Home, options: ["Apartment", "Villa", "Short Term / Hotel Apartment"] },
        { name: "status", label: "Status", Icon: ListChecks, options: ["Published", "Pocketed"] },
      ].map(({ name, label, Icon, options }) => (
        <div key={name} className="flex items-center space-x-2 w-56">
          <Icon className="text-blue-300" />
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
      <div className="flex justify-center gap-4 w-full">
        <button
          type="button"
          onClick={handleFilterClick}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 text-lg rounded-md"
        >
          Filter
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
  );
};

export default FilterBar;