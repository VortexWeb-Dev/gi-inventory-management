import React, { useState } from "react";
import {
  BedDouble,
  MapPin,
  Phone,
  MessageCircle,
  Dot,
  ChevronLeft,
  ChevronRight,
  Bath
} from "lucide-react";

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
    <div className="flex bg-white rounded-lg shadow-md overflow-hidden m-4">
      {/* Image Section (42% width) */}
      <div className="w-[42%] relative">
        <img
          src={property.images[mainImageIndex]?.url}
          alt={property.title}
          className="w-[100%] h-[100%] object-cover"
        />

        {property.images.length > 1 && (
          <>
            <div className="absolute inset-0 flex items-center justify-between px-2">
              <button
                onClick={handlePrevImage}
                className="bg-gray-200 bg-opacity-50 rounded-full cursor-pointer  hover:opacity-100"
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

      {/* Content Section (58% width) */}
      <div className="w-[58%] p-4 relative flex flex-col justify-between">
        <div>
          <div className="flex items-center mb-2">
            <span className="text-xl font-semibold mr-2">
              AED {property.price}
            </span>
          </div>
          {property.status === "Published" ? (
            <div className="absolute top-2 right-2 text-green-800 text-xs font-semibold px-2 py-1 rounded">
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
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <span>{property.unitType}</span>
              {property.bedrooms && (
                <span className="ml-2 flex items-center">
                  <BedDouble className="w-5 h-5 mr-1" />
                  {property.bedrooms} Bedrooms
                </span>
              )}
              {property.bathrooms && (
                <span className="ml-2 flex items-center">
                  <Bath className="w-5 h-5 mr-1" />
                  {property.bathrooms} Bathrooms
                </span>
              )}
              <span className="ml-2">Area: {property.size} sqft</span>
            </div>
            <p className="text-sm text-blue-600 mb-2">{property.title}</p>
            <p className="text-sm text-gray-700">
              <MapPin className="h-4 w-4 mr-1 inline-block align-middle" />
              PF: {property.locationPf}
              <br />
              <MapPin className="h-4 w-4 mr-1 inline-block align-middle" />
              Bayut: {property.locationBayut}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div>
            <div className="flex items-center">
              <a
                href={property.ownerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-blue-600 underline"
              >
                Owner: {property.ownerName}
              </a>
            </div>
            <div className="flex items-center">
              Agent: {property.agentName}
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
