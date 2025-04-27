import React from "react";


const   DeleteChatPopup = ({ isDeleteChatOpen, isLastMessage, closeDeleteChat, handleDeleteMessage, ischatData, isUserType, }) => {



  return (
    <>
    
      {isDeleteChatOpen && (
        <div
          className={`fixed inset-0 flex items-center justify-center popup-backdrop z-50  sm:px-52  px-6 ${
            isDeleteChatOpen ? "block" : "hidden"
          }`}
        >
          <div className="bg-white pb-9  rounded-lg md:w-[50%] w-full  relative p-9  ">
            <p className="text-center font-DMsans text-black font-semibold text-[16px] ">
           {isUserType === "sender" && isLastMessage? " Do you want to delete this message for everyone ? " : "Do you want to delete this message for yourself ?"}
            </p>
            <div className="flex justify-center items-center font-DMsans gap-5 mt-5">
              <span
                onClick={closeDeleteChat}
                className="px-8 py-2 cursor-pointer  rounded-lg text-primary border border-primary"
              >
                No
              </span>
              <span
                onClick={() => {
                  handleDeleteMessage(ischatData, isUserType)
                  closeDeleteChat();
                
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

export default DeleteChatPopup;
