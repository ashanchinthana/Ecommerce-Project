import React, { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline';

const ProductImageGallery = ({ images, alt }) => {
  const [selectedImage, setSelectedImage] = useState(0);

  // Handle case with no images
  if (!images || images.length === 0) {
    return (
      <div className="h-96 w-full bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
        <span className="text-gray-500 dark:text-gray-400">No image available</span>
      </div>
    );
  }

  // Navigate to previous image
  const prevImage = () => {
    setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  // Navigate to next image
  const nextImage = () => {
    setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div>
      {/* Main image display */}
      <div className="relative h-96 overflow-hidden rounded-lg mb-4">
        <img
          src={images[selectedImage]}
          alt={`${alt} - ${selectedImage + 1}`}
          className="w-full h-full object-cover object-center"
        />
        
        {/* Navigation arrows (only if there's more than one image) */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 rounded-full p-2 hover:bg-white dark:hover:bg-gray-800 focus:outline-none"
              aria-label="Previous image"
            >
              <ChevronLeftIcon className="h-5 w-5 text-gray-800 dark:text-gray-200" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 rounded-full p-2 hover:bg-white dark:hover:bg-gray-800 focus:outline-none"
              aria-label="Next image"
            >
              <ChevronRightIcon className="h-5 w-5 text-gray-800 dark:text-gray-200" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail strip (only if there's more than one image) */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`rounded-md overflow-hidden h-24 ${
                selectedImage === index ? 'ring-2 ring-primary-500' : ''
              }`}
            >
              <img
                src={image}
                alt={`${alt} thumbnail ${index + 1}`}
                className="w-full h-full object-cover object-center"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;