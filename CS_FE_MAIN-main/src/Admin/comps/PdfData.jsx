import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
  useMemo,
} from "react";

import html2pdf from "html2pdf.js";
import { getUserLogoInBase64 } from "../../common/commonFunction";
import { Link } from "react-router-dom";
import { logo } from "../../assets";
import { getUser } from "../../Stores/service/Genricfunc";

const PdfData = forwardRef(({ userId }, ref) => {
  const [profileData, setProfileData] = useState([]);
  const [logoBase64, setLogoBase64] = useState("");

  const [isUserData, setIsUserData] = useState(false);
  const [profileEdit, setProfileEdit] = useState({});
  const [isCareer, setIsCareer] = useState({
    university: "",
  });
  const fetchUser = async () => {
    try {
      const userData = await getUser(userId);
      const data = userData?.user?.careerDetails;
      setIsUserData(false);
      setProfileEdit(userData?.user);
      setIsUserData(userData?.user);
      const formData = userData?.user;

      setProfileData(formData);
      setIsCareer({
        university: data ? data["school/university"] : "",
      });
    } catch (error) {
      console.log(error);
    } finally {
    }
  };
  useEffect(() => {
    fetchUser();
  }, [userId]);

  useEffect(() => {
    const fetchUserLogo = async () => {
      try {
        const base64Data = await getUserLogoInBase64(userId);
        setLogoBase64(base64Data);
      } catch (err) {
        console.log(err);
      }
    };
    if (userId) {
      fetchUserLogo();
    }
  }, [userId]);
  const name = profileData?.basicDetails?.name || "";
  const words = name.split(" ");
  const firstWord = words[0] || "";
  const lastWord = words[words.length - 1] || "";

  const displayName = `${firstWord} ${lastWord}`;
  const pdfRef = useRef();
  const handleDownloadPDF = () => {
    const input = pdfRef.current;
    const opt = {
      margin: 0,
      filename: `${displayName}_CSProfile`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 3 },
      jsPDF: { unit: "in", format: "a4", orientation: "landscape" },
      pagebreak: { mode: "avoid-all" },
    };
    html2pdf().from(input).set(opt).save();
  };

  useImperativeHandle(ref, () => ({
    handleDownloadPDF,
  }));
  const maritalStatusMapping = {
    single: "Single",
    awaitingdivorce: "Awaiting Divorce",
    divorcee: "Divorcee",
    widoworwidower: "Widow or Widower",
  };
  const transformedMaritalStatus =
    maritalStatusMapping[profileData?.additionalDetails?.maritalStatus] || "NA";

  const dateOfBirth = profileData?.basicDetails?.dateOfBirth;
  const formattedDateOfBirth = useMemo(() => {
    if (!dateOfBirth) return "NA";
    const [year, month, day] = dateOfBirth.split("-");
    return `${day}-${month}-${year}`;
  }, [dateOfBirth]);

  const incomeUSD = profileData?.careerDetails?.annualIncomeUSD;
  const formattedIncome =
    incomeUSD && !isNaN(incomeUSD) ? Number(incomeUSD).toFixed(2) : "N/A";
  return (
    <div ref={pdfRef}>
      <span>
        <Link>
          {" "}
          <img
            src={logo}
            alt="logo"
            className="md:w-[8%] sm:w-[14%] w-20 md:mx-12 mx-6 mt-3 cursor-pointer"
          />
        </Link>
      </span>
      <div
        id={`profile-${userId}`}
        className="  flex flex-col  md:mx-52 sm:mx-20 mx-6  overflow-hidden mb-20"
      >
        <div className=" mx-1">
          <div className="bg-[#fcfcfc] rounded-xl    py-11 mt-9 my-5 relative w-full h-[36rem] md:h-full sm:h-96 ">
            <span className="flex md:flex-row sm:flex-row flex-col mx-6 md:mx-0 sm:mx-0  items-center">
              <img
                src={`data:image/png;base64,${logoBase64}`}
                alt=""
                className="rounded-full  h-40  w-40 border-2 border-primary  mx-16"
              />
              <span>
                <span className="flex flex-col">
                  <p className="font-semibold text-[23px] mt-3 font-montserrat text-center md:text-start sm:text-start">
                    {profileData?.basicDetails?.name?.replace("undefined", "")}
                  </p>
                  <p className="font-semibold text-[16px] text-center md:text-start sm:text-start">
                    ({profileData?.userId} )
                  </p>
                </span>
                <span className="flex flex-row  items-baseline md:gap-36 sm:gap-20 gap-9 font-DMsans">
                  <span className=" mt-4  text-[14px]">
                    <p className="py-1">
                      {" "}
                      {profileData?.basicDetails?.age}yrs,{" "}
                      {profileData?.additionalDetails?.height || "NA"}ft'
                    </p>
                    <p className="py-1">{formattedDateOfBirth}</p>
                    <p className="py-1">{transformedMaritalStatus || "NA"}</p>
                    <p className="py-1">
                      {profileData?.careerDetails?.professionctype || "NA"}
                    </p>
                  </span>
                  <span className="text-[14px] text-end md:text-start sm:text-start">
                    <p className="py-1">
                      {profileData?.additionalDetails?.stateatype},{" "}
                      {profileData?.additionalDetails?.countryatype}
                    </p>
                    <p className="py-1">
                      {profileData?.basicDetails?.timeOfBirth || "NA"}
                    </p>
                    <p className="py-1">
                      {profileData?.additionalDetails?.dietatype}
                    </p>
                    <p className="py-1">
                      {profileData?.familyDetails?.communityftype}
                    </p>
                  </span>
                </span>
              </span>
            </span>
          </div>
        </div>

        {/* {console.log({ userData?.user })} */}

        {/* About */}
        <div className="bg-[#fcfcfc] rounded-xl  py-3 mt-9 my-5 mx-1 h-64 mb-8 section overflow-hidden">
          <span className="flex justify-between items-center text-primary px-10 py-2 ">
            <p className="  font-medium  text-[20px]">
              About Yourself <span className="text-primary">*</span>
            </p>
            <span className="text-[20px] cursor-pointer flex items-center font-DMsans">
              <span className="text-[20px] cursor-pointer flex items-center font-DMsans"></span>
            </span>
          </span>
          <hr className="mx-9" />

          <p className="px-9 py-4 font-DMsans font-extralight text-[15px]">
            {profileData?.selfDetails?.aboutYourself}
          </p>
        </div>

        <div className="section mt-40">
          <div className=" mx-1">
            <div className="bg-[#fcfcfc] rounded-xl h-96  py-3  mt-3 my-5 w-full ">
              <span className="flex justify-between items-center text-primary px-10 py-2 ">
                <p className="  font-medium  text-[20px]">Basic Details</p>
                <span className="text-[20px] cursor-pointer flex items-center font-DMsans"></span>
              </span>
              <hr className="mx-9" />
              <span className="flex md:flex-row flex-col sm:flex-row  items-baseline justify-between w-full font-DMsans px-10 text-start pb-8 overflow-hidden">
                <span className=" mt-4 w-1/2  text-[14px]">
                  <p className="  font-medium"> Profile Created For</p>
                  <p className="font-light capitalize">
                    {/* {console.log({ response })} */}
                    {Array.isArray(profileData?.createdBy) &&
                    profileData?.createdBy.length > 0
                      ? profileData?.createdBy[0].createdFor
                      : "NA"}
                  </p>
                  <p className=" pt-4 font-medium"> Name</p>
                  <p className=" font-light">
                    {profileData?.basicDetails?.name?.replace(
                      "undefined",
                      ""
                    ) || "NA"}
                  </p>

                  <p className=" pt-4 font-medium"> Gender</p>
                  <p className=" font-light">
                    {profileData?.basicDetails?.gender === "M"
                      ? " Male"
                      : "Female" || "NA"}
                  </p>

                  <p className=" pt-4 font-medium">Birth Date</p>
                  <p className=" font-light">{formattedDateOfBirth}</p>
                  <p className=" pt-4  font-medium">Horoscope Matching</p>
                  <p className=" font-light">
                    {profileData?.basicDetails?.horoscope || "NA"}
                  </p>
                </span>
                <span className="text-[14px] mt-4 w-1/2">
                  <p className="  font-medium"> Time of Birth</p>
                  <p className=" font-light">
                    {profileData?.basicDetails?.timeOfBirth || "NA"}
                  </p>

                  <p className=" pt-4 font-medium"> Age</p>
                  <p className=" font-light">
                    {profileData?.basicDetails?.age || "NA"}yrs
                  </p>

                  <p className=" pt-4 font-medium"> Place of Birth</p>
                  <p className=" font-light ">
                    {profileData?.basicDetails?.citybtype || "NA"},
                    {profileData?.basicDetails?.statebtype || "NA"},
                    {profileData?.basicDetails?.countrybtype || "NA"}
                  </p>

                  <p className=" pt-4 font-medium">Manglik Status</p>
                  <p className=" font-light capitalize">
                    {profileData?.basicDetails?.manglik}
                  </p>
                </span>
              </span>
            </div>
          </div>

          <div className=" mx-1  mt-[65%] bg-[#fcfcfc]">
            <div className=" rounded-xl py-3  my-5  w-full overflow-hidden">
              <span className="flex justify-between items-center text-primary px-10 ">
                <p className="  font-medium  text-[20px]">Personal Details</p>
              </span>
            </div>
            <div className="section">
              <hr className="mx-9  " />
              <span className="md:flex sm:flex md:flex-row sm:flex-row items-baseline justify-between font-DMsans  px-10 w-full text-start pb-8">
                <div className=" mt-4  text-[14px] w-1/2 md:mx-0 sm:mx-0">
                  <p className="  font-medium "> Height</p>
                  <p className=" font-light">
                    {profileData?.additionalDetails?.height || "NA"}ft
                  </p>
                  <p className="  font-medium"> Weight</p>
                  <p className="font-light">
                    {" "}
                    {profileData?.additionalDetails?.weight
                      ? profileData?.additionalDetails?.weight
                      : "NA"}{" "}
                    Kg
                  </p>
                  <p className=" pt-4 font-medium">
                    {" "}
                    Presently Settled in Country
                  </p>
                  <p className="font-light">
                    {" "}
                    {profileData?.additionalDetails?.countryatype
                      ? profileData?.additionalDetails?.countryatype
                      : "NA"}{" "}
                  </p>
                  <p className=" pt-4 font-medium">
                    Presently Settled in State
                  </p>
                  <p className="font-light">
                    {/* {console.log({ detailpersonal })} */}
                    {profileData?.additionalDetails?.stateatype
                      ? profileData?.additionalDetails?.stateatype
                      : "NA"}{" "}
                  </p>
                  <p className=" pt-4 font-medium">Presently Settled in City</p>
                  <p className="font-light">
                    {" "}
                    {profileData?.additionalDetails?.cityatype
                      ? profileData?.additionalDetails?.cityatype
                      : "NA"}{" "}
                  </p>
                  <p className=" pt-4 font-medium">
                    Open to Relocate in Future
                  </p>
                  <p className="font-light">
                    {" "}
                    {profileData?.additionalDetails?.relocationInFuture
                      ? profileData?.additionalDetails?.relocationInFuture
                      : "NA"}{" "}
                  </p>
                </div>
                <div className="text-[14px] mt-4 w-1/2">
                  <p className="  font-medium"> Diet</p>
                  <p className="font-light">
                    {" "}
                    {profileData?.additionalDetails?.dietatype
                      ? profileData?.additionalDetails?.dietatype
                      : "NA"}{" "}
                  </p>
                  <p className=" pt-4 font-medium">Alcohol Consumption</p>
                  <p className="font-light">
                    {" "}
                    {profileData?.additionalDetails?.alcohol
                      ? profileData?.additionalDetails?.alcohol
                      : "NA"}{" "}
                  </p>
                  <p className=" pt-4 font-medium"> Smoking Preference</p>
                  <p className="font-light">
                    {" "}
                    {profileData?.additionalDetails?.smoking
                      ? profileData?.additionalDetails?.smoking
                      : "NA"}{" "}
                  </p>
                  <p className=" pt-4 font-medium">Martial Status</p>
                  <p className="font-light">
                    {" "}
                    {profileData?.additionalDetails?.maritalStatus
                      ? profileData?.additionalDetails?.maritalStatus
                      : "NA"}{" "}
                  </p>
                  {/* {location?.includes('interests') && <> */}
                  <p className=" pt-4 font-medium">Contact Details</p>
                  <p className="font-light">
                    {" "}
                    {profileData?.additionalDetails?.contact || "NA"}
                  </p>
                  <p className=" pt-4 font-medium">Email Address</p>
                  <p className="font-light">
                    {" "}
                    {profileData?.additionalDetails?.email || "NA"}
                  </p>
                  {/* </>} */}
                </div>
              </span>
            </div>
          </div>
        </div>

        <div className=" mx-1 section mt-72">
          <div className="bg-[#fcfcfc] rounded-xl  py-3 mt-2 my-5  w-full overflow-hidden">
            <span className="flex justify-between items-center text-primary w-1/2 py-2">
              <p className="  font-medium  text-[20px] px-9">Career Details</p>
              <span className="text-[20px] cursor-pointer flex items-center font-DMsans"></span>
            </span>
            <hr className="mx-9" />
            <span className="flex md:flex-row sm:flex-row flex-col  items-baselinev justify-between w-full font-DMsans px-10 text-start pb-8">
              <span className=" mt-4  text-[14px]">
                <p className="  font-medium"> Education</p>
                <p className="font-light">
                  {profileData?.careerDetails?.educationctype || "NA"}
                </p>

                <p className=" pt-4 font-medium"> University</p>
                <p className=" font-light">{isCareer.university}</p>
                <p className=" pt-4 font-medium"> Highest Qualification</p>
                <p className=" font-light">
                  {profileData?.careerDetails?.highestQualification
                    ? profileData?.careerDetails?.highestQualification
                    : "NA"}
                </p>
                <p className=" pt-4 font-medium">Profession</p>
                <p className=" font-light">
                  {profileData?.careerDetails?.professionctype || "NA"}
                </p>
              </span>
              <span className="text-[14px] mt-4 w-1/2">
                <p className="  font-medium"> Current Designation</p>
                <p className=" font-light">
                  {profileData?.careerDetails?.currentDesignation
                    ? profileData?.careerDetails?.currentDesignation
                    : "NA"}
                </p>
                <p className=" pt-4 font-medium">Previous Occupation</p>
                <p className=" font-light">
                  {profileData?.careerDetails?.previousOccupation
                    ? profileData?.careerDetails?.previousOccupation
                    : "NA"}
                </p>
                <p className=" pt-4 font-medium"> Approximate Annual Income</p>
                <p className=" font-light">
                  {formattedIncome}
                  USD
                </p>
              </span>
            </span>
          </div>
        </div>

        <div className=" mx-1 section h-96 mt-96">
          <div className="bg-[#fcfcfc] rounded-xl  py-3 mt-9 my-5 w-full overflow-hidden">
            <span className="flex justify-between items-center text-primary px-10 py-2">
              <p className="  font-medium  text-[20px]">Family Details</p>
              <span className="text-[20px] cursor-pointer flex items-center font-DMsans"></span>
            </span>

            <hr className="mx-9" />
            <span className="flex md:flex-row sm:flex-row flex-col items-baseline justify-between w-full font-DMsans px-10 text-start pb-8">
              <span className=" mt-2  text-[14px] w-1/2">
                <p className="  font-medium">Father’s Name</p>
                <p className=" font-light">
                  {profileData?.familyDetails?.fatherName
                    ? profileData?.familyDetails?.fatherName
                    : "NA"}
                </p>
                <p className=" pt-4 font-medium"> Father’s Occupation</p>
                <p className=" font-light">
                  {profileData?.familyDetails?.fatherOccupation
                    ? profileData?.familyDetails?.fatherOccupation
                    : "NA"}
                </p>
                <p className=" pt-4 font-medium"> Mother’s Name</p>
                <p className=" font-light">
                  {profileData?.familyDetails?.motherName
                    ? profileData?.familyDetails?.motherName
                    : "NA"}
                </p>
                <p className=" pt-4 font-medium">Mother’s Occupation</p>
                <p className=" font-light">
                  {profileData?.familyDetails?.motherOccupation
                    ? profileData?.familyDetails?.motherOccupation
                    : "NA"}
                </p>
                <p className="pt-4 font-medium">Siblings</p>
                {profileData?.familyDetails?.users &&
                  profileData?.familyDetails?.users.map((userDetail, index) => (
                    <div key={index} className="flex capitalize">
                      <p className="font-light">{userDetail.gender} - </p>
                      <p className="font-light"> {userDetail.option}</p>
                    </div>
                  ))}
                <p className=" pt-4 font-medium">Lives with Family</p>
                <p className=" font-light">
                  {profileData?.familyDetails?.withFamilyStatus || "NA"}
                </p>
              </span>
              <span className="text-[14px] mt-4 w-1/2">
                <p className="  font-medium"> Family Settled (Country)</p>
                <p className=" font-light">
                  {profileData?.familyDetails?.countryftype || "NA"}
                </p>
                <p className=" pt-4 font-medium">Family Settled (State)</p>
                <p className=" font-light">
                  {profileData?.familyDetails?.stateftype || "NA"}
                </p>
                <p className=" pt-4 font-medium"> Family Settled (City)</p>
                <p className=" font-light">
                  {profileData?.familyDetails?.cityftype || "NA"}
                </p>
                <p className=" pt-4 font-medium">Religion</p>
                <p className=" font-light">Hinduism</p>
                <p className=" pt-4 font-medium">Community</p>
                <p className=" font-light">
                  {profileData?.familyDetails?.communityftype || "NA"}
                </p>
                <p className=" pt-4 font-medium">
                  Family Annual Income (
                  {profileData?.careerDetails?.currencyType})
                </p>

                <p className=" font-light">
                  {profileData?.familyDetails?.familyAnnualIncomeStart || "NA"}
                </p>
              </span>
            </span>
          </div>
        </div>

        <div className=" mx-1 mb-1 section ">
          <div className="bg-[#fcfcfc] rounded-xl  h-60  py-3 mt-[67%] my-5   md:mb-0 mb-36 sm:mb-0  w-full overflow-hidden">
            <span className="flex justify-between items-center text-primary px-10 py-2">
              <p className="  font-medium  text-[20px]">
                Additional Details & Interests
              </p>
              <span className="text-[20px] cursor-pointer flex items-center font-DMsans"></span>
            </span>
            <hr className="mx-9" />
            <span className="flex md:flex-row sm:flex-row flex-col  items-baseline justify-between font-DMsans  px-10 text-start pb-8">
              <span className=" mt-4  text-[14px] w-1/2">
                <p className="  font-medium"> Interests</p>
                <p className=" font-light ">
                  {profileData?.selfDetails?.interestsTypes === ""
                    ? "Select All"
                    : profileData?.selfDetails?.interestsTypes || "NA"}
                </p>
                <p className=" pt-4 font-medium">Fun</p>
                <p className=" font-light md:pe-40">
                  {profileData?.selfDetails?.funActivitiesTypes === ""
                    ? "Select All"
                    : profileData?.selfDetails?.funActivitiesTypes || "NA"}
                </p>
              </span>
              <span className="text-[14px] mt-5 w-1/2">
                <p className="  font-medium">Fitness</p>
                <p className=" font-light ">
                  {profileData?.selfDetails?.fitnessTypes === ""
                    ? "Select All"
                    : profileData?.selfDetails?.fitnessTypes || "NA"}
                </p>
                <p className=" pt-4 font-medium">Other Interests</p>
                <p className=" font-light ">
                  {profileData?.selfDetails?.otherTypes === ""
                    ? "Select All"
                    : profileData?.selfDetails?.otherTypes || "NA"}
                </p>
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});

export default PdfData;
