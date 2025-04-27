import React, { useState } from "react";
import { reportOption } from "../../DummyData/prof";

const SpamPopUp = ({ isOpen, closePopUp, handleFunc }) => {
  const [spamData, setSpamData] = useState({
    reportType: "",
    resonForReporting: "",
  });

  const handleInput = (e) => {
    const { name, value } = e.target;
    setSpamData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <>
      {isOpen && (
        <div
          className={`fixed inset-0 flex items-center justify-center popup-backdrop z-50 sm:px-52 px-6 ${
            isOpen ? "block" : "hidden"
          }`}
        >
          <div className="bg-white pb-9 rounded-lg md:w-[70%] w-full relative px-4 py-4 app-open-animation">
            <p className="px-6 pt-3 text-sidebar text-[19px] font-medium">
              Report User Profile
            </p>
            <p className="px-6 pb-6 text-body text-[13px] font-normal">
              Mention Your Issues
            </p>

            {/* Ticket Type Select */}
            <div className="flex flex-col w-full mx-6">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Reason for Reporting
              </label>
              <select
                name="reportType"
                value={spamData.reportType}
                onChange={handleInput}
                className="md:w-80 w-52 px-4 py-2 border border-gray-300 rounded-md outline-none "
              >
                <option>Choose Report Type</option>

                {reportOption.map((option) => (
                  <option key={option.reason} value={option.reason}>
                    {option.reason}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority Status Select */}

            {/* Description Textarea */}
            <div className="flex flex-col w-full mt-3 px-6">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                className="w-full outline-none rounded-md py-3 h-20 bg-input text-body px-3  bg-slate-50"
                placeholder="Description"
                name="resonForReporting"
                value={spamData.resonForReporting}
                onChange={handleInput}
              />
            </div>

            <div className="flex justify-end items-center font-DMsans gap-5 mt-5">
              <span
                onClick={closePopUp}
                className="px-8 py-2 cursor-pointer rounded-lg text-primary border border-primary"
              >
                Cancel
              </span>
              <span
                onClick={() => {
                  handleFunc(spamData.reportType, spamData.resonForReporting);
                  closePopUp();
                }}
                className="px-8 py-2 cursor-pointer rounded-lg text-white bg-primary"
              >
                Report 
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SpamPopUp;
