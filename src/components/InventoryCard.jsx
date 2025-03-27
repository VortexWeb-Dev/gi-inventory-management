import React, { useState } from 'react';
import { HeartIcon, BedDouble, MapPin, Phone, MessageCircle, Dot, Sparkle } from 'lucide-react';

const PropertyCard = ({ property }) => {
  const [mainImage, setMainImage] = useState(property.images[0]);

  return (
    <div className="max-w-full mx-auto bg-white rounded-2xl shadow-md overflow-hidden flex">
      {/* Image Section (42% width) */}
      <div className="w-[42%] relative">
        <img src={mainImage} alt="Property" className="w-full h-full object-cover" />
        {property.checked && (
          <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded">
            ✔ Checked
          </div>
        )}

        <div className="absolute bottom-2 left-2 flex space-x-1">
          {property.images.slice(0, 4).map((img, index) => (
            <div
              key={index}
              className={`w-8 h-8 rounded-sm overflow-hidden border cursor-pointer ${mainImage === img ? 'border-blue-500' : ''}`}
              onClick={() => setMainImage(img)}
            >
              <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover cursor-pointer" />
            </div>
          ))}
        </div>
        <button className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-md">
          <HeartIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Content Section (58% width) */}
      <div className="w-[58%] p-4 relative">
        <div className="flex items-center mb-2">
          <span className="text-xl font-semibold mr-2">{property.price}</span>
          <span className="text-sm text-gray-500">{property.frequency}</span>
        </div>
        {property.status === "published" ? (
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
            <span>{property.type}</span>
            {property.studio && (
              <span className="ml-2 flex items-center">
                <BedDouble className="w-5 h-5 mr-1" />
                Studio
              </span>
            )}
            <span className="ml-2">Area: {property.area}</span>
          </div>
          <p className="text-sm text-blue-600 mb-2">{property.description}</p>
          <p className="text-sm text-gray-700 mb-2 flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            {property.location}
          </p>
          <p className="text-xs text-gray-500 mb-4 bg-gray-100 w-fit rounded-lg p-1 flex item-center">
          <Sparkle className="h-5 w-5 pr-2" />
            Property authenticity was validated on {property.verifiedDate}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img src={property.agent.imageUrl} alt="Agent" className="w-8 h-8 rounded-full mr-2" />
            <span className="text-sm font-semibold">{property.agent.name}</span>
          </div>
          <div className="flex space-x-2">
            <button className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm flex items-center">
              Call
              <Phone className="h-4 w-4 ml-2 text-blue-600" />
            </button>
            <button className="bg-gray-100 px-3 py-1 rounded-full text-gray-700 text-sm flex items-center">
              Whatsapp
              <MessageCircle className="h-4 w-4 ml-2 text-green-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;