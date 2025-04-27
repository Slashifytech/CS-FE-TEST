import React, { useState } from "react";

const BanUserpopUp = ({ isBanOpen, closeBan, userBan, userId }) => {
  const [reviewText, setReviewText] = useState();

  const handleTextareaChange = (event) => {
    setReviewText(event.target.value);
  };

  return (
    <>
      {isBanOpen && (
        <div
          className={`fixed inset-0 flex items-center justify-center popup-backdrop z-50  sm:px-52  px-6 ${
            isBanOpen ? "block" : "hidden"
          }`}
        >
          <div className="bg-white pb-9  rounded-lg md:w-[58%] w-full  relative p-9  ">
            <span className="flex flex-col items-center justify-center">
              <p className="text-center font-DMsans text-black font-semibold text-[16px] ">
                Do you want to Ban this user ?
              </p>
<div className="mx-6">
              <textarea
                name=""
                placeholder="Enter the reason for ban..."
                className="shadow mt-5 md:w-96 sm:w-96 w-80 px-2  py-2  "
                value={reviewText}
                onChange={handleTextareaChange}
              ></textarea></div>
            </span>
            <div className="flex justify-center items-center font-DMsans gap-5 mt-5">
              <span
                onClick={closeBan}
                className="px-8 py-2 cursor-pointer  rounded-lg text-primary border border-primary"
              >
                No
              </span>
              <span
                onClick={() => {
                  userBan(userId, reviewText);
                  closeBan();
                }}
                className="px-8 py-2 cursor-pointer rounded-lg text-white bg-primary"
              >
                Yes
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BanUserpopUp;
