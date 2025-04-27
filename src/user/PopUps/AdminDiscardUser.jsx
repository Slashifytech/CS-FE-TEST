


import React, { useState } from "react";

const AdminDiscardUserPop = ({isDiscardOpen, closeDiscard, handleDiscardUser}) => {
 


  return (
    <>
      {isDiscardOpen && (
        <div
          className={`fixed inset-0 flex items-center justify-center popup-backdrop z-50 sm:px-52 px-6 ${
            isDiscardOpen ? "block" : "hidden"
          }`}
        >
          <div className="bg-white pb-9 rounded-lg md:w-[58%] w-full relative p-9 app-open-animation">
            <span>
              <p className="font-semibold mb-3 text-center text-[22px]">Discard Profile</p>
              <p className="font-medium text-center">
              If you discard this user, then data of the user will be permanently deleted.

              </p>
             
              <div className="mt-6 m-2 flex justify-center gap-14 items-center ">
                <span
                  onClick={closeDiscard}
                  className="px-8 py-[6px] cursor-pointer rounded-lg text-primary border border-primary"
                >
                  No
                </span>
                <span
                onClick={handleDiscardUser}
                  className="bg-primary px-8 py-2 rounded-lg text-white cursor-pointer"
                >
                  Yes
                </span>
              </div>
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminDiscardUserPop;
