import React, { useCallback, useEffect, useMemo, useState } from "react";
import { TbEyeCheck, TbEyePlus } from "react-icons/tb";
import { IoBookmark, IoBookmarkOutline } from "react-icons/io5";
import { FaCheck, FaUserCheck } from "react-icons/fa";
import { MdBlock } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";

import apiurl, { capitalizeWord } from "../../util";
import { useDispatch, useSelector } from "react-redux";
import { userDataStore } from "../../Stores/slices/AuthSlice";
import { FaXmark } from "react-icons/fa6";

import BlockPop from "../PopUps/BlockPop";
import { toast } from "react-toastify";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { LuUserPlus } from "react-icons/lu";
import {
  getCountries,
  getMasterData,
  getStateById,
} from "../../common/commonFunction";
import { defaultImage } from "../../assets";
import { removeBlockConversation } from "../../Stores/slices/chatSlice";
import ImagePopup from "../PopUps/ImageView";
import SpamPopUp from "../PopUps/SpamPopUp";
import ThankYouPop from "../PopUps/ThankYouPop";
import { RiSpam2Line } from "react-icons/ri";
import { convertToFeetInches } from "../../common/common";

const OptionDetails = ({
  option,
  overAllDataId,
  isType,
  action,
  actionType,
  differentiationValue,
  isShortListedTo,
  isShortListedBy,
  isRequestTo,
  isRequestBy,
  setButtonClickFlag,
}) => {
  const { profession, diet, community, country, state } = useSelector(
    (state) => state.masterData
  );
  const { userId } = useSelector(userDataStore);
  const [isShortlisted, setIsShortListed] = useState(
    differentiationValue === "By" ? isShortListedBy : isShortListedTo
  );
  const [requestSent, setRequestSent] = useState(
    differentiationValue === "By" ? isRequestBy : isRequestTo
  );
  const location = useLocation();
  const [isOpenPop, setIsOpenPop] = useState(false);
  const [showProf, setShowProf] = useState(false);
  const [showCommunity, setShowCommunity] = useState(false);
  const [isMarital, setMarital] = useState(false);
  const [showProfileName, setShowProfileName] = useState(false);
  const [showInterestName, setShowInterestName] = useState(false);
  const [profileMessage, setProfileMessage] = useState({});
  const [interestMessage, setInterestMessage] = useState({});
  const [showCountry, setShowCountry] = useState(false);
  const dispatch = useDispatch();
  const handleMouseEnter = useCallback((setter) => () => setter(true), []);
  const handleMouseLeave = useCallback((setter) => () => setter(false), []);
  const [isModalOpen, setModalOpen] = useState(false);
  const [openSpamPopUp, setOpenSpamPopUp] = useState(false);
  const [openThankYouPop, setThankYouPop] = useState(false);
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);
  const handleOpenPopup = () => {
    setIsOpenPop(true);
  };
  const closeblockPop = () => {
    setIsOpenPop(false);
  };

  const handleOpenSpam = () => {
    setOpenSpamPopUp(true);
  };

  const closeThankyouPop = () => {
    setThankYouPop(false);
  };
  const closeSpam = () => {
    setOpenSpamPopUp(false);
  };
  const handleSpamData = async (reportType, reviewText) => {
    try {
      const response = await apiurl.post("/report-users", {
        reportType: "user",
        reportedBy: userId,
        reportedOne: option?._id,
        reasonForReporting: reportType,
        description: reviewText,
      });

      toast.success("User reported successfully");
      setOpenSpamPopUp(false);
      setThankYouPop(true);
      return;
    } catch (err) {
      toast.error("Something went wrong");
      console.log(err);
    }
  };
  const blockUser = async () => {
    try {
      if (userId) {
        await apiurl.post("/block-user", {
          blockBy: userId,
          blockUserId: option?._id,
        });
        setButtonClickFlag(true);
        dispatch({ type: "ON_CHAT_PAGE" });
        dispatch(removeBlockConversation(option?._id));
        toast.success("User blocked");
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error("Error blocking user:", error);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      const response = await apiurl.put(
        `/api/${isType}-request/accept/${requestId}?${isType}RequestToId=${userId}`
      );
      setButtonClickFlag(true);
      toast.success(response?.data?.responseMsg);
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  const sendProfileRequest = async () => {
    try {
      if (userId) {
        const response = await apiurl.post("/api/profile-request/send", {
          profileRequestBy: userId,
          profileRequestTo: option?._id,
        });
        setRequestSent(true);
        setButtonClickFlag(true);
        setProfileMessage(response.data);
        toast.success(response.data);
      } else {
        toast.error("Somethimg went wrong");
      }
    } catch (error) {
      toast.error(error.response.data);
      console.error("Error sending profile request:", error);
    }
  };

  const sendIntrestRequest = async () => {
    try {
      if (userId) {
        const response = await apiurl.post("/api/interest-request/send", {
          interestRequestBy: userId,
          interestRequestTo: option?._id,
        });
        setRequestSent(true);
        setButtonClickFlag(true);
        setInterestMessage(response.data);
        toast.success(response.data);
      }
    } catch (error) {
      toast.error(error.response.data);
      console.error("Error sending interest request:", error);
    }
  };

  const Shortlisted = async () => {
    if (userId && option) {
      try {
        const response = await apiurl.post(`/shortlist/add`, {
          user: userId,
          shortlistedUserId: option?._id,
        });

        toast.success(response.data.message);
        const matchRequest = response.data;
        setIsShortListed(!isShortlisted);
        return matchRequest;
      } catch (error) {
        console.error("Error sending match request:", error);
        throw error;
      }
    }
  };

  const handleDeclineRequest = async (requestId) => {
    try {
      const response = await apiurl.put(
        `/api/${isType}-request/decline/${requestId}?${isType}RequestToId=${userId}`
      );
      setButtonClickFlag(true);
      toast.error(response.data.message || "Request Declined");
    } catch (error) {
      toast.error(response.data.message);
      console.error("Error declining request:", error);
    }
  };

  const handleCancelRequest = async (requestId) => {
    try {
      await apiurl.put(
        `/api/${isType}-request/cancel/${requestId}?${isType}RequestById=${userId}`
      );
      setButtonClickFlag(true);
      toast.success("Request cancelled");
    } catch (error) {
      toast.error("Somethimg went wrong");
      console.error("Error declining request:", error);
    }
  };

  useEffect(() => {
    setIsShortListed(
      differentiationValue === "By" ? isShortListedBy : isShortListedTo
    );
    setRequestSent(differentiationValue === "By" ? isRequestBy : isRequestTo);
  }, [
    differentiationValue,
    isShortListedBy,
    isShortListedTo,
    isRequestBy,
    isRequestTo,
  ]);

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
      maritalStatusMapping[option?.additionalDetails[0]?.maritalStatus] || "NA",
    [maritalStatusMapping, option]
  );

  function formatTime(timeString) {
    if (!timeString) return "NA";

    const [time, period] = timeString.split(" ");
    const [hours, minutes] = time.split(":");

    let hour = parseInt(hours, 10);
    const minute = parseInt(minutes, 10);

    if (period === "PM" && hour !== 12) {
      hour += 12;
    } else if (period === "AM" && hour === 12) {
      hour = 0;
    }

    const formattedHour = hour % 12 || 12;
    const formattedMinutes = minute < 10 ? `0${minute}` : minute;

    return `${formattedHour}:${formattedMinutes} ${period}`;
  }

  // Usage example
  const timeOfBirth =
    option?.basicDetails[0]?.timeOfBirth?.replace("undefined", "") || "NA";
  const formattedTime = timeOfBirth !== "NA" ? formatTime(timeOfBirth) : "NA";
  const dateOfBirth = option?.basicDetails[0]?.dateOfBirth;
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
  useEffect(() => {}, [actionType, action]);
  return (
    <>
      {isOpenPop && (
        <span className="absolute">
          <BlockPop
            cardId={option._id}
            setIsOpen={setIsOpenPop}
            blockUser={blockUser}
            closeblockPop={closeblockPop}
          />
        </span>
      )}

      <div className="  mt-9 md:mt-0 sm:mt-0 sm:pr-6 mx-6   sm:mx-0 relative">
        <div className="shadow flex md:flex-row flex-col pb-5 md:pb-3 sm:mb-9 sm:flex-row md:w-[38rem] justify-center  md:py-3 sm:py-2  items-center px-3 rounded-2xl  sm:w-[97%] w-80  mb-6 ">
          <span>
            <img
              onClick={openModal}
              src={option?.selfDetails[0]?.profilePictureUrl || ""}
              alt=""
              onError={(e) => (e.target.src = defaultImage)}
              className="md:w-60 md:h-64 sm:w-60 sm:h-64 w-40 h-40  cursor-pointer md:rounded-lg sm:rounded-lg rounded-full mt-[12%] md:mt-0 sm:mt-0"
            />
          </span>
          <span
            onClick={() => handleOpenSpam()}
            className=" px-2 py-1 text-[25px] cursor-pointer rounded-md font-DMsans text-primary absolute md:right-6 sm:right-3  right-0 top-0 sm:top-0  md:top-0"
          >
            <RiSpam2Line />
          </span>
          <div className="mx-2">
            <span>
              <span>
                <p className="md:text-start mt-5  sm:text-start text-center  md:mb-0 sm:mb-0 px-6 w-72  text-[17px] font-semibold capitalize ">
                  {capitalizeWord(option?.basicDetails[0]?.name)}
                </p>
                <p
                  onMouseEnter={handleMouseEnter(setShowCountry)}
                  onMouseLeave={handleMouseLeave(setShowCountry)}
                  className=" cursor-pointer md:text-start  sm:text-start text-center mb-2 md:mb-0 sm:mb-0 px-6 w-72  text-[17px] font-semibold capitalize"
                >
                  {(state?.length > 0 &&
                    state?.filter(
                      (count) =>
                        count.state_id ===
                        option?.additionalDetails[0]?.currentlyLivingInState
                    )[0]?.state_name) ||
                    "NA"}
                  {", "}
                  {(country?.length > 0 &&
                    country
                      ?.filter(
                        (count) =>
                          count.country_id ===
                          option?.additionalDetails[0]?.currentlyLivingInCountry
                      )[0]
                      ?.country_name?.slice(0, 6)) ||
                    "NA"}
                </p>
                {showCountry && (
                  <div className="w-auto text-black bg-white  absolute px-3  rounded-lg ">
                    <p>
                      {" "}
                      {(state?.length > 0 &&
                        state?.filter(
                          (count) =>
                            count.state_id ===
                            option?.additionalDetails[0]?.currentlyLivingInState
                        )[0]?.state_name) ||
                        "NA"}
                      {", "}
                      {(country?.length > 0 &&
                        country?.filter(
                          (count) =>
                            count.country_id ==
                            option?.additionalDetails[0]
                              ?.currentlyLivingInCountry
                        )[0]?.country_name) ||
                        "NA"}
                    </p>
                  </div>
                )}
                <p className="md:text-start  sm:text-start text-center mb-5 md:mb-0 sm:mb-0 px-6 w-72  text-[17px] font-semibold capitalize">
                  {" "}
                  ({option?.basicDetails[0]?.userId})
                </p>
              </span>
              <div className="flex justify-center flex-col  items-center  ">
                <span className="flex justify-between  items-center gap-16 md:w-full w-80  pl-6 text-[16px] mt-2">
                  <span className="font-regular text-start w-1/2 ">
                    <p>
                      {option?.basicDetails[0]?.age}yrs{" ,"}
                      {convertToFeetInches(option?.additionalDetails[0]?.height) || "NA"}ft
                    </p>
                    <p>{formattedDateOfBirth}</p>

                    <p
                      className="cursor-pointer"
                      onMouseEnter={handleMouseEnter(setMarital)}
                      onMouseLeave={handleMouseLeave(setMarital)}
                    >
                      {transformedMaritalStatus?.slice(0, 8)}..
                    </p>
                    {isMarital && (
                      <div className="absolute   w-auto p-2 bg-white  rounded-lg  ">
                        <p> {transformedMaritalStatus}</p>
                      </div>
                    )}
                  </span>
                  <span className="font-regular text-start w-1/2">
                    <p
                      onMouseEnter={handleMouseEnter(setShowCommunity)}
                      onMouseLeave={handleMouseLeave(setShowCommunity)}
                      className="cursor-pointer"
                    >
                      {(community?.length > 0 &&
                        community
                          ?.filter(
                            (comm) =>
                              comm?.community_id ==
                              option?.familyDetails[0]?.community
                          )[0]
                          ?.community_name?.slice(0, 12)) ||
                        "NA"}
                      ..
                    </p>
                    {showCommunity && (
                      <div className="absolute   w-auto p-2 bg-white  rounded-lg ">
                        <p>
                          {" "}
                          {(community?.length > 0 &&
                            community?.filter(
                              (comm) =>
                                comm?.community_id ==
                                option?.familyDetails[0]?.community
                            )[0]?.community_name) ||
                            "NA"}
                        </p>
                      </div>
                    )}

                    <p>{formattedTime}</p>

                    <p
                      onMouseEnter={handleMouseEnter(setShowProf)}
                      onMouseLeave={handleMouseLeave(setShowProf)}
                      className="cursor-pointer"
                    >
                      {profession?.length > 0 &&
                        profession
                          ?.filter(
                            (prof) =>
                              prof.proffesion_id ==
                              option?.careerDetails[0]?.profession
                          )[0]
                          ?.proffesion_name?.slice(0, 10)}
                      ..
                    </p>
                    {showProf && (
                      <div className="absolute   w-auto p-2 bg-white  rounded-lg ">
                        <p>
                          {" "}
                          {profession?.length > 0 &&
                            profession?.filter(
                              (prof) =>
                                prof.proffesion_id ==
                                option?.careerDetails[0]?.profession
                            )[0]?.proffesion_name}
                        </p>
                      </div>
                    )}
                  </span>
                </span>
                {actionType === "accepted" && (
                  <div className="mt-2 flex flex-col  ml-2  ">
                    <span className="flex items-center justify-between w-64 cursor-pointer">
                      <Link
                        to="/profile"
                        state={{
                          userId: option?._id,
                          location: location.pathname,
                          isType: isType,
                        }}
                        className={`text-center  bg-primary ${
                          isType === "profile"
                            ? "md:w-[120px] w-[120px] sm:w-[119px]"
                            : "md:w-[249px] w-[249px] sm:w-[248px] py-2"
                        }  py-1 text-white rounded-md cursor-pointer`}
                      >
                        View Profile
                      </Link>
                      {isType === "profile" && (
                        <span
                          onClick={sendIntrestRequest}
                          onMouseEnter={handleMouseEnter(setShowInterestName)}
                          onMouseLeave={handleMouseLeave(setShowInterestName)}
                          className="bg-primary rounded-xl px-8 py-1 flex  items-center cursor-pointer text-white"
                        >
                          {interestMessage ===
                          "This person has already sent an Interest request to you" ? (
                            <LuUserPlus size={23} />
                          ) : isType === "profile" && requestSent ? (
                            <FaUserCheck size={23} />
                          ) : (
                            <LuUserPlus size={23} />
                          )}
                        </span>
                      )}
                      {showInterestName && (
                        <div className="text-start text-black absolute -mt-20 w-auto p-1 bg-white border  font-DMsans rounded-lg ">
                          <p> Interest Request</p>
                        </div>
                      )}
                    </span>
                    <span className="flex items-center justify-between cursor-pointer ">
                      <span
                        onClick={Shortlisted}
                        className="border border-primary text-primary rounded-xl px-7 py-[2px]  mt-2 flex items-center"
                      >
                        {isShortlisted ? (
                          <IoBookmark size={23} />
                        ) : (
                          <IoBookmarkOutline size={23} />
                        )}
                      </span>
                      <span
                        onClick={handleOpenPopup}
                        className="text-primary rounded-xl px-5 py-1 mt-2  flex items-center text-[26px]"
                      >
                        <MdBlock />
                      </span>
                    </span>
                  </div>
                )}

                {actionType === "pending" && action === "sent" && (
                  // Render buttons for sent requests
                  <div className="mt-2 flex flex-col  px-6 ">
                    <span
                      onClick={() => {
                        handleCancelRequest(overAllDataId);
                      }}
                      className="text-center bg-primary md:w-[17rem] w-[272px] sm:w-60  py-2 text-white rounded-md cursor-pointer"
                    >
                      Cancel Request
                    </span>
                    <span className="flex items-center justify-between cursor-pointer ">
                      <span
                        onClick={Shortlisted}
                        className="border border-primary text-primary rounded-xl px-7 py-[2px]  mt-2 flex items-center"
                      >
                        {isShortlisted ? (
                          <IoBookmark size={23} />
                        ) : (
                          <IoBookmarkOutline size={23} />
                        )}
                      </span>
                      <span
                        onClick={handleOpenPopup}
                        className="text-primary rounded-xl px-3 py-1 mt-2  flex items-center text-[26px]"
                      >
                        <MdBlock />
                      </span>
                    </span>
                  </div>
                )}
                {actionType === "pending" && action === "recieved" && (
                  // Render buttons for sent requests
                  <div className="mt-6 flex flex-row justify-between w-full   px-6 mb-2 ">
                    <span
                      onClick={() => handleDeclineRequest(overAllDataId)}
                      className="flex items-center border border-primary text-primary font-medium py-2 px-3  rounded-md cursor-pointer"
                    >
                      <FaXmark size={20} />
                      <span className="text-center  px-2">Decline</span>
                    </span>

                    <span
                      onClick={() => handleAcceptRequest(overAllDataId)}
                      className="flex items-center bg-primary text-white font-medium py-2 px-3 rounded-md cursor-pointer"
                    >
                      <FaCheck />
                      <span className="text-center  px-2">Accept</span>
                    </span>
                  </div>
                )}

                {actionType === "declined" && (
                  // Render buttons for declined requests
                  <div className="flex flex-row justify-between px-6 w-full  mt-5 text-center pb-5">
                    <span className="font-light">
                      <span
                        onClick={sendProfileRequest}
                        onMouseEnter={handleMouseEnter(setShowProfileName)}
                        onMouseLeave={handleMouseLeave(setShowProfileName)}
                        className="bg-primary rounded-xl px-8 py-1 flex  items-center cursor-pointer text-white"
                      >
                        {profileMessage ===
                        "This person has already sent an Profile request to you" ? (
                          <TbEyePlus size={23} />
                        ) : isType === "interest" && requestSent ? (
                          <TbEyeCheck size={23} />
                        ) : (
                          <TbEyePlus size={23} />
                        )}
                      </span>
                      {showProfileName && (
                        <div className="text-start text-black absolute -mt-16 w-auto p-1 bg-white border  font-DMsans rounded-lg ">
                          <p> Profile Request</p>
                        </div>
                      )}
                      <span
                        onClick={Shortlisted}
                        className="border border-primary text-primary ursor-pointer cursor-pointer rounded-xl px-8 py-1 mt-2  flex  items-center"
                      >
                        {isShortlisted ? (
                          <IoBookmark size={23} />
                        ) : (
                          <IoBookmarkOutline size={23} />
                        )}
                      </span>
                    </span>
                    <span className="font-light">
                      <span
                        onClick={sendIntrestRequest}
                        onMouseEnter={handleMouseEnter(setShowInterestName)}
                        onMouseLeave={handleMouseLeave(setShowInterestName)}
                        className="bg-primary rounded-xl px-8 py-1 flex  items-center cursor-pointer text-white"
                      >
                        {interestMessage ===
                        "This person has already sent an Interest request to you" ? (
                          <LuUserPlus size={23} />
                        ) : isType === "profile" && requestSent ? (
                          <FaUserCheck size={23} />
                        ) : (
                          <LuUserPlus size={23} />
                        )}
                      </span>
                      {showInterestName && (
                        <div className="text-start text-black absolute -mt-20 w-auto p-1 bg-white border  font-DMsans rounded-lg ">
                          <p> Interest Request</p>
                        </div>
                      )}
                      <span
                        onClick={handleOpenPopup}
                        className="border text-primary  cursor-pointer border-primary rounded-xl px-8 py-1 mt-2 flex items-center"
                      >
                        <MdBlock size={25} />
                      </span>
                    </span>
                  </div>
                )}
              </div>
            </span>
          </div>
        </div>
      </div>
      <ImagePopup
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        imageUrl={option?.selfDetails[0]?.profilePictureUrl}
      />

      <SpamPopUp
        handleFunc={handleSpamData}
        isOpen={openSpamPopUp}
        closePopUp={closeSpam}
      />

      <ThankYouPop
        isPopUp={openThankYouPop}
        PopUpClose={closeThankyouPop}
        heading={"Your Report has been is successfully recorded"}
        text1={
          "Thank you for reporting/Flagging this profile. We have recieved your request and we will notify within 24 hours. "
        }
      />
    </>
  );
};

export default OptionDetails;
