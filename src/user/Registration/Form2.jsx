import React, { useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";
import { setStep, selectStepper } from "../../Stores/slices/Regslice";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { setUser, userDataStore } from "../../Stores/slices/AuthSlice";
import { convertFeetInchesToInches, convertToFeetInches, convertToFeetInchesDecimal } from "../../common/common.js";

// import {
//   setUser,
//   userDataStore,
// } from "../../Stores/slices/AuthSlice";
import apiurl from "../../util";
import {
  getCitiesByState,
  getCountries,
  getLabel,
  getStatesByCountry,
} from "../../common/commonFunction.js";
import CustomSlider, { HeightSlider } from "../../components/CustomSlider.jsx";
import { getFormData } from "../../Stores/service/Genricfunc.jsx";
import { selectGender } from "../../Stores/slices/formSlice.jsx";
import { toast } from "react-toastify";
import { Autocomplete, TextField } from "@mui/material";
import {
  setUserAddedbyAdminId,
  setUserDataAddedbyAdmin
} from "../../Stores/slices/Admin.jsx";
import RegError from "../../components/RegError.jsx";
import { RadioInput } from "../../components/CustomInput.jsx";
const Form2 = ({ page, stateCheck }) => {
  const { country, state } = useSelector((state) => state.masterData);
  const [formtwo, setFormtwo] = useState({
    height: "",
    weight: "",
    personalAppearance: "",
    currentlyLivingInCountry: "",
    currentlyLivingInState: "",
    currentlyLivingInCity: "",
    relocationInFuture: "",
    diet: "",
    maritalStatus: "",
    smoking: "",
    contact: "", // Integrate phone number into formtwo state
    // email: "",
    alcohol: "",
  });

  useEffect(() => {
    if (stateCheck !== "passPage") {
      <RegError />;
    }
  }, [stateCheck]);
  const { userId } = useSelector(userDataStore);
  const dispatch = useDispatch();
  const { currentStep } = useSelector(selectStepper);
  const { admin } = useSelector((state) => state.admin);

  const [valid, setValid] = useState(true);
  const [states, setState] = useState([]);
  const [city, setCity] = useState([]);
  const location = useLocation();
  // const [isEmailValid, setEmailValid] = useState("");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();
  const { userAddedbyAdminId } = useSelector((state) => state.admin);
  let userIdData;
  if (admin === "new") {
    userIdData = userId;
  } else {
    userIdData = userAddedbyAdminId.userAddedbyAdminId;
  }
  const handleFocus = () => {
    setIsFocused(true);
  };
  const handleBlur = () => {
    setIsFocused(false);
  };

  const prevForm = () => {
    dispatch(setStep(currentStep - 1));
  };
  const handleinput = (e) => {
    const { value, name } = e.target;

    setFormtwo((log) => ({
      ...log,
      [name]: value,
    }));
  };
  //sliderChange
  const handleSliderChange = (name) => (event, newValue) => {
    setFormtwo((log) => ({
      ...log,
      [name]: name === "height" ? convertToFeetInchesDecimal(newValue) : newValue,
    }));
  };
  const handleSelectChange = (event, values, field) => {
    if (values === "Open to all") {
      if (field === "country") {
        setFormtwo((prevValues) => ({
          ...prevValues,
          currentlyLivingInCountry: country.map((option) => option.country_id),
          currentlyLivingInState: "",
          currentlyLivingInCity: "",
        }));
        setState([]);
        setCity([]);
      } else if (field === "state") {
        setFormtwo((prevValues) => ({
          ...prevValues,
          currentlyLivingInState: "",
          currentlyLivingInCity: "",
        }));
        setCity([]);
      }
    } else {
      setFormtwo((prevValues) => ({
        ...prevValues,
        [field]: values,
      }));
      if (field === "country") {
        setFormtwo((prevValues) => ({
          ...prevValues,
          currentlyLivingInCountry: values,
          currentlyLivingInState: "",
          currentlyLivingInCity: "",
        }));

        // .catch((error) => console.error("Error fetching states:", error));
      } else if (field === "state") {
        setFormtwo((prevValues) => ({
          ...prevValues,
          currentlyLivingInState: values,
          currentlyLivingInCity: "",
        }));
        getCitiesByState(formtwo.placeOfBirthCountry, values).then((cities) => {
          setCity(
            cities.map((item) => ({
              cityName: item.city_name,
              cityId: item.city_id,
            }))
          );
        });
        // .catch((error) => console.error("Error fetching cities:", error));
      } else if (field === "city") {
        // Add this condition
        setFormtwo((prevValues) => ({
          ...prevValues,
          currentlyLivingInCity: values, // Set placeOfBirthCity to values
        }));
      }
    }
  };

  useEffect(() => {
    dispatch(setStep(page));
  }, []);

  useEffect(() => {
    dispatch(setStep(page));
  }, []);
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
    currentlyLivingInCountry: "",
    currentlyLivingInState: "",
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

    if (!formtwo.currentlyLivingInCountry) {
      errors.currentlyLivingInCountry = "Country is required";
      hasErrors = true;
    }
    if (!formtwo.currentlyLivingInState) {
      errors.currentlyLivingInState = "Country is required";
      hasErrors = true;
    }

    if (!formtwo.relocationInFuture) {
      errors.relocationInFuture = "Relocation In Future is required";
      hasErrors = true;
    }
    if (!formtwo.diet) {
      errors.diet = "Diet is required";
      hasErrors = true;
    }
    if (!formtwo.maritalStatus) {
      errors.maritalStatus = "Marital Status is required";
      hasErrors = true;
    }
    if (!formtwo.smoking) {
      errors.smoking = "Smoking is required";
      hasErrors = true;
    }
    if (typeof formtwo.contact !== "string" || !formtwo.contact.trim()) {
      errors.contact = "Contact number is required";
      hasErrors = true;
    }
    // if (typeof formtwo.email !== "string" || !formtwo.email.trim()) {
    //   errors.email = "Email is required";
    //   hasErrors = true;
    // }

    setFormErrors(errors);
    return !hasErrors;
  };

  const handleSubmitForm2 = async () => {
    if (!validateForm()) {
      toast.error("Please fill in all required fields.");
      return;
    }
    // if (emailRegex.test(formtwo.email)) {
    //   setEmailValid("");
    // } else {
    //   setEmailValid("Please Enter a Valid Email");
    //   return;
    // }
    try {
      const response = await apiurl.post(`/user-data/${userIdData}?page=2`, {
        additionalDetails: { ...formtwo },
      });
      toast.success(response.data.message);
      if (admin === "new") {
        dispatch(setUser({ userData: { ...response.data.user } }));
      } else if (admin === "adminAction") {
        dispatch(setUserDataAddedbyAdmin(response.data.user));

        dispatch(
          setUserAddedbyAdminId({
            userAddedbyAdminId: response?.data?.user?._id,
          })
        );
      }
      return response.status;
      // console.log("Form submitted successfully:", response.data);
    } catch (error) {
      // console.error("Error submitting form data:", error);
      toast.error("An error occurred while submitting form data.");
    }
  };

  // Before form submission in handleNext function
  // console.log("Form data before submission:", formtwo);
  const passPage = "passPage";
  const handleNext = async () => {
    if (!validateForm()) {
      toast.error("Please fill in all required fields.");
      return;
    }
    const res = await handleSubmitForm2();
    if (res === 200) {
      navigate(`/registration-form/3`, { state: "passPage" });
      window.scrollTo(0, 0);
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const formData = await getFormData(userIdData, page);
        // console.log(formData?.additionalDetails);
        setFormtwo({
          ...formData.additionalDetails,
        });

        if (formData.additionalDetails.currentlyLivingInCountry) {
          const countryId = formData.additionalDetails.currentlyLivingInCountry;
          const mappedStates = states.map((item) => {
            if (item.country_id === countryId) {
              return {
                stateName: item.state_name,
                stateId: item.state_id,
              };
            }
          });
          setState(mappedStates);

          if (formData.additionalDetails.currentlyLivingInState) {
            const stateId = formData.additionalDetails.currentlyLivingInState;
            const cities = await getCitiesByState(countryId, stateId);
            const mappedCities = cities.map((item) => ({
              cityName: item.city_name,
              cityId: item.city_id,
            }));
            setCity(mappedCities);
          }
           if (formData.additionalDetails && formData.additionalDetails.height) {
                              formData.additionalDetails.height = convertToFeetInches(formData.additionalDetails.height);
                            }
        }
      } catch (error) {
        // console.log(error);
      }
    };

    fetchData();
  }, [userIdData, page]);

  // console.log(formtwo);

  return (
    <>
      {location.state === "passPage" && (
        <div className="bg-[#FCFCFC] md:mx-0 sm:mx-28 md:px-9 px-5 sm:px-6 py-12 rounded-xl shadow ">
          <label className="font-semibold mt-2 ">
            {" "}
            {getLabel()} Height
             <span className="text-primary">*</span>
          </label>
          <HeightSlider
           value={convertFeetInchesToInches(formtwo.height)}
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
            {getLabel()} Weight ( KGs ) 
            <span className="text-primary">*</span>
          </label>
          <CustomSlider
            value={formtwo.weight}
            valueLabelDisplay="auto"
            aria-label="pretto slider"
            defaultValue={20}
            minValue={35}
            maxValue={150}
            className="mb-6"
            onChange={handleSliderChange("weight")}
            onBlur={handleBlurError}
          />
          <label className="font-semibold  ">
            {" "}
            {getLabel()} Personal Appearance{" "}
            <span className="font-normal text-[#414141]">(Optional)</span>
          </label>
          <span className="flex flex-row mt-3">
            <textarea
              onChange={(e) => handleinput(e)}
              className="p-2 w-full bg-[#F0F0F0] mt-1 outline-0 h-[30vh] border focus:border-[#CC2E2E]  rounded-md mb-3"
              type="text"
              name="personalAppearance"
              value={formtwo.personalAppearance}
              placeholder="Write about yourself...."
              onBlur={handleBlurError}
            />
          </span>
          {/* {formErrors.personalAppearance && <span className="text-red-500 font-DMsans">{formErrors.personalAppearance}</span>} */}
          <div className="mt-6">
            <span className="font-semibold    ">
              {" "}
              {getLabel()} Presently Setteled in
            </span>
            <p className=" font-DMsans my-2 font-medium ">
              Country 
              {/* <span className="text-primary">*</span> */}
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
                      option.country_id === formtwo.currentlyLivingInCountry
                  ) || null
                }
                getOptionLabel={(option) => option.country_name}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Country"
                    InputLabelProps={{
                      shrink: !!formtwo.country || params.inputProps?.value,
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
                (item) => item.country_id === formtwo.currentlyLivingInCountry
              )}
              value={
                state.find(
                  (option) => option.state_id === formtwo.currentlyLivingInState
                ) || null
              }
              getOptionLabel={(option) => option.state_name}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="State"
                  InputLabelProps={{
                    shrink: !!formtwo.state || params.inputProps?.value,
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
                  (option) => option.cityId === formtwo.currentlyLivingInCity
                ) || null
              }
              getOptionLabel={(option) => option.cityName}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="City"
                  InputLabelProps={{
                    shrink: !!formtwo.city || params.inputProps?.value,
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
            label={getLabel()}
            options={relocationInFutureData.map((option, index) => ({
              value: option,
              label: option,
            }))}
            field="Plan to Relocation in Future"
            selectedValue={formtwo.relocationInFuture}
            onChange={(value) =>
              setFormtwo((prevState) => ({
                ...prevState,
                relocationInFuture: value,
              }))
            }
          />

          <RadioInput
            label={getLabel()}
            options={dietData.map((option, index) => ({
              value: index + 1,
              label: option,
            }))}
            field="Diet Type"
            selectedValue={formtwo.diet}
            onChange={(value) => {
              setFormtwo((prevState) => ({ ...prevState, diet: value }));
              // console.log(value);
            }}
          />

          <RadioInput
            label={getLabel()}
            options={alcohalData.map((option, index) => ({
              value: option,
              label: option,
            }))}
            field="Alcohol Consumption Preference"
            selectedValue={formtwo.alcohol}
            onBlur={handleBlurError}
            onChange={(value) =>
              setFormtwo((prevState) => ({ ...prevState, alcohol: value }))
            }
          />
          <RadioInput
            label={getLabel()}
            options={smokingData.map((option, index) => ({
              value: option,
              label: option,
            }))}
            field="Smoking Preference"
            selectedValue={formtwo.smoking}
            onBlur={handleBlurError}
            onChange={(value) =>
              setFormtwo((prevState) => ({
                ...prevState,
                smoking: value,
              }))
            }
          />
          <RadioInput
            label={getLabel()}
            options={maritalData.map((option, index) => ({
              value: option,
              label: CapitalmaritalData[index],
            }))}
            field="Marital Status"
            selectedValue={formtwo.maritalStatus}
            onBlur={handleBlurError}
            onChange={(value) =>
              setFormtwo((prevState) => ({
                ...prevState,
                maritalStatus: value,
              }))
            }
          />
          <div className="relative pb-4">
            <label
              htmlFor="username"
              className="block  font-semibold text-[#262626] font-DMsans text-start mb-2 mt-2"
            >
              {getLabel()} Contact Number{" "}
              <span className="text-primary">*</span>
            </label>
            <label>
              <PhoneInput
                className="mt-3 mb-9 "
                containerStyle={{ width: "110%" }}
                buttonStyle={{ width: "0%", backgroundColor: "transparent" }}
                inputStyle={{
                  width: "91%",
                  height: "3rem",
                  backgroundColor: "#F0F0F0",
                }}
                value={formtwo.contact}
                // Use contact instead of phoneNumber
                onChange={(value) =>
                  handleinput({ target: { name: "contact", value } })
                } // Call handleinput with an object simulating an event
                inputProps={{
                  required: true,
                }}
              />
            </label>
            {!valid && (
              <p className="text-start text-[12px] text-red-600">
                Please enter a valid phone number*
              </p>
            )}
            <span className="text-primary text-[13px] font-DMsans absolute top-24">
             This number will be visible on your profile along with your registered email id for people to connect.
            </span>
          </div>

          {/* <div className="flex flex-col mb-2 ">
            <label htmlFor="name" className="font-semibold mb-1 md:mt-3  mt-8">
              {getLabel()} Email <span className="text-primary">*</span>
            </label>
            <input
              value={formtwo.email}
              onChange={(e) => handleinput(e)}
              className="p-2  bg-[#F0F0F0] mt-1 outline-0 h-[55px] border focus:border-[#CC2E2E]  rounded-md mb-3"
              type="email"
              name="email"
              onBlur={handleBlurError}
              placeholder="Enter your email"
              id="name"
            />
          </div> */}
          {/* <p className="text-primary text-[13px] font-DMsan">{isEmailValid}</p> */}
          <div className="mt-9 flex justify-center  items-center md:gap-16 gap-3 px-12">
            <Link
              to={`/registration-form/1`}
              state={passPage}
              onClick={prevForm}
              className="px-3 py-2 md:text-lg rounded-md w-full text-white text-center background"
            >
              Previous
            </Link>

            <button
              onClick={handleSubmitForm2}
              className="px-3 py-2 md:text-lg rounded-md w-full text-white text-center background"
            >
              Save
            </button>
            <span
              onClick={handleNext}
              className="px-3 cursor-pointer py-2 md:text-lg rounded-md w-full text-white text-center background"
            >
              Next
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default Form2;
