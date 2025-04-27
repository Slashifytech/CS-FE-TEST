import React, { useCallback, useMemo } from "react";
import { TbEyeCheck, TbEyePlus } from "react-icons/tb";
import { MdBlock } from "react-icons/md";
import { FaUserCheck } from "react-icons/fa";
import { IoBookmark, IoBookmarkOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import apiurl, { capitalizeWord } from "../util";
import { userDataStore } from "../Stores/slices/AuthSlice";
import { useState } from "react";
import { LuUserPlus } from "react-icons/lu";
import BlockPop from "../user/PopUps/BlockPop";
import { toast } from "react-toastify";
import UnblockProfilePop from "../user/PopUps/UnblockProfilePop";
import { Link } from "react-router-dom";
import { defaultImage } from "../assets";
import { removeBlockConversation } from "../Stores/slices/chatSlice";
import ImagePopup from "../user/PopUps/ImageView";
import { RiSpam2Line } from "react-icons/ri";
import SpamPopUp from "./../user/PopUps/SpamPopUp";
import ThankYouPop from "../user/PopUps/ThankYouPop";

const Card = ({
  UserDataM,
  item,
  type,
  fetchData,
  updateData,
  setIsBlocked,
  handleBlockUser,
  handleUnblockUser,
  onFilterData,
}) => {
  const { userId } = useSelector(userDataStore);

  const [profileRequestSent, setProfileRequestSent] = useState(
    item?.isProfileRequest || false
  );
  const [interstRequestSent, setInterestRequestSent] = useState(
    item?.isInterestRequest || false
  );
  const [isShortlisted, setIsShortListed] = useState(
    item?.isShortListed || false
  );
  const [isUnblockOpen, setIsUnblockOpen] = useState(false);
  const [isOpenPop, setIsOpenPop] = useState(false);
  const [showProf, setShowProf] = useState(false);
  const [showCommunity, setShowCommunity] = useState(false);
  const [showProfileName, setShowProfileName] = useState(false);
  const [showInterestName, setShowInterestName] = useState(false);
  const [profileMessage, setProfileMessage] = useState({});
  const [interestMessage, setInterestMessage] = useState({});
  const [isMarital, setMarital] = useState(false);
  const [showCountry, setShowCountry] = useState(false);
  const dispatch = useDispatch();
  const handleMouseEnter = useCallback((setter) => () => setter(true), []);
  const handleMouseLeave = useCallback((setter) => () => setter(false), []);
  const [isModalOpen, setModalOpen] = useState(false);
  const [openSpamPopUp, setOpenSpamPopUp] = useState(false);
  const [openThankYouPop, setThankYouPop] = useState(false);

  const openModal = () => setModalOpen(true);

  const closeModal = () => setModalOpen(false);
  const openUnblockPopup = () => {
    setIsUnblockOpen(true);
  };

  const closeUnblock = () => {
    setIsUnblockOpen(false);
  };

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
        reportedOne: item?._id,
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
  const Shortlisted = async () => {
    if (userId && item) {
      try {
        const response = await apiurl.post(`/shortlist/add`, {
          user: userId,
          shortlistedUserId: item?._id,
        });

        if (response.status === 200) {
          const matchRequest = response.data;

          toast.info(response.data.message);
          if (type === "shortList") {
            fetchData();
          }
          setIsShortListed(!isShortlisted);
          updateData(item?._id, "shortlist", isShortlisted);
          return matchRequest;
        } else {
          // If the request failed, throw an error
          if (type === "shortList") {
            fetchData();
          }
          toast.info(response.data.message);
          setIsShortListed(!isShortlisted);
          updateData(item?._id, "shortlist", isShortlisted);
          throw new Error("Failed to send match request");
        }
      } catch (error) {
        toast.error(error.data.message);
        throw error;
      }
    }
  };

  const unblockUser = async (blockedUserId) => {
    if (userId) {
      try {
        const response = await apiurl.put(`/unblock-user`, {
          blockedBy: userId,
          blockedUserId: blockedUserId,
        });
        // setIsBlocked(true);
        onFilterData(blockedUserId);
      } catch (error) {
        console.error("Error unblocking user:", error);
      }
    }
  };

  const blockUser = async () => {
    try {
      if (userId) {
        const response = await apiurl.post("/block-user", {
          blockBy: userId,
          blockUserId: item?._id,
        });
        toast.success(response.data.message);
        setProfileRequestSent(true);
        handleBlockUser(item._id);
        dispatch({ type: "ON_CHAT_PAGE" });
        dispatch(removeBlockConversation(item?._id));
      } else {
      }
      fetchData();
    } catch (error) {
      toast.error(error.data.message);
      console.error("Error blocking user:", error);
    }
  };

  const sendProfileRequest = async () => {
    try {
      if (userId) {
        const response = await apiurl.post("/api/profile-request/send", {
          profileRequestBy: userId,
          profileRequestTo: item?._id,
        });
        setProfileMessage(response.data);
        // console.log(response,"rems");
        setProfileRequestSent(true);

        toast.success(
          response.data === "Profile request updated to pending" ||
            response.data ===
              "You have sent the Profile request from your declined section"
            ? "Interest request sent successfully"
            : response.data
        );

        updateData(item?._id, "profile", profileRequestSent);
      } else {
      }
    } catch (error) {
      toast.error(error.response.data);
    }
  };
  const sendIntrestRequest = async () => {
    try {
      if (userId) {
        const response = await apiurl.post("/api/interest-request/send", {
          interestRequestBy: userId,
          interestRequestTo: item?._id,
        });
        setInterestMessage(response.data);
        setInterestRequestSent(true);
        toast.success(
          response.data === "Interest request updated to pending" ||
            response.data ===
              "You have sent the Interest request from your declined section"
            ? "Interest request sent successfully"
            : response.data
        );
        updateData(item?._id, "interest", interstRequestSent);
      } else {
      }
    } catch (error) {
      toast.error(error.response.data);
    }
  };
  const dateOfBirth = item?.basicDetails[0]?.dateOfBirth;
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
      maritalStatusMapping[item?.additionalDetails[0]?.maritalStatus] || "NA",
    [maritalStatusMapping, item]
  );
  function formatTime(timeString) {
    if (!timeString) return "NA";

    // Split the time string into its components
    const [time, period] = timeString.split(" ");
    const [hours, minutes] = time.split(":");

    // Parse hours and minutes
    let hour = parseInt(hours, 10);
    const minute = parseInt(minutes, 10);

    // Adjust hour for AM/PM

    let displayPeriod = period === undefined ? "" : period;

    // Adjust hour for AM/PM
    if (displayPeriod === "PM" && hour !== 12) {
      hour += 12;
    } else if (displayPeriod === "AM" && hour === 12) {
      hour = 0;
    }
    const formattedHour = hour % 12 || 12;
    const formattedMinutes = minute < 10 ? `0${minute}` : minute;
    return `${formattedHour}:${formattedMinutes} ${period}`;
  }
  const timeOfBirth =
    item?.basicDetails[0]?.timeOfBirth?.replace("undefined", "") || "NA";
  const formattedTime = timeOfBirth !== "NA" ? formatTime(timeOfBirth) : "NA";
  return (
    <>
      {isOpenPop && (
        <span className="absolute">
          <BlockPop
            cardId={item?._id}
            blockUser={blockUser}
            closeblockPop={closeblockPop}
          />
        </span>
      )}
      <UnblockProfilePop
        unblockUser={unblockUser}
        id={item?._id}
        isUnblockOpen={isUnblockOpen}
        closeUnblock={closeUnblock}
      />
      <div className="grid gid-cols-2 items-center justify-center   mt-9 md:mt-5 sm:mt-0 sm:pr-6 mx-6   sm:mx-0  ">
        <div className="shadow flex md:flex-row flex-col sm:flex-row md:w-[37rem] relative  justify-start  md:py-2 sm:py-2  items-center px-2 md:px-3 rounded-2xl  sm:w-[37rem] w-full   mb-6  ">
          <span>
            {" "}
            <img
              onClick={openModal}
              src={item?.selfDetails[0]?.profilePictureUrl}
              alt=""
              onError={(e) => (e.target.src = defaultImage)}
              className="md:w-60 md:h-64 sm:w-60 sm:h-64 w-44 cursor-pointer h-44 md:rounded-lg object-fill  sm:rounded-lg rounded-full mt-[12%] md:mt-0 sm:mt-0 "
            />
          </span>

          <span
            onClick={() => handleOpenSpam()}
            className=" px-2 py-1 text-[25px] cursor-pointer rounded-md font-DMsans text-primary absolute   left-0 md:left-[93.5%]  sm:left-[93%] top-0 sm:top-0  md:top-0"
          >
            <RiSpam2Line />
          </span>
          {((item?.isInterestRequestAccepted &&
            item?.isProfileRequestAccepted) ||
            (UserDataM?.isInterestRequestAccepted &&
              UserDataM?.isProfileRequestAccepted) ||
            item?.isInterestRequestAccepted ||
            UserDataM?.isInterestRequestAccepted ||
            item?.isProfileRequestAccepted ||
            UserDataM?.isProfileRequestAccepted) && (
            <Link
              className="border border-primary px-2 py-1 text-[12px] rounded-md font-DMsans text-primary absolute md:right-10 sm:right-10  right-3 top-4 sm:top-3  md:top-3"
              to="/profile"
              state={{
                userId: item?._id,
                interestReq:
                  item?.isInterestRequestAccepted ||
                  UserDataM?.isInterestRequestAccepted,
                location: location.pathname,
              }}
            >
              View Profile
            </Link>
          )}

          <span>
            <p className="px-9 mt-3 md:w-64 sm:w-60  capitalize text-[16px] font-semibold md:text-start sm:text-start text-center">
              {capitalizeWord(item?.basicDetails[0]?.name)}
            </p>
            <p
              onMouseEnter={handleMouseEnter(setShowCountry)}
              onMouseLeave={handleMouseLeave(setShowCountry)}
              className="cursor-pointer relative  px-9  capitalize text-[16px] font-semibold md:text-start sm:text-start text-center"
            >
              {" "}
              {item?.additionalDetails[0]?.currentStateName?.slice(0, 16) ||
                "NA"}
              {", "}
              {item?.additionalDetails[0]?.currentCountryName?.slice(0, 6) ||
                "NA"}
              ..
              {showCountry && (
                <div className="w-auto text-black  font-normal  bg-white  absolute px-3  rounded-lg cursor-pointer ">
                  <p>
                    {" "}
                    {item?.additionalDetails[0]?.currentStateName || "NA"}
                    {", "}
                    {item?.additionalDetails[0]?.currentCountryName || "NA"}
                  </p>
                </div>
              )}{" "}
            </p>
            <p className="px-9   capitalize text-[16px] font-semibold md:text-start sm:text-start text-center">
              {" "}
              ({item?.basicDetails[0]?.userId}){" "}
            </p>
            <div className="flex  flex-col justify-center items-center ">
              <div className="flex justify-between  items-center gap-9 md:w-full w-80  pl-7 pr-6 md:pr-0 sm:pr-0 text-[16px] mt-2 md:ml-7">
                <span className="font-regular text-start   ">
                  <p>
                    {item?.basicDetails[0]?.age || "NA"}yrs{", "}
                    {item?.additionalDetails[0]?.height + "ft" || "NA"}
                  </p>
                  <p>{formattedDateOfBirth || "NA"}</p>
                  <p
                    onMouseEnter={handleMouseEnter(setMarital)}
                    onMouseLeave={handleMouseLeave(setMarital)}
                    className="cursor-pointer"
                  >
                    {transformedMaritalStatus?.slice(0, 8)}..
                  </p>
                  {isMarital && (
                    <div className="absolute   w-auto p-2 bg-white   rounded-lg ">
                      <p> {transformedMaritalStatus}</p>
                    </div>
                  )}
                </span>
                <span className="font-regular text-start ">
                  <p
                    onMouseEnter={handleMouseEnter(setShowCommunity)}
                    onMouseLeave={handleMouseLeave(setShowCommunity)}
                    className=" cursor-pointer"
                  >
                    {item?.familyDetails[0]?.communityName?.slice(0, 12) ||
                      "NA"}
                    ..
                  </p>
                  {showCommunity && (
                    <div className="text-start absolute  w-auto p-1 bg-white border  rounded-lg">
                      <p> {item?.familyDetails[0]?.communityName || "NA"}</p>
                    </div>
                  )}
                  <p>
                    {formattedTime}
                    {/* +
                      " " +
                      item?.basicDetails[0]?.timeOfBirth?.slice(-2) || "NA"} */}
                  </p>

                  <p
                    onMouseEnter={handleMouseEnter(setShowProf)}
                    onMouseLeave={handleMouseLeave(setShowProf)}
                    className="cursor-pointer"
                  >
                    {item?.careerDetails[0]?.professionName?.slice(0, 9) ||
                      "NA"}
                    ..
                  </p>
                  {showProf && (
                    <div className=" text-start absolute  w-auto p-1 bg-white border  rounded-lg">
                      <p> {item?.careerDetails[0]?.professionName || "NA"}</p>
                    </div>
                  )}
                </span>
              </div>

              <span className="flex justify-between  items-center gap-9 md:w-full w-80 pl-6 pr-6 md:pr-0 sm:pr-0 pb-3  text-[16px] mt-2 md:ml-7 md:mb-0 sm:mb-0 mb-6">
                {type !== "blockedUsers" && (
                  <>
                    <span className="font-light  ">
                      <span
                        onClick={sendProfileRequest}
                        onMouseEnter={handleMouseEnter(setShowProfileName)}
                        onMouseLeave={handleMouseLeave(setShowProfileName)}
                        className="bg-primary text-white rounded-xl px-8 py-[3px] flex items-center cursor-pointer"
                      >
                        <span>
                          {profileMessage ===
                          "This person has already sent an Profile request to you" ? (
                            <TbEyeCheck size={23} />
                          ) : item?.isProfileRequestAccepted ||
                            UserDataM?.isProfileRequest ||
                            UserDataM?.isProfileRequestAccepted ||
                            item?.isInterestRequestAccepted ||
                            UserDataM?.isInterestRequestAccepted ||
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
                        onClick={Shortlisted}
                        className="border border-primary text-primary  cursor-pointer  rounded-xl px-8  py-[3px] mt-2 flex items-center"
                      >
                        {isShortlisted || type === "shortList" ? (
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
                        className="bg-primary text-white  cursor-pointer  rounded-xl px-8  py-[3px] flex items-center"
                      >
                        <span>
                          {interestMessage ===
                            "This person has already sent an Interest request to you" ||
                          interestMessage ===
                            "Interest request already sent" ? (
                            <FaUserCheck size={23} />
                          ) : item?.isInterestRequestAccepted ||
                            UserDataM?.isInterestRequest ||
                            UserDataM?.isInterestRequestAccepted ||
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
                      <span className="border text-primary   cursor-pointer border-primary rounded-xl px-8 py-[3px] mt-2 flex items-center ">
                        <span onClick={handleOpenPopup}>
                          <MdBlock size={23} />
                        </span>
                      </span>
                    </span>
                  </>
                )}
                {type === "blockedUsers" && (
                  <span className="font-light">
                    <span
                      onClick={openUnblockPopup}
                      className="border text-primary   cursor-pointer border-primary rounded-lg px-8 py-[3px] mt-2 flex items-center"
                    >
                      Unblock
                    </span>
                  </span>
                )}
              </span>
            </div>
          </span>
        </div>
      </div>
      <ImagePopup
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        imageUrl={item?.selfDetails[0]?.profilePictureUrl}
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

export default Card;
