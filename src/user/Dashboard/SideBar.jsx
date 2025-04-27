import React, { useState, useMemo, useCallback, Suspense } from "react";
import { Link, useLocation } from "react-router-dom";
import { BsFillGrid1X2Fill } from "react-icons/bs";
import { LuCopyPlus } from "react-icons/lu";
import { VscSettingsGear } from "react-icons/vsc";
import { GiSelfLove } from "react-icons/gi";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { HiMiniDocumentMagnifyingGlass, HiPencilSquare } from "react-icons/hi2";
import { useSelector } from "react-redux";
import { userDataStore } from "../../Stores/slices/AuthSlice";
import LogoutPop from "../PopUps/LogoutPop";
import { defaultImage } from "../../assets";
import apiurl, { capitalizeWord } from "../../util";
import { MdOutlinePrivacyTip, MdOutlineSupportAgent } from "react-icons/md";
import ImagePopup from "../PopUps/ImageView";

const SideBar = ({ updateBrowserId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showProf, setShowProf] = useState(false);
  const [isLogoutOpen, setisLogoutOpen] = useState(false);
  const [showCommunity, setShowCommunity] = useState(false);
  const { userData } = useSelector(userDataStore);
  const [isModalOpen, setModalOpen] = useState(false);
  const path = window.location.pathname;
  const openModal = () => setModalOpen(true);

  const closeModal = () => setModalOpen(false);
  const maritalStatusMapping = useMemo(
    () => ({
      single: "Single",
      awaitingdivorce: "Awaiting Divorce",
      divorcee: "Divorcee",
      widoworwidower: "Widow or Widower",
    }),
    []
  );

  const transformedMaritalStatus = useMemo(
    () =>
      maritalStatusMapping[userData?.additionalDetails?.maritalStatus] || "NA",
    [maritalStatusMapping, userData]
  );

  const dateOfBirth = userData?.basicDetails?.dateOfBirth;

  const formattedDateOfBirth = useMemo(() => {
    if (!dateOfBirth) return "NA";

    // Regular expression to check if dateOfBirth is in DD-MM-YYYY format
    const isDDMMYYYY = /^\d{2}-\d{2}-\d{4}$/.test(dateOfBirth);

    if (isDDMMYYYY) {
      // If it's already in DD-MM-YYYY format, return it as is
      return dateOfBirth;
    }

    // Otherwise, assume it's in YYYY-MM-DD format and reformat it to DD-MM-YYYY
    const [year, month, day] = dateOfBirth.split("-");
    return `${day}-${month}-${year}`;
  }, [dateOfBirth]);

  const handleMouseEnter = useCallback((setter) => () => setter(true), []);
  const handleMouseLeave = useCallback((setter) => () => setter(false), []);

  const openLogoutPopup = useCallback(() => setisLogoutOpen(true), []);
  const closeLogout = useCallback(() => setisLogoutOpen(false), []);

  return (
    <>
      <>
        <LogoutPop
          isLogoutOpen={isLogoutOpen}
          closeLogout={closeLogout}
          updateBrowserId={updateBrowserId}
        />
        <div
          className={`md:px-6 px-6 text-white hidden md:block sm:block fixed mt-20 sm:mt-28 md:mt-20`}
        >
          <div
            className={`bg-primary w-[90%] md:w-[18rem] mt-5 md:mt-12 rounded-2xl md:h-[80vh] sm:[40vh] overflow-y-scroll scrollbar-hide md:pb-36 sm:pb-9`}
          >
            <div className="flex justify-center items-center relative ">
              <span className="bg-green-500 rounded-full w-[13px] h-[13px] absolute md:left-[170px] sm:left-[152px] mt-20"></span>
              <img
                onClick={openModal}
                src={userData?.selfDetails?.profilePictureUrl}
                loading="lazy"
                className="text-[32px] w-20 h-20 mt-10 rounded-full border-2 border-white cursor-pointer"
                alt="Profile"
                onError={(e) => (e.target.src = defaultImage)}
              />
            </div>
            <>
              <p className="text-center font-montserrat font-light mt-3 w-64  mx-4">
                {capitalizeWord(userData?.basicDetails?.name) || "NA"}
              </p>
              <p className="text-center font-extralight">
                {userData?.additionalDetails?.stateatype || "NA"},{" "}
                {userData?.additionalDetails?.countryatype || "NA"}
              </p>
              <p className="text-center font-light">({userData?.userId})</p>
              <span className="flex items-start justify-between px-5 mt-3 text-start">
                <span className="font-light">
                  <p>
                    {userData?.basicDetails?.age
                      ? `${userData?.basicDetails?.age}yrs`
                      : "NA"}
                    ,{" "}
                    {userData?.additionalDetails?.height
                      ? `${userData?.additionalDetails?.height}ft`
                      : "NA"}
                  </p>
                  <p>{formattedDateOfBirth}</p>
                  <p>{transformedMaritalStatus}</p>
                </span>
                <span className="font-light text-start">
                  <p
                    className="cursor-pointer"
                    onMouseEnter={handleMouseEnter(setShowCommunity)}
                    onMouseLeave={handleMouseLeave(setShowCommunity)}
                  >
                    {userData?.familyDetails?.communityftype?.slice(0, 12) ||
                      "NA"}
                    ..
                  </p>
                  {showCommunity && (
                    <p className="absolute text-white w-20 p-2 bg-primary rounded-lg">
                      {userData?.familyDetails?.communityftype || "NA"}
                    </p>
                  )}
                  <p>{userData?.basicDetails?.timeOfBirth || "NA"}</p>
                  <p
                    onMouseEnter={handleMouseEnter(setShowProf)}
                    onMouseLeave={handleMouseLeave(setShowProf)}
                    className="cursor-pointer"
                  >
                    {userData?.careerDetails?.professionctype?.slice(0, 10) ||
                      "NA"}
                    ..
                  </p>
                  {showProf && (
                    <p className="absolute text-white w-24 p-2  bg-primary rounded-lg">
                      {userData?.careerDetails?.professionctype || "NA"}
                    </p>
                  )}
                </span>
              </span>
              <ul className="flex flex-col mx-5 mt-5">
                <Link
                  className={`py-2 px-2 hover:bg-white hover:text-primary rounded-xl cursor-pointer ${
                    path === "/user-dashboard" && "sidebar-active"
                  }`}
                  to="/user-dashboard"
                >
                  <li className={`flex items-center`}>
                    <span className="text-[23px]">
                      <BsFillGrid1X2Fill />
                    </span>
                    <span className="px-3">Dashboard</span>
                  </li>
                </Link>
                <Link
                  className={`py-2 mt-2 px-2 hover:bg-white hover:text-primary rounded-xl cursor-pointer`}
                  to="/profile"
                  state={{
                    resCheck: "resAllow",
                  }}
                >
                  <li className={`flex items-center`}>
                    <span className="text-[23px]">
                      <HiPencilSquare />
                    </span>
                    <span className="px-4">My Profile</span>
                  </li>
                </Link>
                <Link
                  className="py-2 px-2 mt-2 hover:bg-white hover:text-primary rounded-xl cursor-pointer"
                  to="/image-edit"
                >
                  <li className={`flex items-center`}>
                    <span className="text-[25px]">
                      <LuCopyPlus />
                    </span>
                    <span className="px-4">My Photos</span>
                  </li>
                </Link>
                <Link
                  className="py-2 px-2 mt-2 hover:bg-white hover:text-primary rounded-xl cursor-pointer"
                  to="/partner-edit"
                >
                  <li className={`flex items-center`}>
                    <span className="text-[25px]">
                      <GiSelfLove />
                    </span>
                    <span className="px-4">Partner Preference</span>
                  </li>
                </Link>
                <span className="flex items-center mt-2 bg-transparent py-2 px-2 relative  hover:bg-white hover:text-primary rounded-xl cursor-pointer">
                  <span className="text-[23px]">
                    <VscSettingsGear />
                  </span>
                  <span
                    onClick={() => setIsOpen((prev) => !prev)}
                    className="flex  items-center pl-[18px]  "
                  >
                    Setting{" "}
                    {isOpen ? (
                      <IoIosArrowUp className="  text-[18px] absolute right-6" />
                    ) : (
                      <IoIosArrowDown className="absolute right-6 " />
                    )}
                  </span>
                </span>
                {isOpen && (
                  <span className="md:ps-10 sm:ps-5 sm:mt-2 text-[14px]">
                    <Link to="/settings/contact-info">
                      <li
                        className={`py-1 px-2 mb-2 hover:bg-white hover:text-primary rounded-lg cursor-pointer ${
                          path === "/settings/contact-info" && "sidebar-active"
                        }`}
                      >
                        Updated Contact Information
                      </li>
                    </Link>
                    <Link to="/settings/phonenumber">
                      <li
                        className={`mt-2 py-1 px-2 hover:bg-white hover:text-primary rounded-lg cursor-pointer ${
                          path === "/settings/phonenumber" && "sidebar-active"
                        }`}
                      >
                        Change Registered Number
                      </li>
                    </Link>
                    <Link to="/settings/email">
                      <li
                        className={`mt-2 py-1 px-2 hover:bg-white hover:text-primary rounded-lg cursor-pointer ${
                          path === "/settings/email" && "sidebar-active"
                        }`}
                      >
                        Email Settings
                      </li>
                    </Link>
                    <Link to="/settings/notification-sub">
                      <li
                        className={`mt-2 py-1 px-2 hover:bg-white hover:text-primary rounded-lg cursor-pointer ${
                          path === "/settings/notification-sub" &&
                          "sidebar-active"
                        }`}
                      >
                        Notification Settings
                      </li>
                    </Link>
                    <Link to="/settings/block-profile">
                      <li
                        className={`mt-2 mb-2 py-1 px-2 hover:bg-white hover:text-primary rounded-lg cursor-pointer ${
                          path === "/settings/block-profile" && "sidebar-active"
                        }`}
                      >
                        Blocked Profiles
                      </li>
                    </Link>
                    <Link to="/settings/delete-profile">
                      <li
                        className={`mt-2 mb-2 py-1 px-2 hover:bg-white hover:text-primary rounded-lg cursor-pointer ${
                          path === "/settings/delete-profile" &&
                          "sidebar-active"
                        }`}
                      >
                        Delete Profile
                      </li>
                    </Link>

                    <Link>
                      <li
                        onClick={openLogoutPopup}
                        className={`mt-2 mb-2 py-1 px-2 hover:bg-white hover:text-primary rounded-lg cursor-pointer`}
                      >
                        Logout
                      </li>
                    </Link>
                  </span>
                )}
                <Link
                  className="py-2 px-2 mt-2 hover:bg-white hover:text-primary rounded-xl cursor-pointer"
                  to="/privacy"
                >
                  <li className={`flex items-center`}>
                    <span className="text-[25px]">
                      <MdOutlinePrivacyTip />
                    </span>
                    <span className="px-4">Privacy Policy</span>
                  </li>
                </Link>
                <Link
                  className="py-2 px-2 mt-2 hover:bg-white hover:text-primary rounded-xl cursor-pointer"
                  to="/terms"
                >
                  <li className={`flex items-center`}>
                    <span className="text-[25px]">
                      <HiMiniDocumentMagnifyingGlass />
                    </span>
                    <span className="px-4">Terms & Conditions</span>
                  </li>
                </Link>
                <Link
                  className="py-2 px-2 mt-2 hover:bg-white hover:text-primary rounded-xl cursor-pointer"
                  to="/contact"
                >
                  <li className={`flex items-center`}>
                    <span className="text-[25px]">
                      <MdOutlineSupportAgent />
                    </span>
                    <span className="px-4">Contact Us</span>
                  </li>
                </Link>
              </ul>
            </>
          </div>
        </div>

        <Suspense fallback={<div>Loading...</div>}>
          <ResponsiveDetails />
        </Suspense>
      </>
      <ImagePopup
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        imageUrl={userData?.selfDetails?.profilePictureUrl}
      />
    </>
  );
};

const ResponsiveDetails = () => {
  const { userData } = useSelector(userDataStore);
  const [showProf, setShowProf] = useState(false);
  const [isLogoutOpen, setisLogoutOpen] = useState(false);
  const [showCommunity, setShowCommunity] = useState(false);
  const [showCountry, setShowCountry] = useState(false);
  const handleMouseEnter = useCallback((setter) => () => setter(true), []);
  const handleMouseLeave = useCallback((setter) => () => setter(false), []);
  const [isModalOpen, setModalOpen] = useState(false);
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);
  const maritalStatusMapping = useMemo(
    () => ({
      single: "Single",
      awaitingdivorce: "Awaiting Divorce",
      divorcee: "Divorcee",
      widoworwidower: "Widow or Widower",
    }),
    []
  );

  const transformedMaritalStatus = useMemo(
    () =>
      maritalStatusMapping[userData?.additionalDetails?.maritalStatus] || "NA",
    [maritalStatusMapping, userData]
  );

  const dateOfBirth = userData?.basicDetails?.dateOfBirth;

  const formattedDateOfBirth = useMemo(() => {
    if (!dateOfBirth) return "NA";
    const [year, month, day] = dateOfBirth.split("-");
    return `${day}-${month}-${year}`;
  }, [dateOfBirth]);

  return (
    <>
      <div className="px-6 w-screen">
        <div className="bg-primary mt-2 py-3 rounded-lg md:hidden sm:hidden ss:hidden xl:hidden mobile-shadow">
          <span className="flex items-center justify-center gap-6">
            <div className="flex justify-center items-center  relative">
              <span className="bg-green-500 rounded-full w-[10px] h-[10px] absolute left-[70px] mt-9"></span>
              <img
                onClick={openModal}
                src={userData?.selfDetails?.profilePictureUrl}
                loading="lazy"
                className=" w-20 h-20 rounded-full border-2 border-white"
                alt="Profile"
                onError={(e) => (e.target.src = defaultImage)}
              />
            </div>
            <span className="text-white">
              <p className="text-center font-montserrat font-medium mt-3 w-44 text-[18px]">
                {capitalizeWord(userData?.basicDetails?.name) || "NA"}
              </p>
              <p
                onMouseEnter={handleMouseEnter(setShowCountry)}
                onMouseLeave={handleMouseLeave(setShowCountry)}
                className="text-center font-montserrat cursor-pointer test-[16px]"
              >
                {userData?.additionalDetails?.stateatype || "NA"} ,
                {userData?.additionalDetails?.countryatype?.slice(0, 7) || "NA"}
                ..
              </p>
              {showCountry && (
                <div className="w-auto text-white bg-primary absolute px-3 rounded-lg">
                  <p>
                    {userData?.additionalDetails?.stateatype || "NA"}{" "}
                    {userData?.additionalDetails?.countryatype || "NA"}
                  </p>
                </div>
              )}
              <p className="text-center font-medium text-[16px]">
                ({userData?.userId})
              </p>
            </span>
          </span>
          <span className="flex items-start justify-evenly text-white mt-3 gap-3 leading-8">
            <span className="font-light text-start">
              <p>
                {userData?.basicDetails?.age
                  ? userData?.basicDetails?.age + "yrs"
                  : "NA"}
                {", "}{" "}
                {userData?.additionalDetails?.height
                  ? userData?.additionalDetails?.height + "ft"
                  : "NA"}
              </p>
              <p> {formattedDateOfBirth || "NA"}</p>
              <p>{transformedMaritalStatus}</p>
            </span>
            <span className="font-light text-start">
              <p>{userData?.basicDetails?.timeOfBirth || "NA"}</p>
              <p
                className="cursor-pointer"
                onMouseEnter={handleMouseEnter(setShowCommunity)}
                onMouseLeave={handleMouseLeave(setShowCommunity)}
              >
                {userData?.familyDetails?.communityftype
                  ? userData?.familyDetails?.communityftype?.slice(0, 12)
                  : "NA"}
                ..
              </p>
              {showCommunity && (
                <p className="absolute text-white w-20 p-2  bg-primary rounded-lg">
                  {userData?.familyDetails?.communityftype || "NA"}
                </p>
              )}
              <p
                onMouseEnter={handleMouseEnter(setShowProf)}
                onMouseLeave={handleMouseLeave(setShowProf)}
                className="cursor-pointer"
              >
                {userData?.careerDetails?.professionctype?.slice(0, 10) || "NA"}
                ..
              </p>
              {showProf && (
                <div className="w-auto text-white bg-primary absolute rounded-lg p-1">
                  <p>{userData?.careerDetails?.professionctype || "NA"}</p>
                </div>
              )}
            </span>
          </span>
        </div>
      </div>
      <ImagePopup
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        imageUrl={userData?.selfDetails?.profilePictureUrl}
      />
    </>
  );
};
export default SideBar;
