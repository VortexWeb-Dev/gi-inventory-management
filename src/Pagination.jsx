// import { useState, useEffect } from "react";

// const PAGE_SIZE = 10;  // Frontend page size
// const API_PAGE_SIZE = 50;  // Backend page size

// function Pagination({setPropertiesData}) {
//   const [apiData, setApiData] = useState([]); // Stores all fetched data
//   const [frontendPage, setFrontendPage] = useState(0); // Tracks current frontend page
//   const [backendPage, setBackendPage] = useState(1); // Tracks current backend page
//   const [hasMore, setHasMore] = useState(true); // Tracks if more data exists

//   useEffect(() => {
//     fetchData(1); // Fetch first backend page on mount
//   }, []);

//   const fetchData = async (page) => {
//     try {
//       const response = await fetch(`${import.meta.env.VITE_APP_GI_INVENTORY_API}${page}`);
//       const list = await response.json();
      
//       if (list.data.length === 0 || list.data.length < API_PAGE_SIZE) {
//         setHasMore(false); // No more data left
//       }
      
//       setApiData((prev) => [...prev, ...list.data]); // Append new items
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   const nextPage = () => {
//     const maxIndex = (frontendPage + 1) * PAGE_SIZE;
    
//     if (maxIndex >= apiData.length && hasMore) {
//       fetchData(backendPage + 1);
//       setBackendPage(backendPage + 1);
//     }

//     setFrontendPage((prev) => prev + 1);
//   };

//   const prevPage = () => {
//     if (frontendPage > 0) {
//       setFrontendPage((prev) => prev - 1);
//     }
//   };

//   // Get frontend slice to display
//   useEffect(()=>{
//       setPropertiesData(apiData.slice(frontendPage * PAGE_SIZE, (frontendPage + 1) * PAGE_SIZE));
//   },[])

//   return (
//     <div>
      
//       <button onClick={prevPage} disabled={frontendPage === 0}>Previous</button>
//       <button onClick={nextPage} disabled={!hasMore && (frontendPage + 1) * PAGE_SIZE >= apiData.length}>
//         Next
//       </button>
//     </div>
//   );
// }

// export default Pagination;


import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ itemsPerPage, setItemsPerPage, currentPage, setCurrentPage, totalItems }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    return (
        <div className="flex flex-wrap justify-between items-center bg-white p-3 rounded-4xl shadow-lg max-w-[80%] mx-auto">
            {/* Items per page selector */}
            <div className="flex items-center gap-2 px-2">
                <span className="text-gray-700 font-medium">Items per page:</span>
                <select 
                    value={itemsPerPage}
                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                    className="border border-gray-300 rounded px-3 py-1 focus:ring focus:ring-blue-300"
                >
                    {[5,10, 15, 20, 25, 30].map(value => (
                        <option key={value} value={value}>{value}</option>
                    ))}
                </select>
            </div>

            {/* Page navigation */}
            <div className="flex items-center gap-4">
                <span className="text-gray-700">
                    {currentPage * itemsPerPage - itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}
                </span>
                <div className="flex gap-2">
                    <button 
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition disabled:opacity-50"
                    >
                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <button 
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition disabled:opacity-50"
                    >
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Pagination