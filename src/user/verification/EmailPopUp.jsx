import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { userDataStore } from "../../Stores/slices/AuthSlice";

const EmailPopUp = ({ deleteData, isOpenPopUp, closeDelete }) => {
  const navigate = useNavigate();
  const { userData } = useSelector(userDataStore);
  const [deleteProfile, setDeleteProfile] = useState(false)


  useEffect(() =>{
      setDeleteProfile(userData?.isDeleted)
  },[userData])

  console.log(deleteProfile,"mak");
  const handleDelete = () => {
    deleteData();
    setDeleteProfile(true)
       localStorage.removeItem("authToken");
    toast.success("Profile deleted successfully");
    localStorage.removeItem('authToken')
  

     
    navigate("/deleted-account");
  };
  return (
    <>
      {isOpenPopUp && (
        <div
          className={`fixed inset-0 flex items-center justify-center popup-backdrop z-50  sm:px-52  px-6 ${
            isOpenPopUp ? "block" : "hidden"
          }`}
        >
          <div className="bg-white pb-9  rounded-lg md:w-[38%] w-full  relative p-9 app-open-animation ">
            <p className="text-center font-DMsans text-black font-semibold text-[16px]">
              Verify the Email Id
            </p>
            <div className="flex justify-center items-center font-DMsans gap-5 mt-5">
            <input type="text" />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EmailPopUp;
