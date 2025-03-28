import React, { useEffect, useState, useRef } from 'react';
import { Search, Bed, Bath, Home, ListChecks } from 'lucide-react';

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


    useEffect(()=>{
        savedFilteredData.current = filteredData
    },[])

  const [filters, setFilters] = useState({
    agentName: '',
    ownerName: '',
    bedrooms: '',
    bathrooms: '',
    unitType: '',
    status: '',
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

  const handleFilterClick = () => {
    // console.log('Filters:', filters);

    const newFilteredData = filteredData.filter(item =>
        Object.entries(filters).every(([key, value]) => {
            // Only filter by fields that have a non-empty, non-null value
            if (value !== '' && value !== null) {
                return item[key]?.toString().toLowerCase().includes(value.toString().toLowerCase());
            }
            return true;
        })
    );

    // console.log('Filtered Data:', newFilteredData);
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
    <div className="p-4 w-[100%]">
      <div className="bg-white bg-opacity-10 rounded-xl shadow-md p-4 flex items-center space-x-4 backdrop-filter backdrop-blur-lg w-[120%] pr-64">
        <div className="flex items-center space-x-2">
          <Search className="text-blue-300" />
          <input
            type="text"
            name="agentName"
            value={filters.agentName}
            onChange={handleInputChange}
            placeholder="Agents"
            className="bg-transparent border border-blue-600 rounded-md p-2 text-gray-500 placeholder-blue-300 focus:outline-none focus:border-blue-400"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Search className="text-blue-300" />
          <input
            type="text"
            name="ownerName"
            value={filters.ownerName}
            onChange={handleInputChange}
            placeholder="Owners"
            className="bg-transparent border border-blue-600 rounded-md p-2 text-gray-500 placeholder-blue-300 focus:outline-none focus:border-blue-400"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Bed className="text-blue-300" />
          <select
            name="bedrooms"
            value={filters.bedrooms}
            onChange={handleInputChange}
            className="bg-transparent border border-blue-600 rounded-md p-2 text-gray-500 focus:outline-none focus:border-blue-400"
          >
            <option value="">Beds</option>
            {[0, 1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <Bath className="text-blue-300" />
          <select
            name="bathrooms"
            value={filters.bathrooms}
            onChange={handleInputChange}
            className="bg-transparent border border-blue-600 rounded-md p-2 text-gray-500 focus:outline-none focus:border-blue-400"
          >
            <option value="">Baths</option>
            {[0, 1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <Home className="text-blue-300" />
          <select
            name="unitType"
            value={filters.unitType}
            onChange={handleInputChange}
            className="bg-transparent border border-blue-600 rounded-md p-2 text-gray-500 focus:outline-none focus:border-blue-400"
          >
            <option value="">Unit Type</option>
            <option value="Apartment">Apartment</option>
            <option value="Villa">Villa</option>
            <option value="Short Term / Hotel Apartment">
              Short Term / Hotel Apartment
            </option>
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <ListChecks className="text-blue-300" />
          <select
            name="status"
            value={filters.status}
            onChange={handleInputChange}
            className="bg-transparent border border-blue-600 rounded-md p-2 text-gray-500 focus:outline-none focus:border-blue-400"
          >
            <option value="">Status</option>
            <option value="Published">Published</option>
            <option value="Pocketed">Pocketed</option>
          </select>
        </div>

        {/* <div className="relative">
          <button
            onClick={() => setShowPriceFilter(!showPriceFilter)}
            className="bg-transparent border border-blue-600 rounded-md p-2 text-gray-500 focus:outline-none focus:border-blue-400"
          >
            Price
          </button>
          {showPriceFilter && (
            <RangeFilter
              label="Price"
              fromValue={filters.priceFrom}
              toValue={filters.priceTo}
              onFromChange={(value) => setFilters({ ...filters, priceFrom: value })}
              onToChange={(value) => setFilters({ ...filters, priceTo: value })}
              onClose={() => setShowPriceFilter(false)}
            />
          )}
          {(filters.priceFrom || filters.priceTo) && (
            <div className="flex items-center mt-2">
              <span>Price: {filters.priceFrom || 'Any'} - {filters.priceTo || 'Any'}</span>
              <button onClick={clearPriceFilter} className="ml-2 text-red-500">
                x
              </button>
            </div>
          )}
        </div>
        <div className="relative">
          <button
            onClick={() => setShowSizeFilter(!showSizeFilter)}
            className="bg-transparent border border-blue-600 rounded-md p-2 text-gray-500 focus:outline-none focus:border-blue-400"
          >
            Size
          </button>
          {showSizeFilter && (
            <RangeFilter
              label="Size"
              fromValue={filters.sizeFrom}
              toValue={filters.sizeTo}
              onFromChange={(value) => setFilters({ ...filters, sizeFrom: value })}
              onToChange={(value) => setFilters({ ...filters, sizeTo: value })}
              onClose={() => setShowSizeFilter(false)}
            />
          )}
          {(filters.sizeFrom || filters.sizeTo) && (
            <div className="flex items-center mt-2">
              <span>Size: {filters.sizeFrom || 'Any'} - {filters.sizeTo || 'Any'}</span>
              <button onClick={clearSizeFilter} className="ml-2 text-red-500">
                x
              </button>
            </div>
          )}
        </div> */}

        <button
          type="button"
          onClick={handleFilterClick}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 text-xl rounded-md"
        >
          Filter
        </button>

        <button
          type="button"
          onClick={handleReset}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-5 text-xl rounded-md"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default FilterBar;