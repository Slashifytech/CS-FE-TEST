import React from "react";
import { IoClose } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../Stores/slices/AuthSlice";

const LogoutPop = ({ isLogoutOpen, closeLogout}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };
  return (
    <>
      {isLogoutOpen && (
        <div
          className={`fixed inset-0 flex items-center justify-center popup-backdrop z-50  sm:px-52  px-6 ${
            isLogoutOpen ? "block" : "hidden"
          }`}
        >
          <div className="bg-white pb-9  rounded-lg md:w-[38%] w-full  relative p-9 app-open-animation ">
            <p className="text-center font-DMsans text-black font-semibold text-[16px]">
              Do you want to Logout your profile ?
            </p>
            <div className="flex justify-center items-center font-DMsans gap-5 mt-5">
              <span
                onClick={closeLogout}
                className="px-8 py-2 cursor-pointer  rounded-lg text-primary border border-primary"
              >
                No
              </span>
              <span
                onClick={() => {
                  handleLogout();
                  closeLogout();
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

export default LogoutPop;
