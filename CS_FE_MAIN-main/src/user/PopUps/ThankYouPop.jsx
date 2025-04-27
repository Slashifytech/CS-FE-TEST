import React from "react";
import { useNavigate } from "react-router-dom";
import { checkRed } from "../../assets";

const ThankYouPop = ({
  isPopUp,
  PopUpClose,

  heading,
  text1,

}) => {
 

  return (
    <>
      {isPopUp && (
        <div
          className={`fixed inset-0 flex items-center justify-center popup-backdrop z-50  sm:px-52  px-6 ${
            isPopUp ? "block" : "hidden"
          }`}
        >
          <div className="bg-white pb-9  rounded-lg md:w-[68%] w-full  relative p-9  flex flex-col items-center justify-center app-open-animation">
            <span>
              <img src={checkRed} alt="img" className="pt-6 w-44 pb-6" />
            </span>
            <span>
              <p className="font-bold  text-center   text-[25px]">{heading}</p>
              <p className="font-DMsans text-secondary font-light pt-3 text-[16px] text-center font-universal">
                {text1}
              </p>
             
            </span>

            <div className="flex justify-center items-center font-DMsans gap-5 mt-4">
              <div
                onClick={() => {
                  PopUpClose();
                }}
                className="px-8 py-2 cursor-pointer rounded-lg text-white bg-primary"
                
              >
               Okay
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ThankYouPop;
