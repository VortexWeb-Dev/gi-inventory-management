import React, { useState } from "react";
import {
  BedDouble,
  MapPin,
  Phone,
  MessageCircle,
  Dot,
  ChevronLeft,
  ChevronRight,
  Bath,
  BedSingle,
} from "lucide-react";
import PropertyBrochureGenerator from "./PropertyBrochureGenerator";

const PropertyCard = ({ property }) => {
  const [mainImageIndex, setMainImageIndex] = useState(0);

  const handlePrevImage = () => {
    setMainImageIndex((prevIndex) =>
      prevIndex === 0 ? property.images.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    setMainImageIndex((prevIndex) =>
      prevIndex === property.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="md:flex bg-white rounded-lg shadow-md overflow-hidden my-4 w-[100%]">
      {/* Image Section - Full width and more square on mobile, 42% width on desktop */}
      <div className="w-full h-54 md:h-80 md:h-auto md:w-[42%] relative">
        {property.images[mainImageIndex]?.url ? (
          <img
            src={property.images[mainImageIndex].url}
            alt={property.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-54 md:h-80 bg-blue-100 flex items-center justify-center">
            <span className="text-blue-800 text-xl">NO IMAGE AVAILABLE</span>
          </div>
        )}
        {property.unitType && (
  <div className="absolute top-2 right-2 bg-white text-black text-xs font-semibold px-2 py-1 rounded shadow">
    {property.offeringType}
  </div>
)}


        {property.images.length > 1 && (
          <>
            <div className="absolute inset-0 flex items-center justify-between px-2">
              <button
                onClick={handlePrevImage}
                className="bg-gray-200 bg-opacity-50 rounded-full cursor-pointer hover:opacity-100"
              >
                <ChevronLeft className="h-8 w-8 rounded-full hover:bg-gray-300" />
              </button>
              <button
                onClick={handleNextImage}
                className="bg-gray-200 bg-opacity-50 rounded-full cursor-pointer hover:opacity-100"
              >
                <ChevronRight className="h-8 w-8 rounded-full hover:bg-gray-300" />
              </button>
            </div>
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
              {mainImageIndex + 1}/{property.images.length}
            </div>
          </>
        )}
      </div>

      {/* Content Section - Full width on mobile, 58% on desktop */}
      <div className="w-full md:w-[58%] p-4 relative flex flex-col justify-between">
        <div>
          <div className="flex items-center mb-2">
            <span className="text-md md:text-xl font-semibold mr-2">
              AED {property.price}
            </span>
          </div>

          {/* Status indicator */}
          {property.status === "Published" ? (
            <div className="absolute top-2 right-2 text-green-800 text-xs font-semibold px-1 py-1 rounded">
              <Dot className="w-10 h-10 inline-block text-green-600" />
              PUBLISHED
            </div>
          ) : (
            <div className="absolute top-2 right-2 text-red-800 text-xs font-semibold px-1 rounded">
              <Dot className="w-10 h-10 inline-block text-red-600" />
              POCKETED
            </div>
          )}

          <div className="text-left">
            {/* Property details with responsive wrapping */}
            <div className="flex flex-wrap items-center text-sm text-gray-600 mb-2">
            
              <span className="mr-3 mb-1">{property.unitType}</span>

            { 
            !property.unitType.toLowerCase().includes("residen") &&
              <>
              {property.bedrooms && (
                <span className="mr-3 mb-1 flex items-center">
                  <span className="flex items-center">
                    {property.bedrooms == 0 ? (
                      <>
                        <BedSingle className="w-5 h-5 mr-1" />
                        Studio
                      </>
                    ) : (
                      <>
                        <BedDouble className="w-5 h-5 mr-1" />
                        {property.bedrooms} Bedroom
                        {property.bedrooms > 1 ? "s" : ""}
                      </>
                    )}
                  </span>
                </span>
              )}
              {property.bathrooms && (
                <span className="mr-3 mb-1 flex items-center">
                  <Bath className="w-5 h-5 mr-1" />
                  {property.bathrooms} Bathrooms
                </span>
              )}

              </>
              }
              <span className="mb-1">Area: {property.size} sqft</span>
            </div>
            <p className="text-md text-[#1c783f] mb-2">{property.title}</p>
            <p className="text-md text-gray-800 mb-2">Status: {" "}{property.projectStatus ? property.projectStatus : "N/A"}</p>
            <p className="text-sm text-gray-700">
              <MapPin className="h-4 w-4 mr-1 inline-block align-middle" />
              PF: {property.locationPf}
              <br />
              <MapPin className="h-4 w-4 mr-1 inline-block align-middle" />
              Bayut: {property.locationBayut}
            </p>
            <div className="mt-4">
              <PropertyBrochureGenerator listing={property} />
            </div>
          </div>
        </div>

        {/* Contact and owner info */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-4 gap-3">
          <div>
            <div className="flex items-center">
              <div className="text-sm">Listing Owner: &nbsp;</div>

              <a
                href={property.ownerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-[#1c783f] underline "
              >
                {property.ownerName}
              </a>
            </div>
          </div>

          <div className="flex space-x-2">
            <a
              href={`tel:${property.ownerPhone}`}
              className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm flex items-center"
            >
              Call
              <Phone className="h-4 w-4 ml-2 text-blue-600" />
            </a>
            <a
              href={`https://wa.me/${property.ownerPhone}`}
              className="bg-gray-100 px-3 py-1 rounded-full text-gray-700 text-sm flex items-center"
            >
              Whatsapp
              <MessageCircle className="h-4 w-4 ml-2 text-green-600" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
