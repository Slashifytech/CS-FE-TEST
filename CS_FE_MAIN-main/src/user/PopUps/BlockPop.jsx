import React from "react";



const BlockPop = ({  blockUser,  closeblockPop }) => {
  

  return (
    <>
      <div className=" flex justify-center   items-center  z-30  popup-backdrop">
        <div className=" bg-white  py-9 md:px-20 px-5 rounded-md relative app-open-animation">
        
          <span className=" font-DMsans font-medium text-[16px] text-center">
            Are you sure want to block this profile?
          </span>
          <span className="flex items-center gap-6 justify-center mt-5">
            <span
              onClick={closeblockPop}
              className="border border-primary cursor-pointer text-primary px-9 py-2 rounded-md"
            >
              No
            </span>
            <span
              onClick={() => {
                blockUser();
               closeblockPop();
              }}
              className="bg-primary text-white px-9 cursor-pointer py-2 rounded-md"
            >
              Yes
            </span>
          </span>
        </div>
      </div>
    </>
  );
};

export default BlockPop;
