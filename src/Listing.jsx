import React, { useState, useEffect } from "react";
import InventoryCard from "./components/InventoryCard";
import Searchbar from "./components/SearchBar";
import Pagination from "./Pagination";
import fetchAllData from "./utils/fetchAllData";
import FilterForm from "./components/FilterForm";

const Listing = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [propertiesData, setPropertiesData] = useState([]);
  const [filteredData, setFilteredData] = useState(propertiesData);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [error, setError] = useState(null);

  const totalItems = filteredData.length;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFilteredData = filteredData.slice(
    indexOfFirstItem,
    indexOfLastItem
  );


  useEffect(() => {
    const fetchData = async () => {
      try {
      const allData = await fetchAllData();
      setPropertiesData(allData);
      // console.log(allData);
      }catch(err){
        setError(err)
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // console.log("Updated propertiesData:", propertiesData);
  }, [propertiesData]);

  useEffect(() => {
    propertiesData &&
      setFilteredData(
        propertiesData.filter(
          (property) =>
            property.locationPf
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            property.locationBayut
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
        )
      );
  }, [searchTerm, propertiesData]);

  return (
    <>
    
      <div className="mx-auto">
        <FilterForm filteredData={filteredData} setFilteredData={setFilteredData} />
        {propertiesData && (propertiesData.length > 0)? (
          <div>
            <div className="w-full flex justify-center py-4">
           
            </div>
            <div className="max-w-5xl mx-auto px-1 md:px-4">
              <div className="bg-gray-50/50 rounded-xl p-1 backdrop-blur-sm">
                <div className="space-y-4">
                  {currentFilteredData.length > 0 ? (
                    currentFilteredData.map((property, index) => (
                      <InventoryCard key={index} property={property} />
                    ))
                  ) : (
                    <p className="text-center text-gray-500">
                      No properties found with selected filters/search.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-2xl md:text-4xl text-gray-500 font-semibold">Loading...</p>
        )}
      </div>

      <Pagination
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalItems={totalItems}
      />
    </>
  );
};

export default Listing;
