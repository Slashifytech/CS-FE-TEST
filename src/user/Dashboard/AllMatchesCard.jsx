import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userDataStore } from "../../Stores/slices/AuthSlice";
import { TbEyeCheck, TbEyePlus } from "react-icons/tb";
import { MdBlock } from "react-icons/md";
import { FaUserCheck } from "react-icons/fa";
import { IoBookmark, IoBookmarkOutline } from "react-icons/io5";
import apiurl, { capitalizeWord } from "../../util";
import { LuUserPlus } from "react-icons/lu";
import BlockPop from "../PopUps/BlockPop";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { defaultImage } from "../../assets";
import ImagePopup from "../PopUps/ImageView";
import ThankYouPop from "../PopUps/ThankYouPop";
import SpamPopUp from "../PopUps/SpamPopUp";
import { RiSpam2Line } from "react-icons/ri";
import { convertToFeetInches } from "../../common/common";

const AllMatchesCard = ({ profileDetails, setIsBlockedUser }) => {
  const { userId } = useSelector(userDataStore);
  const [profileRequestSent, setProfileRequestSent] = useState(
    profileDetails?.isProfileRequest || false
  );
  const [interstRequestSent, setInterestRequestSent] = useState(
    profileDetails?.isInterestRequest || false
  );
  const [isShortlisted, setIsShortListed] = useState(
    profileDetails?.isShortlisted || false
  );
  const [isOpenPop, setIsOpenPop] = useState(false);
  const [showProf, setShowProf] = useState(false);
  const [showCommunity, setShowCommunity] = useState(false);
  const [showProfileName, setShowProfileName] = useState(false);
  const [showInterestName, setShowInterestName] = useState(false);
  const [profileMessage, setProfileMessage] = useState({});
  const [interestMessage, setInterestMessage] = useState({});
  const [isMarital, setMarital] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const handleMouseEnter = useCallback((setter) => () => setter(true), []);
  const handleMouseLeave = useCallback((setter) => () => setter(false), []);
  const [openSpamPopUp, setOpenSpamPopUp] = useState(false);
  const [openThankYouPop, setThankYouPop] = useState(false);
  const dispatch = useDispatch();
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
        reportedOne: profileDetails?._id,
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
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);
  const ShortlistedData = async () => {
    if (userId && profileDetails) {
      try {
        const response = await apiurl.post(`/shortlist/add`, {
          user: userId,
          shortlistedUserId: profileDetails?._id,
        });

        if (response.status === 200) {
          const matchRequest = response.data;
          toast.info(response.data.message);
          setIsShortListed(!isShortlisted);
          return matchRequest;
        } else {
          toast.info(response.data.message);
          setIsShortListed(!isShortlisted);
          throw new Error("Failed to send match request");
        }
      } catch (error) {
        console.error("Error sending match request:", error);
        throw error;
      }
    }
  };
  const handleOpenPopup = () => {
    setIsOpenPop(true);
  };
  const closeblockPop = () => {
    setIsOpenPop(false);
  };
  const sendProfileRequest = async () => {
    try {
      if (userId) {
        const response = await apiurl.post("/api/profile-request/send", {
          profileRequestBy: userId,
          profileRequestTo: profileDetails?._id,
        });
        setProfileMessage(response.data);

        toast.success(
          response.data === "Profile request updated to pending" ||
            response.data ===
              "You have sent the Profile request from your declined section"
            ? "Profile request sent successfully"
            : response.data
        );
        setProfileRequestSent(true);
      } else {
      }
    } catch (error) {
      toast.error(error.response.data);
    }
  };
  const blockUser = async () => {
    try {
      if (userId) {
        await apiurl.post("/block-user", {
          blockBy: userId,
          blockUserId: profileDetails?._id,
        });
        setIsBlockedUser(true);
        dispatch({ type: "ON_CHAT_PAGE" });
        dispatch(removeBlockConversation(profileDetails?._id));
        toast.success("User blocked");
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error("Error blocking user:", error);
    }
  };
  const sendIntrestRequest = async () => {
    try {
      if (userId) {
        const response = await apiurl.post("/api/interest-request/send", {
          interestRequestBy: userId,
          interestRequestTo: profileDetails?._id,
        });
        setInterestMessage(response.data);

        toast.success(
          response.data === "Interest request updated to pending" ||
            response.data ===
              "You have sent the Interest request from your declined section"
            ? "Interest request sent successfully"
            : response.data
        );
        setInterestRequestSent(true);
      } else {
        toast.error("something went wrong");
      }
    } catch (error) {
      toast.error(error.response.data);
      console.error("Error sending interest request:", error);
    }
  };
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
      maritalStatusMapping[
        profileDetails?.additionalDetails[0]?.maritalStatus
      ] || "NA",
    [maritalStatusMapping, profileDetails]
  );

  const dateOfBirth = profileDetails?.basicDetails[0]?.dateOfBirth;

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
  const height = convertToFeetInches(profileDetails?.additionalDetails[0]?.height);
  const formattedHeight = height
    ? String(height).replace("undefined", "") + "ft"
    : "NA";

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
  const timeOfBirth = profileDetails?.basicDetails[0]?.timeOfBirth;
  const formattedTime =
    timeOfBirth !== "NA"
      ? formatTime(timeOfBirth)?.replace("undefined", "")
      : "NA";

  return (
    <>
      <div className="  shadow rounded-lg flex flex-col md:px-3  justify-between relative items-center md:w-auto w-[50vh]  sm:w-[70%] ">
        {isOpenPop && (
          <span className="absolute">
            <BlockPop
              setIsOpen={setIsOpenPop}
              closeblockPop={closeblockPop}
              cardId={profileDetails._id}
              blockUser={blockUser}
            />
          </span>
        )}
        <img
          onClick={openModal}
          loading="lazy"
          src={profileDetails.selfDetails[0].profilePictureUrl}
          alt="img"
          onError={(e) => (e.target.src = defaultImage)}
          className="rounded-full md:w-36 md:h-36 w-36 h-36  mt-8 border-primary border cursor-pointer"
        />
        <p className="font-semibold pt-3  md:px-0 px-6 text-[19px] text-center md:w-72">
          {capitalizeWord(profileDetails?.basicDetails[0]?.name)}{" "}
        </p>

        <span
          onClick={() => handleOpenSpam()}
          className=" px-2 py-1 text-[25px] cursor-pointer rounded-md font-DMsans text-primary absolute   left-0 md:left-0  sm:left-6 top-0 sm:top-0  md:top-0"
        >
          <RiSpam2Line />
        </span>
        {((profileDetails?.isInterestRequestAccepted &&
          profileDetails?.isProfileRequestAccepted) ||
          profileDetails?.isInterestRequestAccepted ||
          profileDetails?.isProfileRequestAccepted) && (
          <Link
            className="border border-primary px-2 py-1 text-[12px] rounded-md font-DMsans text-primary absolute md:right-6 sm:right-6  right-3 top-4 sm:top-3  md:top-3"
            to="/profile"
            state={{
              userId: profileDetails?._id,
              interestReq: profileDetails?.isInterestRequestAccepted,
              profileReq: profileDetails?.isProfileRequestAccepted,
            }}
          >
            View Profile
          </Link>
        )}
        <p className=" font-semibold md:px-0 px-6 text-[16px] text-center md:w-80">
          {profileDetails?.additionalDetails[0]?.currentStateName || "NA"},{" "}
          {profileDetails?.additionalDetails[0]?.currentCountryName || "NA"}{" "}
        </p>

        <p className="font-semibold text-[16px]">
          ({profileDetails?.basicDetails[0]?.userId})
        </p>

        <span className="flex justify-center  items-center flex-col  mt-3  px-6 text-[16px]">
          <span className="flex justify-between md:w-72 w-60 items-center">
            <span className="font-regular text-start ">
              <p>
                {profileDetails?.basicDetails[0]?.age || "NA"}yrs{", "}
                {formattedHeight}
              </p>
              <p>{formattedDateOfBirth || "NA"}</p>
              <p
                onMouseEnter={handleMouseEnter(setMarital)}
                onMouseLeave={handleMouseLeave(setMarital)}
              >
                {transformedMaritalStatus?.slice(0, 8)}..
              </p>
              {isMarital && (
                <div className="absolute   w-auto p-2 bg-white  rounded-lg ">
                  <p> {transformedMaritalStatus}</p>
                </div>
              )}
            </span>
            <span className="font-regular text-start ">
              <p
                onMouseEnter={handleMouseEnter(setShowCommunity)}
                onMouseLeave={handleMouseLeave(setShowCommunity)}
                className="cursor-pointer"
              >
                {profileDetails?.familyDetails[0]?.community === 18
                  ? "Open to all"
                  : profileDetails?.familyDetails[0]?.communityName?.slice(
                      0,
                      12
                    ) || "NA"}
                ..{" "}
              </p>

              {showCommunity && (
                <div className="text-start absolute  w-auto p-1 bg-white border  rounded-lg ">
                  <p>
                    {" "}
                    {profileDetails?.familyDetails[0]?.community === 18
                      ? "Open to all"
                      : profileDetails?.familyDetails[0]?.communityName || "NA"}
                  </p>
                </div>
              )}
              <p>{formattedTime}</p>

              <p
                onMouseEnter={handleMouseEnter(setShowProf)}
                onMouseLeave={handleMouseLeave(setShowProf)}
                className="cursor-pointer"
              >
                {profileDetails?.careerDetails[0]?.professionName?.slice(
                  0,
                  10
                ) || "NA"}
                ...
              </p>
              {showProf && (
                <div className="text-start absolute  w-auto p-1 bg-white border  rounded-lg ">
                  <p>
                    {" "}
                    {profileDetails?.careerDetails[0]?.professionName || "NA"}
                  </p>
                </div>
              )}
            </span>
          </span>

          <div className="flex items-center justify-between w-72   md:px-0 px-6  mt-3 text-center pb-3">
            <span className="font-light ">
              <span
                onClick={sendProfileRequest}
                onMouseEnter={handleMouseEnter(setShowProfileName)}
                onMouseLeave={handleMouseLeave(setShowProfileName)}
                className="bg-primary cursor-pointer text-white rounded-xl px-8 py-1 flex items-center"
              >
                <span>
                  {profileMessage ===
                  "This person has already sent an Profile request to you" ? (
                    <TbEyePlus size={23} />
                  ) : profileDetails?.isProfileRequest ||
                    profileDetails?.isProfileRequestAccepted ||
                    profileDetails?.isInterestRequestAccepted ||
                    profileRequestSent ? (
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
              </span>
              <span
                onClick={ShortlistedData}
                className="border border-primary cursor-pointer text-primary rounded-xl px-8 py-1 mt-2 flex items-center"
              >
                <span>
                  {profileDetails.isShortListed || isShortlisted ? (
                    <IoBookmark size={23} />
                  ) : (
                    <IoBookmarkOutline size={23} />
                  )}
                </span>
              </span>
            </span>
            <span className="font-light">
              <span
                onClick={sendIntrestRequest}
                onMouseEnter={handleMouseEnter(setShowInterestName)}
                onMouseLeave={handleMouseLeave(setShowInterestName)}
                className="bg-primary cursor-pointer rounded-xl px-8  py-1 flex items-center text-white"
              >
                <span>
                  {interestMessage ===
                  "This person has already sent an Interest request to you" ? (
                    <LuUserPlus size={23} />
                  ) : profileDetails?.isInterestRequestAccepted ||
                    profileDetails?.isInterestRequest ||
                    interstRequestSent ? (
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
              </span>
              <span className="border text-primary cursor-pointer border-primary rounded-xl px-8 py-1 mt-2 flex items-center">
                <span onClick={handleOpenPopup}>
                  <MdBlock size={23} />
                </span>
              </span>
            </span>
          </div>
        </span>
      </div>
      <ImagePopup
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        imageUrl={profileDetails.selfDetails[0].profilePictureUrl}
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

export default AllMatchesCard;
