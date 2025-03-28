// import { useState, useEffect } from "react";
import axios from "axios";

const fetchAllData = async () => {
  let page = 1;
  let aggregateData = [];
  let total = Infinity;

  while (aggregateData.length < total) {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_GI_INVENTORY_API}${page}`
      );
      const { data, total: newTotal } = response.data;

      if (!Array.isArray(data) || typeof newTotal !== "number") {
        console.error("Unexpected response format", response.data);
        break;
      }

      aggregateData = [...aggregateData, ...data];
      total = newTotal;

      // console.log(aggregateData)
      if (aggregateData.length >= total) break;

      page++;
    } catch (error) {
      console.error("Error fetching data:", error);
      break;
    }
  }
  
  return aggregateData;
};

export default fetchAllData;

// const usePaginatedData = () => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const allData = await fetchAllData();
//         setData(allData);
//       } catch (err) {
//         setError(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   return { data, loading, error };
// };

// export default usePaginatedData;
