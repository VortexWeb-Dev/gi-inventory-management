import React, { useState, useEffect } from "react";
import InventoryCard from "./components/InventoryCard";
import Searchbar from "./components/SearchBar";

const Listing = ({ propertiesData }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState(propertiesData);

  useEffect(() => {
    setFilteredData(
      propertiesData.filter(property =>
        property.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, propertiesData]);

  return (
    <>
      <div className="w-full flex justify-center py-4">
        <Searchbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>
      <div className="max-w-5xl mx-auto p-6">
        <div className="bg-gray-50/50 rounded-xl p-6 backdrop-blur-sm">
          <div className="space-y-4">
            {filteredData.length > 0 ? (
              filteredData.map((property, index) => (
                <InventoryCard key={index} property={property} />
              ))
            ) : (
              <p className="text-center text-gray-500">No properties found</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Listing;
