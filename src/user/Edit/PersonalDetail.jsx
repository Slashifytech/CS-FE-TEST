import React, { useEffect, useState } from "react";
import { FiEdit } from "react-icons/fi";
import CustomSlider, { HeightSlider } from "../../components/CustomSlider";
import { setUser, userDataStore } from "../../Stores/slices/AuthSlice";
import { RadioInput } from "../../components/CustomInput";
import {
  getCitiesByState,
  getCountries,
  getStatesByCountry,
} from "../../common/commonFunction";
import { convertFeetInchesToInches, convertToFeetInchesDecimal } from "../../common/common"

import { toast } from "react-toastify";
import { Autocomplete, TextField } from "@mui/material";
import apiurl from "../../util";
import { LuUserPlus } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
const PersonalDetail = ({
  showProfile,
  profileData,
  setAgainCallFlag,
  againCallFlag,
  location,
}) => {
  const dispatch = useDispatch()
  const [personalDatas, setPersonalDatas] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [detailpersonal, setDetailPersonal] = useState({
    height: "",
    weight: "",
    personalAppearance: "",
    currentlyLivingInCountry: "",
    currentlyLivingInState: "",
    currentlyLivingInCity: "",
    relocationInFuture: "",
    diet: "",
    maritalStatus: "",
    smokingPreference: "",
    contact: "",
    email: "",
    alcohal: "",
    email: "",
  });
  const { country, state } = useSelector((state) => state.masterData);
  const { userId, userData } = useSelector(userDataStore);
  const [states, setState] = useState([]);
  const [city, setCity] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const handleFocus = () => {
    setIsFocused(true);
  };
  const [showProfileName, setShowProfileName] = useState(false);
  const [showInterestName, setShowInterestName] = useState(false);

  const handleMouseEnterProfile = () => {
    setShowProfileName(true);
  };

  const handleMouseLeaveProfile = () => {
    setShowProfileName(false);
  };
  const handleMouseEnterInterest = () => {
    setShowInterestName(true);
  };

  const handleMouseLeaveInterest = () => {
    setShowInterestName(false);
  };
  // Function to handle blur
  const handleBlur = () => {
    setIsFocused(false);
  };

  //sliderChange
  const handleSliderChange = (name) => (event, newValue) => {
    setDetailPersonal((log) => ({
      ...log,
[name]: name === "height" ? convertToFeetInchesDecimal(newValue) : newValue,
    }));
  };
  const handleSelectChange = (event, values, field) => {
    if (values === "Open to all") {
      if (field === "country") {
        setDetailPersonal((prevValues) => ({
          ...prevValues,
          currentlyLivingInCountry: country.map((option) => option.country_id),
          currentlyLivingInState: "",
          currentlyLivingInCity: "",
        }));
        setState([]);
        setCity([]);
      } else if (field === "state") {
        setDetailPersonal((prevValues) => ({
          ...prevValues,
          currentlyLivingInState: "",
          currentlyLivingInCity: "",
        }));
        setCity([]);
      }
    } else {
      setDetailPersonal((prevValues) => ({
        ...prevValues,
        [field]: values,
      }));
      if (field === "country") {
        setDetailPersonal((prevValues) => ({
          ...prevValues,
          currentlyLivingInCountry: values,
          currentlyLivingInState: "",
          currentlyLivingInCity: "",
        }));

        // .catch((error) => console.error("Error fetching states:", error));
      } else if (field === "state") {
        setDetailPersonal((prevValues) => ({
          ...prevValues,
          currentlyLivingInState: values,
          currentlyLivingInCity: "",
        }));
        getCitiesByState(detailpersonal.placeOfBirthCountry, values).then(
          (cities) => {
            setCity(
              cities.map((item) => ({
                cityName: item.city_name,
                cityId: item.city_id,
              }))
            );
          }
        );
        // .catch((error) => console.error("Error fetching cities:", error));
      } else if (field === "city") {
        // Add this condition
        setDetailPersonal((prevValues) => ({
          ...prevValues,
          currentlyLivingInCity: values, // Set placeOfBirthCity to values
        }));
      }
    }
  };
  const { contact } = detailpersonal;

  const relocationInFutureData = ["Yes", "No", "Not Sure"];
  const dietData = [
    "Vegetarian",
    "Non - Vegetarian",
    "Occasionally Non - Vegetarian ",
    "Eggetarian",
    "Vegan",
  ];
  const alcohalData = ["Regular", "Occasional", "Social", "Not at all"];
  const smokingData = ["Regular", "Occasional", "Social", "Not at all"];
  const maritalData = [
    "single",
    "divorcee",
    "awaitingdivorce",
    "widoworwidower",
  ];

  const formatOption = (option) => {
    if (option === "awaitingdivorce") {
      return "Awaiting Divorce";
    }
    if (option === "widoworwidower") {
      return "Widow or Widower";
    }
    return option.charAt(0).toUpperCase() + option.slice(1);
  };

  const CapitalmaritalData = maritalData.map(formatOption);

  const [formErrors, setFormErrors] = useState({
    // height: "",
    // weight: "",

    currentlyLivingInCountry: "",
    currentlyLivingInSate: "",
    relocationInFuture: "",
    diet: "",
    maritalStatus: "",
    smoking: "",
    contact: "",
    // email: "",
    alcohol: "",
  });

  const validateForm = () => {
    const errors = {};
    let hasErrors = false;

    if (!detailpersonal.currentlyLivingInCountry) {
      errors.currentlyLivingInCountry = "Country is required";
      hasErrors = true;
    }
    if (!detailpersonal.currentlyLivingInState) {
      errors.currentlyLivingInState = "Country is required";
      hasErrors = true;
    }
    if (!detailpersonal.relocationInFuture) {
      errors.relocationInFuture = "Relocation In Future is required";
      hasErrors = true;
    }
    if (!detailpersonal.diet) {
      errors.diet = "Diet is required";
      hasErrors = true;
    }
    if (!detailpersonal.maritalStatus) {
      errors.maritalStatus = "Marital Status is required";
      hasErrors = true;
    }
    if (!detailpersonal.smoking) {
      errors.smoking = "Smoking is required";
      hasErrors = true;
    }
    if (
      typeof detailpersonal.contact !== "string" ||
      !detailpersonal.contact.trim()
    ) {
      errors.contact = "Contact number is required";
      hasErrors = true;
    }
    // if (
    //   typeof detailpersonal.email !== "string" ||
    //   !detailpersonal.email.trim()
    // ) {
    //   errors.email = "Email is required";
    //   hasErrors = true;
    // }

    setFormErrors(errors); // Update the form errors state
    return !hasErrors; // Return true if there are no errors
  };

  // Inside handleSubmitForm2 function
  const handleSubmitForm2 = async () => {
    // console.log("Submitting Form 2...");

    // Validate form data
    if (!validateForm()) {
      // console.log("Form validation failed.");
      toast.error("Please fill in all required fields.");
      setIsOpen((prev) => prev);

      return;
    }

    try {
      const response = await apiurl.post(
        `/user-data/${userId}?page=2&type=edit`,
        {
          additionalDetails: { ...detailpersonal },
        }
      );
      setAgainCallFlag(true);
    
      toast.success(response.data.message);
      setIsOpen((prev) => !prev);
      const responses = await apiurl.get(`/auth/getUser/${userId}`);
      const userDatas = responses?.data?.user;
      dispatch(setUser({ userId, userDatas }));

    } catch (error) {
      toast.error("An error occurred while submitting form data.");
    }
  };

  const customErrorMessages = {
    height: "Height",
    weight: "Weight",

    currentlyLivingInCountry: "Country",

    relocationInFuture: "Relocation In Future",
    diet: "Diet",
    maritalStatus: "Marital Status",
    smoking: "Smoking",
    contact: "Contact",
    // email: "Email",
    alcohol: "Alcohol",
  };

  const handleBlurError = (e) => {
    const { value, name } = e.target;
    const errors = { ...formErrors };

    // Validate the input field when it loses focus
    if (!value.trim()) {
      errors[name] = `${customErrorMessages[name]} is required !`;
    } else {
      errors[name] = ""; // Clear the error message if the field is not empty
    }

    setFormErrors(errors);
  };

  // console.log(detailpersonal);

  const fetchData = async () => {
    const userDatas = profileData[1];
    if (userDatas) {
      const data = profileData[1];

      setDetailPersonal({
        height: data.height || "",
        weight: data.weight || "",
        relocationInFuture: data.relocationInFuture || "",
        diet: data.diet || "",
        maritalStatus: data.maritalStatus || "",
        smoking: data.smoking || "",
        contact: data.contact || "", // Integrate phone number into detailpersonal state
        email: data.email || "",
        alcohol: data.alcohol || "",
        currentlyLivingInCountry: data.currentlyLivingInCountry,
        currentlyLivingInState: data.currentlyLivingInState,
        currentlyLivingInCity: data.currentlyLivingInCity,
      });

      const perosnalData = profileData[1];
      setPersonalDatas([perosnalData]);
    }

    if (userDatas?.currentlyLivingInCountry) {
      const countryId = userDatas?.currentlyLivingInCountry;
      const mappedStates = state.map((item) => {
        if (item.country_id === countryId) {
          return {
            stateName: item.state_name,
            stateId: item.state_id,
          };
        }
      });
      setState(mappedStates);

      if (userDatas?.currentlyLivingInState) {
        const stateId = userDatas?.currentlyLivingInState;
        const cities = await getCitiesByState(countryId, stateId);
        const mappedCities = cities.map((item) => ({
          cityName: item.city_name,
          cityId: item.city_id,
        }));
        setCity(mappedCities);
      }
    }
  };
  useEffect(() => {
    fetchData();
    if (showProfile) {
      setIsOpen(false);
    }
  }, [showProfile, againCallFlag]);

  const maritalStatusMapping = {
    single: "Single",
    awaitingdivorce: "Awaiting Divorce",
    divorcee: "Divorcee",
    widoworwidower: "Widow or Widower",
    // Add other mappings as needed
  };
  const transformedMaritalStatus =
    maritalStatusMapping[personalDatas[0]?.maritalStatus] || "NA";
  return (
    <>
      <div className="shadow rounded-xl py-3 mt-9 my-5  w-full overflow-hidden">
        <span className="flex justify-between items-center text-primary px-10 py-2">
          <p className="  font-medium  text-[20px]">Personal Details</p>
          <span
            onClick={() => setIsOpen((prev) => !prev)}
            className="text-[20px] cursor-pointer flex items-center font-DMsans"
          >
            {!showProfile && (
              <>
                {!isOpen ? (
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
        <hr className="mx-9  " />
        <span className="md:flex sm:flex md:flex-row sm:flex-row items-baseline justify-between font-DMsans  px-10 text-start pb-8">
          <div className=" mt-4  text-[17px] mx-10 md:mx-0 sm:mx-0 md:w-1/2 sm:w-1/2">
            <p className="  font-medium "> Height</p>
            <p className=" font-light text-[15px]">
              {personalDatas[0]?.height
                ? personalDatas[0]?.height + "ft"
                : "NA"}
            </p>
            <p className="  font-medium pt-4"> Weight</p>
            <p className="font-light text-[15px]">
              {" "}
              {personalDatas[0]?.weight ? personalDatas[0]?.weight : "NA"} Kg
            </p>
            <p className=" pt-4 font-medium"> Presently Settled in Country</p>
            <p className="font-light text-[15px]">
              {" "}
              {personalDatas[0]?.countryatype
                ? personalDatas[0]?.countryatype
                : "NA"}{" "}
            </p>
            <p className=" pt-4 font-medium">Presently Settled in State</p>
            <p className="font-light text-[15px]">
              {/* {console.log({ detailpersonal })} */}
              {personalDatas[0]?.stateatype
                ? personalDatas[0]?.stateatype
                : "NA"}{" "}
            </p>
            <p className=" pt-4 font-medium">Presently Settled in City</p>
            <p className="font-light text-[15px]">
              {" "}
              {personalDatas[0]?.cityatype
                ? personalDatas[0]?.cityatype
                : "NA"}{" "}
            </p>
            <p className=" pt-4 font-medium">Open to Relocate in Future</p>
            <p className="font-light text-[15px]">
              {" "}
              {personalDatas[0]?.relocationInFuture
                ? personalDatas[0]?.relocationInFuture
                : "NA"}{" "}
            </p>
          </div>
          <div className="text-[17px] mt-4 mx-10 md:w-1/2 sm:w-1/2">
            <p className="  font-medium "> Diet</p>
            <p className="font-light text-[15px]">
              {" "}
              {personalDatas[0]?.dietatype
                ? personalDatas[0]?.dietatype
                : "NA"}{" "}
            </p>
            <p className=" pt-4 font-medium">Alcohol Consumption</p>
            <p className="font-light text-[15px]">
              {" "}
              {personalDatas[0]?.alcohol
                ? personalDatas[0]?.alcohol
                : "NA"}{" "}
            </p>
            <p className=" pt-4 font-medium"> Smoking Preference</p>
            <p className="font-light text-[15px]">
              {" "}
              {personalDatas[0]?.smoking
                ? personalDatas[0]?.smoking
                : "NA"}{" "}
            </p>
            <p className=" pt-4 font-medium">Martial Status</p>
            <p className="font-light text-[15px]">
              {" "}
              {transformedMaritalStatus}{" "}
            </p>

             {location?.state?.resCheck?.includes("resAllow") ||
            location?.state?.location?.includes("interests") ||
            location?.state?.location?.includes("chat") ||

            location?.state?.location?.includes("approval-lists") ||
            location?.state?.location?.includes("user") ||
            location.state?.AdminViewProfile?.includes("admin_View") ||
            location?.state?.location?.includes("user-dashboard") ||
            location?.state?.interestReq === true ? (
              <>
                <p className=" pt-4 font-medium">Contact Details</p>
                <p className="font-light text-[15px]">
                  {" "}
                  {detailpersonal.contact ? detailpersonal.contact : "NA"}
                </p>
                <p className=" pt-4 font-medium">Email Address</p>
                <p className="font-light text-[15px]">
                  {" "}
                  {profileData[0]?.createdBy[0]?.email? profileData[0]?.createdBy[0]?.email:"NA"}
                </p>
              </>
            ) : (
              <>
                <p className=" pt-4 font-medium">Contact Details</p>
                <p
                  onMouseEnter={handleMouseEnterInterest}
                  onMouseLeave={handleMouseLeaveInterest}
                  className="font-light text-[15px] cursor-pointer"
                >
                  {" "}
                  ************
                </p>
                {showInterestName && (
                  <div className="text-start flex items-center  absolute -mt-20 w-auto p-1 bg-white border  font-DMsans rounded-lg gap-2 text-primary ">
                    <LuUserPlus />
                    <p> Send interest request to see contact number</p>
                  </div>
                )}
                <p className=" pt-4 font-medium">Email Address</p>
                <p
                  onMouseEnter={handleMouseEnterProfile}
                  onMouseLeave={handleMouseLeaveProfile}
                  className="font-light text-[15px] cursor-pointer"
                >
                  {" "}
                  **************
                </p>
                {showProfileName && (
                  <div className="text-start  absolute -mt-16 w-auto p-1 bg-white border  font-DMsans rounded-lg flex items-center gap-2 text-primary">
                    <LuUserPlus />
                    <p> Send interest request to see email</p>
                  </div>
                )}
              </>
            )}
          </div>
        </span>

        {isOpen && (
          <>
            <span className="flex md:flex-row sm:flex-row flex-col  items-baseline justify-between sm:gap-9 md:gap-9 font-DMsans px-10 text-start pb-8 ">
              <span className="w-full">
                <label className="font-semibold mt-2 ">
                  {" "}
                  Height <span className="text-primary">*</span>
                </label>
                <HeightSlider
                value={convertFeetInchesToInches(detailpersonal.height)}
                  valueLabelDisplay="auto"
                  aria-label="pretto slider"
                  defaultValue={20}
                  className="mb-12"
  minValue={48} 
                  maxValue={84}
                  step={1}
                  onChange={handleSliderChange("height")}
                  onBlur={handleBlurError}
                />

                <label className="font-semibold  ">
                  Weight ( KGs ) <span className="text-primary">*</span>
                </label>
                <CustomSlider
                  value={detailpersonal.weight}
                  valueLabelDisplay="auto"
                  aria-label="pretto slider"
                  defaultValue={20}
                  minValue={35}
                  maxValue={150}
                  className="mb-6"
                  onChange={handleSliderChange("weight")}
                  onBlur={handleBlurError}
                />
                <div className="mt-6">
                  <span className="font-semibold    ">
                    {" "}
                    Presently Setteled in
                  </span>
                  <p className=" font-DMsans my-2 font-medium ">
                    Country <span className="text-primary">*</span>
                  </p>
                  <div className="mt-3">
                  <Autocomplete
                onChange={(event, newValue) =>
                  handleSelectChange(
                    event,
                    newValue ? newValue.country_id : "",
                    "country"
                  )
                }
                options={country}
                value={
                  country.find(
                    (option) =>
                      option.country_id === detailpersonal.currentlyLivingInCountry
                  ) || null
                }
                getOptionLabel={(option) => option.country_name}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Country"
                    InputLabelProps={{
                      shrink: !!detailpersonal.country || params.inputProps?.value,
                    }}
                    onFocus={handleFocus}
                    onBlur={() => {
                      handleBlur();
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                        {
                          border: "none",
                        },
                      backgroundColor: "#F0F0F0",
                    }}
                  />
                )}
              />
                  </div>
                  {/* {formErrors.currentlyLivingInCountry && <span className="text-red-500 font-DMsans">{formErrors.currentlyLivingInCountry}</span>} */}
                </div>

                <div className="mt-6 ">
                <Autocomplete
              onChange={(event, newValue) =>
                handleSelectChange(event, newValue.state_id, "state")
              }
              options={state.filter(
                (item) => item.country_id === detailpersonal.currentlyLivingInCountry
              )}
              value={
                state.find(
                  (option) => option.state_id === detailpersonal.currentlyLivingInState
                ) || null
              }
              getOptionLabel={(option) => option.state_name}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="State"
                  InputLabelProps={{
                    shrink: !!detailpersonal.state || params.inputProps?.value,
                  }}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  sx={{
                    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                      {
                        border: "none",
                      },
                    backgroundColor: "#F0F0F0",
                  }}
                />
              )}
            />
                </div>

                <div className="mt-6 mb-5">
                  <Autocomplete
                    onChange={(event, newValue) =>
                      handleSelectChange(event, newValue.cityId, "city")
                    }
                    options={city}
                    value={
                      city.find(
                        (option) =>
                          option.cityId ===
                          detailpersonal?.currentlyLivingInCity
                      ) || null
                    }
                    getOptionLabel={(option) => option.cityName}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="City"
                        InputLabelProps={{
                          shrink:
                            !!detailpersonal.city || params.inputProps?.value,
                        }}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        sx={{
                          "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                            {
                              border: "none",
                            },
                          backgroundColor: "#F0F0F0",
                        }}
                      />
                    )}
                  />
                </div>
                <RadioInput
                  options={relocationInFutureData.map((option, index) => ({
                    value: option,
                    label: option,
                  }))}
                  field="Open/Plan to Relocation in Future"
                  selectedValue={detailpersonal.relocationInFuture}
                  onChange={(value) =>
                    setDetailPersonal((prevState) => ({
                      ...prevState,
                      relocationInFuture: value,
                    }))
                  }
                />

                <RadioInput
                  options={dietData.map((option, index) => ({
                    value: index + 1,
                    label: option,
                  }))}
                  field="Diet Type"
                  selectedValue={detailpersonal.diet}
                  onChange={(value) => {
                    setDetailPersonal((prevState) => ({
                      ...prevState,
                      diet: value,
                    }));
                    // console.log(value);
                  }}
                />
              </span>

              <span className="w-full ">
                <RadioInput
                  options={alcohalData.map((option, index) => ({
                    value: option,
                    label: option,
                  }))}
                  field="Alcohol Consumption Preference"
                  selectedValue={detailpersonal.alcohol}
                  onBlur={handleBlurError}
                  onChange={(value) =>
                    setDetailPersonal((prevState) => ({
                      ...prevState,
                      alcohol: value,
                    }))
                  }
                />
                <div className="md:mt-10 sm:mt-10">
                  <RadioInput
                    options={smokingData.map((option, index) => ({
                      value: option,
                      label: option,
                    }))}
                    field="Smoking Preference"
                    selectedValue={detailpersonal.smoking}
                    onBlur={handleBlurError}
                    onChange={(value) =>
                      setDetailPersonal((prevState) => ({
                        ...prevState,
                        smoking: value,
                      }))
                    }
                  />
                </div>

                <RadioInput
                  options={maritalData.map((option, index) => ({
                    value: option,
                    label: CapitalmaritalData[index],
                  }))}
                  field="Marital Status"
                  selectedValue={detailpersonal.maritalStatus}
                  onBlur={handleBlurError}
                  onChange={(value) =>
                    setDetailPersonal((prevState) => ({
                      ...prevState,
                      maritalStatus: value,
                    }))
                  }
                />
              </span>
            </span>
            <div className="flex items-center justify-end gap-5 mx-9 mb-9 font-DMsans">
              <span
                onClick={() => setIsOpen((prev) => !prev)}
                className="border border-primary text-primary px-5 rounded-md py-2 cursor-pointer"
              >
                Cancel
              </span>
              <span
                onClick={() => {
                  handleSubmitForm2();
                }}
                className="bg-primary text-white px-7 rounded-md py-2 cursor-pointer"
              >
                Save
              </span>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default PersonalDetail;
