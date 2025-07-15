import React, {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { FiEdit } from "react-icons/fi";
import { FaEye } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { IoArrowBackOutline } from "react-icons/io5";
import { getUser } from "../../Stores/service/Genricfunc";
import { userDataStore } from "../../Stores/slices/AuthSlice";
import { useSelector } from "react-redux";
import apiurl, { capitalizeWord } from "../../util";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-toastify";
import { BackArrow } from "../../components/DataNotFound";
import { defaultImage } from "../../assets";
import ImagePopup from "../PopUps/ImageView";

const Header = lazy(() => import("../../components/Header"));
const BasicDetail = lazy(() => import("../Edit/BasicDetail"));
const PersonalDetail = lazy(() => import("../Edit/PersonalDetail"));
const CarrierDetail = lazy(() => import("../Edit/CarrierDetail"));
const FaimllyDetail = lazy(() => import("../Edit/FaimlyDetail"));
const InterestDetail = lazy(() => import("../Edit/InterestDetail"));

const Profile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userdetails = useSelector(userDataStore);
  const [loading, setLoading] = useState(false);
  const [hide, setHide] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [viewImage, setViewImage] = useState(false);

  const [profileEdit, setProfileEdit] = useState({
    fname: "",
    mname: "",
    lname: "",
    dateOfBirth: "",
    timeOfBirth: "",
    placeOfBirthCountry: "",
    placeOfBirthState: "",
    placeOfBirthCity: "",
    post: "",
    manglik: "",
    horoscope: "",
    additionalDetails: {},
    familyDetails: {},
    careerDetails: {},
    selfDetails: {},
  });
  const { userId } = useSelector(userDataStore);
  const [openAbout, setOpenAbout] = useState(false);
  const [PersonalApp, setPersonalApp] = useState(false);
  const [response, setResponse] = useState(null);
  const [aboutYourSelf, setAboutYourself] = useState("");
  const [profileAppearence, setProfileAppearence] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [userID, setUserID] = useState();
  const [profileData, setProfileData] = useState([]);
  const [isUserData, setIsUserData] = useState(false);
  const [againCallFlag, setAgainCallFlag] = useState(false);
  const [showCountry, setShowCountry] = useState(false);
  const [showDiet, setShowDiet] = useState(false);
  const [showProf, setShowProf] = useState(false);
  const [showCommunity, setShowCommunity] = useState(false);
  const handleMouseEnter = useCallback((setter) => () => setter(true), []);
  const handleMouseLeave = useCallback((setter) => () => setter(false), []);
  const { admin } = useSelector((state) => state.admin);

  const fetchUserData = async () => {
    if (admin === "adminAction") {
      setShowProfile(false);
    } else if (userId !== userdetails.userId) {
      setHide(false);
      setShowProfile(true);
    } else {
      setHide(true);
    }
  };
  const openModal = (img) =>{
   setModalOpen(true)
    setViewImage(img)}
  const closeModal = () => setModalOpen(false);
  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const fetchUser = async () => {
    {
      var userId = null;
      if (location.state != null && location.state && location.state.userId) {
        userId = location.state.userId;
      } else {
        userId = userdetails.userId;
      }

      if (admin === "adminAction") {
        setShowProfile(true);
        setHide(false);
      } else if (userId !== userdetails.userId) {
        setHide(false);
        setShowProfile(true);
      } else {
        setHide(true);
      }
      setUserID(userId);
      try {
        const userData = await getUser(userId);
        setIsUserData(false);
        setProfileEdit(userData?.user);
        setIsUserData(userData?.user);
        const formData = userData?.user;
        //  console.log("profileData", profileEdit);
        const perosnalData = userData?.user?.additionalDetails;
        const educationData = userData?.user?.careerDetails;
        const additionalDetails = userData?.user?.familyDetails;
        const selfDetails = userData?.user?.selfDetails;
        setProfileData([
          formData,
          perosnalData,
          educationData,
          additionalDetails,
          selfDetails,
        ]);
        setAgainCallFlag(false);
        setLoading(false);
        setResponse(formData?.userId);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };
  useEffect(() => {
    if (showProfile) {
      setOpenAbout(false);
      setPersonalApp(false);
    }
  }, [userId, showProfile]);
  useEffect(() => {
    setLoading(true);
    fetchUser();
  }, [userId]);

  useEffect(() => {
    fetchUser();
  }, [againCallFlag]);

  async function editTexthandler(type) {
    if (type === "about-yourself" && !aboutYourSelf.trim()) {
      toast.error("Please fill the required fields");
      return;
    }
    var body = {
      type,
      text: type == "personal-appearance" ? profileAppearence : aboutYourSelf,
    };
    try {
      const response = await apiurl.post(
        `/text-detail-change/${userdetails.userId}`,
        body
      );
      if (type == "personal-appearance") {
        setPersonalApp(false);
        setProfileData((prevData) => {
          let newData = [...prevData];
          newData[1] = { ...newData[1], personalAppearance: profileAppearence };
          return newData;
        });
      } else {
        setProfileData((prevData) => {
          let newData = [...prevData];
          newData[4] = { ...newData[4], aboutYourself: aboutYourSelf };
          return newData;
        });
        setOpenAbout(false);
      }
      toast.success("Data added successfully");
    } catch (error) {
      console.error("Error updating text:", error);
    }
  }

  const dateOfBirth = profileData[0]?.basicDetails?.dateOfBirth;

  const formattedDateOfBirth = useMemo(() => {
    if (!dateOfBirth) return "NA";

    const isDDMMYYYY = /^\d{2}-\d{2}-\d{4}$/.test(dateOfBirth);

    if (isDDMMYYYY) {
      return dateOfBirth;
    }

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
    () => maritalStatusMapping[profileData[1]?.maritalStatus] || "NA",
    [maritalStatusMapping, profileData]
  );

  if (loading) {
    return (
      <>
        <div className="md:px-40 px-9 w-full mt-20 ">
          <Skeleton height={300} />{" "}
        </div>
        <div className="md:px-40 px-9 w-full mt-7 ">
          <Skeleton height={90} />
        </div>
        <div className="md:px-40 px-9 w-full mt-7 ">
          <Skeleton height={90} />
        </div>
      </>
    );
  }
  return (
    <>
      {!showProfile && (
        <>
          <Suspense>
            <Header />
          </Suspense>
          <BackArrow className="absolute md:ml-24 md:mt-36 sm:mt-28 w-full md:w-52 overflow-hidden " />
          <div
            id={`profile-${userId}`}
            className=" md:mx-52 flex flex-col   sm:mx-20 mx-6 md:mt-20 sm:mt-0 mt-0  overflow-hidden mb-20"
          ></div>
        </>
      )}

      {showProfile && (
        <span className="absolute md:ml-24 md:mt-0 sm:mt-28 w-full md:w-52 overflow-hidden">
          <span
            onClick={() => {
              if (
                location.state?.location?.includes("interests") ||
                location.state?.location?.includes("approval-lists") ||
                location.state?.AdminViewProfile?.includes("admin_View") ||
                location.state?.location?.includes("profiles") ||
                location.state?.location?.includes("/all-matches") ||
                location.state?.location?.includes("/new-join") ||
                location.state?.location?.includes("/shortlisted") ||
                location.state?.location?.includes("/search-results") ||
                location.state?.location?.includes("/chat") ||
                location.state?.location?.includes("/admin/male-users") ||
                location.state?.location?.includes("/admin/female-users") ||
                location.state?.location?.includes(
                  "/admin/successfull-married"
                ) ||
                location.state?.location?.includes("/admin/deleted-users") ||
                location.state?.location?.includes("/admin/CategoryA-users") ||
                location.state?.location?.includes("/admin/categoryB-users") ||
                location.state?.location?.includes("/admin/categoryC-users") ||
                location.state?.location?.includes(
                  "/admin/uncategorised-users"
                ) ||
                location.state?.location?.includes("/admin/rejected-users") ||
                location?.state?.interestReq === false ||
                location?.state?.profileReq === false
              ) {
                navigate(-1);
              } else {
                setShowProfile(false);
              }
            }}
          >
            <span className="flex items-center bg-primary md:bg-transparent sm:bg-transparent  text-white py-6 px-6">
              <IoArrowBackOutline className="md:text-primary sm:text-primary text-[28px] cursor-pointer" />
              <span> Back</span>
            </span>
          </span>
        </span>
      )}
      <div
        id={`profile-${userId}`}
        className=" md:mx-52 flex flex-col   sm:mx-20 mx-6 md:mt-5 sm:mt-36 mt-28  overflow-hidden mb-20"
      >
        <div className=" mx-1">
          <div className="shadow rounded-xl    py-11 mt-9 my-5 relative w-full h-[36rem] md:h-full sm:h-96 ">
            <div className=" absolute md:right-12 md:top-10 sm:ml-14 sm:top-5 bottom-6">
              <span
                onClick={(prev) => {
                  setShowProfile(!showProfile);
                }}
                className={`flex items-center  w-44   mt-3 ml-16  md:mt-0 md:mx-0 sm:mx-0 border border-primary text-primary font-semibold py-3 px-3 rounded-md ${
                  !hide && "hidden"
                } cursor-pointer`}
              >
                <span className=" pe-3">
                  {!showProfile ? <FaEye /> : <FiEdit />}
                </span>
                <span className="">
                  {!showProfile ? "Preview Profile" : "Edit Details"}
                </span>
              </span>
            </div>
            <span className="flex md:flex-row sm:flex-row flex-col mx-6 md:mx-0 sm:mx-0  items-center">
              <img
              onClick={() =>openModal(profileData[4]?.profilePictureUrl)}
                src={profileData[4]?.profilePictureUrl}
                alt=""
                className="rounded-full  h-40  w-40 border-2 border-primary  mx-16 cursor-pointer"
                onError={(e) => (e.target.src = defaultImage)}
                loading="lazy"
              />
              <span>
                <p className="font-semibold text-[23px] w-72 mt-3 font-montserrat text-center md:text-start sm:text-start ">
                  {capitalizeWord(profileData[0]?.basicDetails?.name)}
                </p>

                <p className="font-semibold text-[16px] md:text-start sm:text-start text-center  font-DMsans">
                  ( {response} )
                </p>
                <span className="flex flex-row  items-baseline md:gap-36 sm:gap-20 mx-3 justify-between md:justify-normal   font-DMsans">
                  <span className=" mt-4  text-[15px] font-DMsans">
                    <p className="py-1">
                      {" "}
                      {profileData[0]?.basicDetails?.age}yrs,{" "}
                      {profileData[1]?.height}ft'
                    </p>
                    <p className="py-1">{formattedDateOfBirth}</p>
                    <p className="py-1">{transformedMaritalStatus || "NA"}</p>
                    <p
                      onMouseEnter={handleMouseEnter(setShowProf)}
                      onMouseLeave={handleMouseLeave(setShowProf)}
                      className="py-1 cursor-pointer"
                    >
                      {profileData[2]?.professionctype?.slice(0, 10) || "NA"}
                      ...
                    </p>
                    {showProf && (
                      <div className="w-auto text-black bg-white absolute rounded-lg">
                        <p>{profileData[2]?.professionctype || "NA"}</p>
                      </div>
                    )}
                  </span>
                  <span className="text-[15px] text-start font-DMsans">
                    <p
                      onMouseEnter={handleMouseEnter(setShowCountry)}
                      onMouseLeave={handleMouseLeave(setShowCountry)}
                      className="py-1 cursor-pointer "
                    >
                      {profileData[1]?.stateatype?.slice(0, 10)},{" "}
                      {profileData[1]?.countryatype?.slice(0, 3)}...
                    </p>
                    {showCountry && (
                      <div className="w-auto text-black bg-white absolute rounded-lg">
                        <p>
                          {profileData[1]?.stateatype || "NA"},{" "}
                          {profileData[1]?.countryatype || "NA"}
                        </p>
                      </div>
                    )}
                    <p className="py-1">
                      {profileData[0]?.basicDetails?.timeOfBirth || "NA"}
                    </p>
                    <p
                      className="py-1 cursor-pointer"
                      onMouseEnter={handleMouseEnter(setShowDiet)}
                      onMouseLeave={handleMouseLeave(setShowDiet)}
                    >
                      {profileData[1]?.dietatype?.slice(0, 10)}...
                    </p>
                    {showDiet && (
                      <div className="w-auto text-black bg-white absolute rounded-lg">
                        <p>{profileData[1]?.dietatype || "NA"}</p>
                      </div>
                    )}
                    <p
                      onMouseEnter={handleMouseEnter(setShowCommunity)}
                      onMouseLeave={handleMouseLeave(setShowCommunity)}
                      className="py-1 cursor-pointer"
                    >
                      {profileData[3]?.communityftype?.slice(0, 10)}...
                    </p>
                    {showCommunity && (
                      <div className="w-auto text-black bg-white absolute rounded-lg">
                        <p>{profileData[3]?.communityftype || "NA"}</p>
                      </div>
                    )}
                  </span>
                </span>
              </span>
            </span>
          </div>
        </div>
        {/* {console.log({ userData?.user })} */}

        {/* About */}
        <div className="shadow rounded-xl  py-3 mt-9 my-5 mx-1 avoid-page-break">
          <span className="flex justify-between items-center text-primary px-10 py-2 ">
            <p className="  font-medium  text-[20px]">
              About Yourself <span className="text-primary">*</span>
            </p>
            <span className="text-[20px] cursor-pointer flex items-center font-DMsans">
              <span
                onClick={() => setOpenAbout((prev) => !prev)}
                className="text-[20px] cursor-pointer flex items-center font-DMsans"
              >
                {" "}
                {!showProfile && (
                  <>
                    {!openAbout ? (
                      <>
                        <FiEdit />
                        <span className=" px-3 text-[14px]">Edit</span>{" "}
                      </>
                    ) : (
                      ""
                    )}
                  </>
                )}
              </span>
            </span>
          </span>
          <hr className="mx-9" />

          <p className="px-9 py-4 font-DMsans font-normal text-[15px]">
            {profileData[4]?.aboutYourself}
          </p>
          {openAbout && (
            <>
              <div className="mx-9">
                <textarea
                  placeholder="Write here about yourself..."
                  className="px-3  rounded-md py-4 bg-[#F0F0F0] h-[13rem] font-DMsans font-normal text-[15px] w-full scrollbar-hide focus:outline-none"
                  onChange={(e) => {
                    setAboutYourself(e.target.value);
                  }}
                >
                  {profileData[4]?.aboutYourself}
                </textarea>
              </div>

              <div className="flex items-center justify-end gap-5 mx-9 mb-9 font-DMsans mt-9">
                <span
                  onClick={() => setOpenAbout((prev) => !prev)}
                  className="border  border-primary text-primary px-5 rounded-md py-2 cursor-pointer"
                >
                  Cancel
                </span>
                <span
                  onClick={() => editTexthandler("about-yourself")}
                  className="bg-primary text-white px-7 rounded-md py-2 cursor-pointer"
                >
                  Save
                </span>
              </div>
            </>
          )}
        </div>
        {(!showProfile || !profileData[1]?.personalAppearance == "") && (
          <div className="shadow rounded-xl  py-3 mt-9 my-5 mx-1 ">
            <span className="flex justify-between items-center text-primary px-10 py-2">
              <p className="  font-medium  text-[20px]">Personal Appearance</p>
              <span className="text-[20px] cursor-pointer flex items-center font-DMsans">
                <span
                  onClick={() => setPersonalApp((prev) => !prev)}
                  className="text-[20px] cursor-pointer flex items-center font-DMsans"
                >
                  {!showProfile && (
                    <>
                      {" "}
                      {!PersonalApp ? (
                        <>
                          <FiEdit />
                          <span className=" px-3 text-[14px]">Edit</span>{" "}
                        </>
                      ) : (
                        ""
                      )}
                    </>
                  )}
                </span>
              </span>
            </span>
            <hr className="mx-9" />
            <p className="px-9 py-4 font-DMsans font-light text-[14px]">
              {profileEdit && profileData[1]?.personalAppearance}
            </p>
            {PersonalApp && (
              <>
                <div className="mx-9">
                  <textarea
                    placeholder="Write about your personal appearance"
                    className=" px-3 py-4 rounded-md  bg-[#F0F0F0] h-[13rem] font-DMsans font-extralight text-[15px] w-full scrollbar-hide focus:outline-none"
                    onChange={(e) => {
                      setProfileAppearence(e.target.value);
                    }}
                  >
                    {profileEdit && profileData[1]?.personalAppearance}
                  </textarea>
                </div>

                <div className="flex items-center justify-end gap-5 mx-9 mb-9 font-DMsans mt-9">
                  <span
                    onClick={() => setPersonalApp((prev) => !prev)}
                    className="border border-primary text-primary px-5 rounded-md py-2 cursor-pointer"
                  >
                    Cancel
                  </span>
                  <span
                    onClick={() => editTexthandler("personal-appearance")}
                    className="bg-primary text-white px-7 rounded-md py-2 cursor-pointer"
                  >
                    Save
                  </span>
                </div>
              </>
            )}
          </div>
        )}
        {showProfile && (
          <div className={`shadow rounded-xl py-3 mt-9 my-5 mx-1 `}>
            <span className="flex justify-between items-center  text-primary px-10 py-2 no-print">
              <p className="  font-medium  text-[20px]">Images </p>
            </span>
            <hr className="mx-9" />
            <div className="flex flex-wrap gap-3 mt-12 mb-9 mx-10 ">
              {profileEdit &&
                profileEdit?.selfDetails?.userPhotosUrl?.map((img) => (
                  <img
              onClick={()=> openModal(img) }

                    src={img}
                    loading="lazy"
                    className="border border-1 border-primary rounded-xl md:w-60 md:h-60 sm:w-52 sm:h-52 w-[25rem] h-[18rem] cursor-pointer"
                    // style={{ maxWidth: "200px", maxHeight: "200px" }}
                  />
                ))}
            </div>
          </div>
        )}
        <Suspense>
          <div className="mx-1">
            <BasicDetail
              showProfile={showProfile}
              profileData={profileData}
              againCallFlag={againCallFlag}
              setIsUserData={setIsUserData}
              setAgainCallFlag={setAgainCallFlag}
            />
          </div>
        </Suspense>
        <Suspense>
          <div className="mx-1">
            <PersonalDetail
              showProfile={showProfile}
              location={location}
              profileData={profileData}
              againCallFlag={againCallFlag}
              setAgainCallFlag={setAgainCallFlag}
            />
          </div>
        </Suspense>
        <Suspense>
          <div className="mx-1">
            <CarrierDetail
              showProfile={showProfile}
              profileData={profileData}
              againCallFlag={againCallFlag}
              setAgainCallFlag={setAgainCallFlag}
            />
          </div>
        </Suspense>
        {/* Faimly Details */}
        <Suspense>
          <div className="mx-1">
            <FaimllyDetail
              showProfile={showProfile}
              getUser={getUser}
              profileData={profileData}
              isUserData={isUserData}
              againCallFlag={againCallFlag}
              setAgainCallFlag={setAgainCallFlag}
            />
          </div>
        </Suspense>

        <Suspense>
          <div className="mx-1 my-1">
            <InterestDetail
              showProfile={showProfile}
              profileData={profileData}
              againCallFlag={againCallFlag}
              setAgainCallFlag={setAgainCallFlag}
            />
          </div>
        </Suspense>
      </div>
      <ImagePopup
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        imageUrl={viewImage}

      />
    </>
  );
};

export default Profile;
