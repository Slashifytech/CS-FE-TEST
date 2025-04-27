import React from "react";
import { IoClose } from "react-icons/io5";

const ImagePopup = ({ imageUrl, altText, isModalOpen, closeModal }) => {
  return (
    <div>
      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50"
          onClick={closeModal}
        >
          <div
            className="relative p-4 bg-white rounded shadow-lg md:max-w-[40%] sm:max-w-[80%] max-w-[90%] app-open-animation"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              className="absolute top-2 right-2 text-white bg-black hover:bg-opacity-80 rounded-full px-2 py-2"
              onClick={closeModal}
            >
              <IoClose />
            </button>

            {/* Large Image */}
            <img
              src={imageUrl}
              alt={altText || "Image View"}
              className="rounded w-full"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImagePopup;
