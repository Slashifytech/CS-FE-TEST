import React, { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";


const ReportPopup = ({ isDeleteReportOpen, closeDeleteReport, handleReportUser, userId, closeDeleteReportbutton }) => {




  const {currentConversation} = useSelector(
    (state) => state.chat
  );
    const [reviewText, setReviewText] = useState();
    



     const  receiverId = currentConversation?._id
    const handleTextareaChange = (event) => {
        setReviewText(event.target.value);
      };
      const handleSubmit = () => {
        if (!reviewText.trim()) {
          toast.error("Please enter a reason for reporting the user.");
          return;
        }
        handleReportUser(userId, reviewText, receiverId);
        handleReset();
        closeDeleteReport();
      };

  const handleReset = () => {
    setReviewText('');
  };


  return (
    <>
    
      {isDeleteReportOpen && (
        <div
          className={`fixed inset-0 flex items-center justify-center popup-backdrop z-50  sm:px-52  px-6 ${
            isDeleteReportOpen ? "block" : "hidden"
          }`}
        >
          <div className="bg-white pb-9  rounded-lg md:w-[50%] w-full  relative p-9  ">
            <p className="text-center font-DMsans text-black font-semibold text-[16px] ">
            Please mention your reason to report the user ?
            </p>
            
            <textarea
                name=""
                placeholder="Enter the reason for report..."
                className="shadow mt-5 w-full px-2  py-2  "
                value={reviewText}
                onChange={handleTextareaChange}
              ></textarea>
            <div className="flex justify-center items-center font-DMsans gap-5 mt-5">
              <span
                onClick={closeDeleteReportbutton}
                className="px-8 py-2 cursor-pointer  rounded-lg text-primary border border-primary"
              >
                Cancel
              </span>
              <span
                onClick={() => {
                  handleSubmit()
                }}
                className="px-8 py-2 cursor-pointer rounded-lg text-white bg-primary"
              >
                Submit
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReportPopup