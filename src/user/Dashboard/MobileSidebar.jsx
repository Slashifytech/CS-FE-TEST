import React, { useEffect, useState, useCallback, memo } from "react";
import { defaultImage } from "../../assets/index"; // Assuming 'logo' is not used
import { Link, useNavigate } from "react-router-dom";
import { BsFillGrid1X2Fill } from "react-icons/bs";
import { LuCopyPlus } from "react-icons/lu";
import { VscSettingsGear } from "react-icons/vsc";
import { GiSelfLove } from "react-icons/gi";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { HiMiniDocumentMagnifyingGlass, HiPencilSquare } from "react-icons/hi2";
import { IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { logout, userDataStore } from "../../Stores/slices/AuthSlice";
import LogoutPop from "../PopUps/LogoutPop";
import { MdOutlinePrivacyTip, MdOutlineSupportAgent } from "react-icons/md";

const MobileSidebar = memo(({ isPopupOpen, closePopup, updateBrowserId }) => {
  const { userData, userId } = useSelector(userDataStore);
  const [response, setResponse] = useState(null);
  const [isLogoutOpen, setisLogoutOpen] = useState(false);
  const [sidebarData, setSidebarData] = useState([]);
  const [isOpen, setIsOpen] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const path = window.location.pathname;
      const routeString = localStorage.getItem('enString')

  const openLogoutPopup = useCallback(() => {
    setisLogoutOpen(true);
  }, []);

  const closeLogout = useCallback(() => {
    setisLogoutOpen(false);
  }, []);

  useEffect(() => {
    const formData = userData?.basicDetails;
    const selfDetails = userData?.selfDetails;
    const perosnalData = userData?.additionalDetails;
    const educationData = userData?.careerDetails;
    const additionalDetails = userData?.familyDetails;
    setSidebarData([
      formData,
      perosnalData,
      educationData,
      additionalDetails,
      selfDetails,
    ]);
    setResponse(formData?.userId);
  }, [userData]);

  return (
    <>
      <LogoutPop
        Connecting_Soulmate_Server
        nodemon
        isLogoutOpen={isLogoutOpen}
        closeLogout={closeLogout}
        updateBrowserId={updateBrowserId}
      />
      {isPopupOpen && (
        <div
          className={`fixed inset-0 flex sidebar-anim z-50 pb-6 mb-6 font-poppins overflow-y-scroll scrollbar-hide ${
            isPopupOpen ? "block" : "hidden"
          }`}
        >
          <div className="w-1/2 relative">
            <button
              className="cursor-pointer text-[39px] left-36 sm:left-[38vh] mt-5 absolute text-primary"
              onClick={closePopup}
            >
              <IoClose />
            </button>
          </div>

          <div className="bg-[#FCFCFC] w-full rounded-l-3xl overflow-y-scroll">
            <span className="flex flex-col justify-center items-center mt-9">
              <img
                src={sidebarData[4]?.profilePictureUrl}
                className="text-[32px] w-20 h-20 mt-10 rounded-full border-2 border-white"
                alt="Profile"
                onError={(e) => (e.target.src = defaultImage)}
                loading="lazy"
              />

              <p className="text-center font-montserrat font-medium text-[20px] mt-3">
                {sidebarData[0]?.name?.replace("undefined", "")}
              </p>
              <p className="text-center font-medium">({response})</p>

              <ul className="flex flex-col mx-5 mt-7">
                <Link
                  className={`py-2 px-2 my-1 text-black rounded-xl cursor-pointer ${
                    path === `/user-dashboard/${routeString}` && "res-sidebar-active"
                  }`}
                  to={`/user-dashboard/${routeString}`}
                >
                  <li onClick={closePopup} className={`flex items-center`}>
                    <BsFillGrid1X2Fill size={22} />
                    <span className="px-3">Dashboard</span>
                  </li>
                </Link>
                <Link
                  className={`py-2 px-2 my-1 text-black rounded-xl cursor-pointer ${
                    path === "/profile" && "res-sidebar-active"
                  }`}
                  to="/profile"
                  state={{
                    resCheck: "resAllow",
                  }}
                >
                  <li onClick={closePopup} className={`flex items-center`}>
                    <HiPencilSquare size={22} />
                    <span className="px-3">My Profile</span>
                  </li>
                </Link>
                <Link
                  className={`py-2 px-2 my-1 text-black rounded-xl cursor-pointer ${
                    path === "/image-edit" && "res-sidebar-active"
                  }`}
                  to="/image-edit"
                >
                  <li onClick={closePopup} className={`flex items-center`}>
                    <LuCopyPlus size={27} />
                    <span className="px-3">My Photos</span>
                  </li>
                </Link>
                <Link
                  className={`py-2 px-2 my-1 text-black rounded-xl cursor-pointer ${
                    path === "/partner-edit" && "res-sidebar-active"
                  }`}
                  to="/partner-edit"
                >
                  <li onClick={closePopup} className={`flex items-center`}>
                    <GiSelfLove size={22} />
                    <span className="px-3">Partner Preference</span>
                  </li>
                </Link>
                <span className="flex items-center my-1 bg-transparent py-2 px-2 text-black rounded-xl cursor-pointer">
                  <VscSettingsGear size={25} />
                  <span
                    onClick={() => setIsOpen((prev) => !prev)}
                    className="flex items-center px-2"
                  >
                    Setting{" "}
                    {!isOpen ? (
                      <span className="ps-28">
                        <IoIosArrowDown />
                      </span>
                    ) : (
                      <span className="ps-28">
                        <IoIosArrowUp />
                      </span>
                    )}
                  </span>
                </span>
                {isOpen && (
                  <span className="ps-9 text-[13px]">
                    <Link to="/settings/contact-info">
                      {" "}
                      <li
                        onClick={closePopup}
                        className={`py-1 px-2 text-black rounded-lg cursor-pointer ${
                          path === "/settings/contact-info" &&
                          "res-sidebar-active"
                        }`}
                      >
                        Updated Contact Information
                      </li>
                    </Link>
                    <Link to="/settings/email-change">
                      {" "}
                      <li
                        onClick={closePopup}
                        className={`mt-2 py-1 px-2 text-black rounded-lg cursor-pointer ${
                          path === "/settings/email-change" &&
                          "res-sidebar-active"
                        }`}
                      >
                        Change Registered Email
                      </li>
                    </Link>
                    <Link to="/settings/email">
                      {" "}
                      <li
                        onClick={closePopup}
                        className={`mt-2 py-1 px-2 text-black rounded-lg cursor-pointer ${
                          path === "/settings/email" && "res-sidebar-active"
                        }`}
                      >
                        Email Settings
                      </li>
                    </Link>
                    <Link to="/settings/notification-sub">
                      {" "}
                      <li
                        onClick={closePopup}
                        className={`mt-2 py-1 px-2 text-black rounded-lg cursor-pointer ${
                          path === "/settings/notification-sub" &&
                          "res-sidebar-active"
                        }`}
                      >
                        Notification Settings
                      </li>
                    </Link>
                    <Link to="/settings/block-profile">
                      {" "}
                      <li
                        onClick={closePopup}
                        className={`mt-2 py-1 px-2 text-black rounded-lg cursor-pointer ${
                          path === "/settings/block-profile" &&
                          "res-sidebar-active"
                        }`}
                      >
                        Blocked Profile
                      </li>
                    </Link>
                    <Link to="/settings/delete-profile">
                      {" "}
                      <li
                        onClick={closePopup}
                        className={`mt-2 py-1 px-2 text-black rounded-lg cursor-pointer ${
                          path === "/settings/delete-profile" &&
                          "res-sidebar-active"
                        }`}
                      >
                        Delete Profile
                      </li>
                    </Link>
                    <li
                      onClick={openLogoutPopup}
                      className="mt-2 py-1 px-2 text-black rounded-lg cursor-pointer"
                    >
                      Logout
                    </li>
                  </span>
                )}
                <Link
                  className={`py-2 px-2 my-1 text-black rounded-xl cursor-pointer ${
                    path === "/privacy" && "res-sidebar-active"
                  }`}
                  to="/privacy"
                >
                  <li onClick={closePopup} className={`flex items-center`}>
                    <MdOutlinePrivacyTip size={27} />
                    <span className="px-3">Privacy Policy</span>
                  </li>
                </Link>
                <Link
                  className={`py-2 px-2 my-1 text-black rounded-xl cursor-pointer ${
                    path === "/terms" && "res-sidebar-active"
                  }`}
                  to="/terms"
                >
                  <li onClick={closePopup} className={`flex items-center`}>
                    <HiMiniDocumentMagnifyingGlass size={27} />
                    <span className="px-3">Terms & Conditions</span>
                  </li>
                </Link>
                <Link
                  className={`py-2 px-2 my-1 text-black rounded-xl cursor-pointer ${
                    path === "/contact" && "res-sidebar-active"
                  }`}
                  to="/contact"
                >
                  <li onClick={closePopup} className={`flex items-center`}>
                    <MdOutlineSupportAgent size={27} />
                    <span className="px-3">Contact Us</span>
                  </li>
                </Link>
              </ul>
            </span>
          </div>
        </div>
      )}
    </>
  );
});

export default MobileSidebar;
