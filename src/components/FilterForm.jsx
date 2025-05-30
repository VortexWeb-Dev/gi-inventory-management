import React, { useEffect, useState, useRef } from "react";
import { RefreshCcw } from "lucide-react";
import AutocompleteSearch from "./SearchBar";
import SearchableSelect from "../utils/SearchableSelect";
import toast from "react-hot-toast";
import calculateRanges from "../utils/calculateRange";
import RangeFilter from "./RangeFilter";

const FilterBar = ({
  filteredData,
  setFilteredData,
  refresh,
  setRefresh,
  fullPriceRange,
  fullAreaRange,
}) => {
  const savedFilteredData = useRef(null);
  const hasRun = useRef(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [locationsArray, setLocationsArray] = useState(null);
  const [bedArray, setBedArray] = useState(["", 0, 1, 2, 3, 4, 5]);
  const [bathArray, setBathArray] = useState(["", 0, 1, 2, 3, 4, 5]);
  const [unitTypeArray, setUnitTypeArray] = useState([
    "",
    "Apartment",
    "Villa",
    "Short Term / Hotel Apartment",
  ]);
  const [statusArray, setStatusArray] = useState(["", "Published", "Pocketed"]);
  const [offeringArray, setOfferingArray] = useState(["", "Rent", "Sale"]);
  const [projectStatusArray, setProjectStatusArray] = useState([
    "",
    "Off Plan",
    "Off-Plan Primary",
    "Off-Plan Secondary",
    "Ready Primary",
    "Ready Secondary",
    "Completed",
  ]);
  const [ownerArray, setOwnerArray] = useState([""]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 0]);
  const [areaRange, setAreaRange] = useState([0, 0]);
  const [fromArea, setFromArea] = useState(areaRange[0]);
  const [fromPrice, setFromPrice] = useState(priceRange[0]);
  const [toArea, setToArea] = useState(areaRange[1]);
  const [toPrice, setToPrice] = useState(priceRange[1]);

  useEffect(() => {
    // Initialize saved data only once when filteredData is first populated
    if (hasRun.current || !filteredData || filteredData.length === 0) return;

    savedFilteredData.current = filteredData;
    hasRun.current = true;
    // Extract locations for AutocompleteSearch after saving initial data
    // Ensure item.locationBayut exists before mapping

    const locationMap = new Map();

    savedFilteredData.current.forEach((item) => {
      const { locationPf, locationBayut } = item || {};

      const processLocation = (loc) => {
        if (!loc) return;

        const trimmed = loc.trim();
        const parts = trimmed.split(" - ").map((p) => p.trim());

        // Add individual parts
        parts.forEach((part) => {
          const key = part.toLowerCase();
          if (!locationMap.has(key)) {
            locationMap.set(key, part); // store original casing
          }
        });

        // Add full location
        const fullKey = trimmed.toLowerCase();
        if (!locationMap.has(fullKey)) {
          locationMap.set(fullKey, trimmed);
        }
      };

      if (
        locationPf &&
        locationBayut &&
        locationPf.trim() === locationBayut.trim()
      ) {
        processLocation(locationPf);
      } else {
        [locationPf, locationBayut].forEach(processLocation);
      }
    });

    setLocationsArray([...locationMap.values()]);

    // setLocationsArray([...new Set(allLocations)]);

    setBedArray(
      [
        ...new Set(
          savedFilteredData.current
            .map((item) => item?.bedrooms)
            .filter(Boolean)
        ),
      ].sort((a, b) => a - b)
    );
    setBathArray(
      [
        ...new Set(
          savedFilteredData.current
            .map((item) => item?.bathrooms)
            .filter(Boolean)
        ),
      ].sort((a, b) => a - b)
    );

    setOwnerArray([
      "",
      ...new Set(savedFilteredData.current.map((item) => item?.ownerName)),
    ]);

    setUnitTypeArray([
      ...new Set(
        savedFilteredData.current.map((item) => item?.unitType).filter(Boolean)
      ),
    ]);
    setStatusArray([
      ...new Set(
        savedFilteredData.current.map((item) => item?.status).filter(Boolean)
      ),
    ]);
    setOfferingArray([
      ...new Set(
        savedFilteredData.current
          .map((item) => item?.offeringType)
          .filter(Boolean)
      ),
    ]);
    // setProjectStatusArray([
    //   ...new Set(
    //     savedFilteredData.current.map((item) => item?.projectStatus)
    //   ),
    // ]);
  }, [filteredData]); // Depend only on filteredData

  useEffect(() => {
    if (savedFilteredData.current && savedFilteredData.current.length > 0) {
      const { priceRange: newPriceRange, areaRange: newAreaRange } =
        calculateRanges("saved filtered", savedFilteredData.current);

      setPriceRange(newPriceRange);
      setAreaRange(newAreaRange);

      // Initialize the to values to the maximum
      setToPrice(newPriceRange[1]);
      setToArea(newAreaRange[1]);

      // Initialize the from values to the minimum
      setFromPrice(newPriceRange[0]);
      setFromArea(newAreaRange[0]);
    }
  }, [savedFilteredData.current]);

  // State for filters - using original keys to avoid changing logic
  const [filters, setFilters] = useState({
    ownerName: "",
    bedrooms: "",
    bathrooms: "",
    unitType: "",
    status: "",
    offeringType: "",
    projectStatus: "",
  });

  // Handle input changes for both text and select
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  // Apply filters
  const handleFilterClick = () => {
    if (!savedFilteredData.current) return; // Guard clause if initial data isn't set

    const newFilteredData = savedFilteredData.current.filter((item) => {
      // Check location search term first
      const locationMatch =
        item?.locationBayut?.toLowerCase().includes(searchTerm.toLowerCase()) ??
        true; // Assume true if locationBayut is missing

      // Check other filters
      const filterMatch = Object.entries(filters).every(([key, value]) => {
        if (value !== "" && value !== null) {
          // Ensure item[key] exists and handle potential type mismatches
          const itemValue = item?.[key];
          if (itemValue === undefined || itemValue === null) return false; // If field doesn't exist on item, it doesn't match
          return itemValue
            .toString()
            .toLowerCase()
            .includes(value.toString().toLowerCase());
        }
        return true; // If filter value is empty, it's a match
      });

      // Check price range filter
      const itemPrice = parseFloat(String(item?.price).replace(/,/g, ""));
      const priceMatch =
        (fromPrice === "" || isNaN(fromPrice) || itemPrice >= fromPrice) &&
        (toPrice === "" || isNaN(toPrice) || itemPrice <= toPrice);

      // Check area range filter
      const itemArea = parseFloat(item?.size);
      const areaMatch =
        (fromArea === "" || isNaN(fromArea) || itemArea >= fromArea) &&
        (toArea === "" || isNaN(toArea) || itemArea <= toArea);

      return locationMatch && filterMatch && priceMatch && areaMatch;
    });

    setFilteredData(newFilteredData);
  };

  // Reset all filters and search term
  const handleReset = () => {
    setFilters({
      ownerName: "",
      bedrooms: "",
      bathrooms: "",
      unitType: "",
      status: "",
      offeringType: "",
      projectStatus: "",
    });
    setSearchTerm(""); // Reset search term as well

    // Reset range filters to min and max values
    setFromPrice(fullPriceRange[0]);
    setToPrice(fullPriceRange[1]);
    setFromArea(fullAreaRange[0]);
    setToArea(fullAreaRange[1]);

    if (savedFilteredData.current) {
      setFilteredData(savedFilteredData.current); // Reset to original data
    }
  };

  const handleRefresh = () => {
    setRefresh((prev) => prev + 1);
    setIsSpinning(true);
    setFilters({
      ownerName: "",
      bedrooms: "",
      bathrooms: "",
      unitType: "",
      status: "",
      offeringType: "",
      projectStatus: "",
    });
    setSearchTerm("");

    toast.success("Refreshed successfully!");

    setTimeout(() => {
      setIsSpinning(false);
    }, 1000);
  };

  // Get input style based on whether filter is applied
  const getInputStyle = (filterName) => {
    const isApplied = filters[filterName] !== "";
    return isApplied
      ? "w-full h-11 border border-blue-500 bg-blue-100 rounded-md p-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
      : "w-full h-11 border border-gray-300 rounded-md p-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500";
  };

  // Filter definitions (matching the state keys)
  const selectFilters = [
    { name: "bedrooms", label: "Bed", options: bedArray },
    { name: "bathrooms", label: "Bath", options: bathArray },
    { name: "unitType", label: "Unit Type (Default)", options: unitTypeArray },
    { name: "status", label: "Status (Default)", options: statusArray },
    {
      name: "offeringType",
      label: "Offering Type (Default)",
      options: offeringArray,
    },
    {
      name: "projectStatus",
      label: "Project Status (Default)",
      options: projectStatusArray,
    },
  ];

  return (
    // Outer container for the whole bar
    <div className="w-full px-4 py-2 space-y-4">
      {/* Row 1: Search Bar (Already handles its own styling) */}
      <AutocompleteSearch
        locations={locationsArray}
        savedProperty={savedFilteredData.current}
        setProperty={setFilteredData}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {/* Range Filters */}

      <div className="md:flex p-4 sm:p-6 w-full max-w-full mx-auto bg-white rounded-xl shadow-md">
        <RangeFilter
          range={areaRange}
          interval={5}
          fromValue={fromArea}
          setFromValue={setFromArea}
          toValue={toArea}
          setToValue={setToArea}
          label={"Area"}
          unit={"sqft."}
          fullRange={fullAreaRange}
          refresh={refresh}
        />
        <RangeFilter
          range={priceRange}
          interval={100000}
          fromValue={fromPrice}
          setFromValue={setFromPrice}
          toValue={toPrice}
          setToValue={setToPrice}
          label={"Price"}
          unit={"AED"}
          fullRange={fullPriceRange}
          refresh={refresh}
        />
      </div>

      {/* Container for Filters and Buttons */}
      {/* Using flex-col on mobile and flex-row on desktop */}
      <div className="bg-white bg-opacity-90 rounded-lg shadow p-4 w-full max-w-[85%] mx-auto flex flex-col md:flex-row md:items-center md:gap-3">
        {/* Filters Container - Uses grid for mobile layout */}
        {/* Grid cols-6 allows 3 items (col-span-2) then 2 items (col-span-3) */}
        {/* On desktop (md:), becomes part of the parent flex row */}
        <div className="grid grid-cols-6 gap-3 md:flex md:flex-row md:flex-wrap md:gap-3 md:flex-grow">
          {/* Listing Owner (Now a Select Dropdown) */}

          <div className="col-span-6 sm:col-span-2 w-[25%]">
            <SearchableSelect
              name="ownerName"
              value={filters.ownerName}
              onChange={handleInputChange}
              placeholder="Listing Owner"
              options={ownerArray.filter(Boolean)}
            />
          </div>

          {/* Bed (Dropdown) */}
          {/* Mobile: Takes 1/3 width */}
          <div className="col-span-3 sm:col-span-2">
            <select
              name={selectFilters[0].name}
              value={filters[selectFilters[0].name]}
              onChange={handleInputChange}
              className={
                getInputStyle(selectFilters[0].name) +
                " bg-white appearance-none"
              }
            >
              <option value="">{selectFilters[0].label}</option>{" "}
              {/* Placeholder */}
              {selectFilters[0].options.map((option) =>
                // Render placeholder differently if needed, or skip empty string option text
                option === "" ? null : (
                  <option key={option} value={option}>
                    {option == 0 ? "Studio" : option}
                  </option>
                )
              )}
            </select>
          </div>

          {/* Bath (Dropdown) */}
          {/* Mobile: Takes 1/3 width */}
          <div className="col-span-3 sm:col-span-2">
            <select
              name={selectFilters[1].name}
              value={filters[selectFilters[1].name]}
              onChange={handleInputChange}
              className={
                getInputStyle(selectFilters[1].name) +
                " bg-white appearance-none"
              }
            >
              <option value="">{selectFilters[1].label}</option>{" "}
              {/* Placeholder */}
              {selectFilters[1].options.map((option) =>
                option === "" ? null : (
                  <option key={option} value={option}>
                    {option}
                  </option>
                )
              )}
            </select>
          </div>

          {/* Unit Type (Dropdown) */}
          {/* Mobile: Takes 1/2 width */}
          <div className="col-span-3">
            <select
              name={selectFilters[2].name}
              value={filters[selectFilters[2].name]}
              onChange={handleInputChange}
              className={
                getInputStyle(selectFilters[2].name) +
                " bg-white appearance-none"
              }
            >
              <option value="">{selectFilters[2].label}</option>{" "}
              {/* Placeholder */}
              {selectFilters[2].options.map((option) =>
                option === "" ? null : (
                  <option key={option} value={option}>
                    {option}
                  </option>
                )
              )}
            </select>
          </div>

          {/* Status (Dropdown) */}
          {/* Mobile: Takes 1/2 width */}
          <div className="col-span-3">
            <select
              name={selectFilters[3].name}
              value={filters[selectFilters[3].name]}
              onChange={handleInputChange}
              className={
                getInputStyle(selectFilters[3].name) +
                " bg-white appearance-none"
              }
            >
              <option value="">{selectFilters[3].label}</option>{" "}
              {/* Placeholder */}
              {selectFilters[3].options.map((option) =>
                option === "" ? null : (
                  <option key={option} value={option}>
                    {option}
                  </option>
                )
              )}
            </select>
          </div>

          {/* Offering Type (Dropdown) */}
          {/* Mobile: Takes 1/2 width */}
          <div className="col-span-3">
            <select
              name={selectFilters[4].name}
              value={filters[selectFilters[4].name]}
              onChange={handleInputChange}
              className={
                getInputStyle(selectFilters[4].name) +
                " bg-white appearance-none"
              }
            >
              <option value="">{selectFilters[4].label}</option>{" "}
              {/* Placeholder */}
              {selectFilters[4].options.map((option) =>
                option === "" ? null : (
                  <option key={option} value={option}>
                    {option}
                  </option>
                )
              )}
            </select>
          </div>

          {/* Project Status (Dropdown) */}
          {/* Mobile: Takes 1/2 width */}
          <div className="col-span-3">
            <select
              name={selectFilters[5].name}
              value={filters[selectFilters[5].name]}
              onChange={handleInputChange}
              className={
                getInputStyle(selectFilters[5].name) +
                " bg-white appearance-none"
              }
            >
              <option value="">{selectFilters[5].label}</option>{" "}
              {/* Placeholder */}
              {selectFilters[5].options.map((option) =>
                option === "" ? null : (
                  <option key={option} value={option}>
                    {option}
                  </option>
                )
              )}
            </select>
          </div>
        </div>

        {/* Buttons Container */}
        {/* Mobile: Takes full width, centered buttons, margin top */}
        {/* Desktop: Aligns with filters in the flex row */}
        <div className="mt-4 md:mt-0 flex flex-row justify-center md:justify-start gap-3 flex-shrink-0">
          <button
            type="button"
            onClick={handleRefresh}
            className="bg-[#2abd69] h-11 w-11 hover:bg-green-600 hover:cursor-pointer text-white font-semibold rounded-md flex items-center justify-center"
          >
            <RefreshCcw
              className={`h-5 w-5 ${isSpinning ? "animate-spin" : ""}`}
              style={{ animationDuration: isSpinning ? "1s" : "0s" }}
            />
          </button>
          <button
            type="button"
            onClick={handleFilterClick}
            className="bg-[#1c6638] h-11 hover:bg-[#0C372A] hover:cursor-pointer text-white font-semibold py-2 px-5 text-sm rounded-md" // Adjusted Find button style
          >
            Search
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="bg-gray-300 h-11 hover:bg-gray-400 hover:cursor-pointer text-gray-800 font-semibold py-2 px-5 text-sm rounded-md" // Adjusted Reset button style
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
