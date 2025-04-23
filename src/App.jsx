import "./App.css";
import Listing from "./Listing";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <BrowserRouter>
      <>
        {/* Header */}
        <div className="backdrop-blur-md rounded-xl p-2">
          <div className="container mx-auto flex-col  md:flex-row items-center justify-between px-2">
            {/* Logo */}
            <div className="mb-4 md:mb-0 mr-4">
              <img
                src="logo_name.png"
                alt="GI Inventory Logo"
                className="h-14 md:h-20 object-contain rounded shadow-sm hover:shadow-md transition-shadow duration-300"
              />
            </div>

            {/* Title */}
            <div className="flex flex-col items-center">
              <h1 className="text-xl md:text-3xl font-semibold text-blue-800 tracking-tight">
                <span className="text-[#104737]">GI Inventory Management</span>
              </h1>
              <div className="mt-3">
                <div className="w-60 h-1 bg-gradient-to-r from-green-300 to-[#0C372A] rounded-full"></div>
              </div>
            </div>

            {/* Empty div for balance */}
            <div className="hidden md:block w-20"></div>
          </div>
        </div>

        <Listing />
        <Toaster />
      </>
    </BrowserRouter>
  );
}

export default App;
