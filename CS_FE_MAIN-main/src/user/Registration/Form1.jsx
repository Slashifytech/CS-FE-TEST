import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";
import { useDispatch, useSelector } from "react-redux";
import { setStep } from "../../Stores/slices/Regslice";
import apiurl from "../../util";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { setUser, userDataStore } from "../../Stores/slices/AuthSlice";
import { getCitiesByState, getLabel } from "../../common/commonFunction.js";
import { RadioInput, TextInput } from "../../components/CustomInput.jsx";
import { getFormData } from "../../Stores/service/Genricfunc.jsx";
import { selectGender } from "../../Stores/slices/formSlice.jsx";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { Autocomplete, TextField } from "@mui/material";
import { setUserAddedbyAdminId } from "../../Stores/slices/Admin.jsx";

const Form1 = ({ page }) => {
  const { country, state } = useSelector((state) => state.masterData);
  const dispatch = useDispatch();
  const { admin } = useSelector((state) => state.admin);
  let userIdData;
  const { userData, userId } = useSelector(userDataStore);
  const { userAddedbyAdminId } = useSelector((state) => state.admin);
  if (admin === "new") {
    userIdData = userId;
  } else {
    userIdData = userAddedbyAdminId.userAddedbyAdminId;
  }
  // console.log(userIdData);
  const gender = useSelector(selectGender);
  const [states, setState] = useState([]);
  const [city, setCity] = useState([]);
  const [formone, setFormone] = useState({
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
  });

  const navigate = useNavigate();
  const handleSelectChange = (event, values, field) => {
    if (values === "Open to all") {
      if (field === "country") {
        setFormone((prevValues) => ({
          ...prevValues,
          placeOfBirthCountry: country.map((option) => option.country_id),
          placeOfBirthState: "",
          placeOfBirthCity: "",
        }));
        setState([]);
        setCity([]);
      } else if (field === "state") {
        setFormone((prevValues) => ({
          ...prevValues,
          placeOfBirthState: "",
          placeOfBirthCity: "",
        }));
        setCity([]);
      }
    } else {
      setFormone((prevValues) => ({
        ...prevValues,
        [field]: values,
      }));
      if (field === "country") {
        setFormone((prevValues) => ({
          ...prevValues,
          placeOfBirthCountry: values,
          placeOfBirthState: "",
          placeOfBirthCity: "",
        }));
      } else if (field === "state") {
        setFormone((prevValues) => ({
          ...prevValues,
          placeOfBirthState: values,
          placeOfBirthCity: "",
        }));
        getCitiesByState(formone.placeOfBirthCountry, values).then((cities) => {
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
        setFormone((prevValues) => ({
          ...prevValues,
          placeOfBirthCity: values, // Set placeOfBirthCity to values
        }));
      }
    }
  };

  useEffect(() => {
    dispatch(setStep(page));
  }, []);

  // const getDateYearsAgo = (yearsAgo) => {
  const today = new Date();
  const date21YearsAgo = new Date(today.setFullYear(today.getFullYear() - 21));

  //   today.setFullYear(today.getFullYear() - yearsAgo);
  //   const year = today.getFullYear();
  //   const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  //   const day = String(today.getDate()).padStart(2, "0");
  //   return `${year}-${month}-${day}`;
  // };

  // // Get the date 21 years ago
  // const date21YearsAgo = getDateYearsAgo(21);
  const handleinput = (e) => {
    const { value, name, type } = e.target;

    let isValid = true;

    if (type === "text") {
      const regex = /^[A-Za-z\s]*$/;
      if (!regex.test(value)) {
        isValid = false;
        toast.error("Please enter only alphabetic characters");
      }
    } else if (type === "email") {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!regex.test(value)) {
        isValid = false;
      }
    } else if (type === "number") {
      const regex = /^\d+$/;
      if (!regex.test(value)) {
        isValid = false;
      }
    } else if (type === "time") {
      // Basic time validation (optional, HTML5 input type="time" already handles this)
      const regex = /^\d{2}:\d{2}$/;
      if (!regex.test(value)) {
        isValid = false;
        toast.error("Please enter a valid time in HH:MM format");
      }
    }

    if (isValid) {
      setFormone((log) => ({
        ...log,
        [name]: value,
      }));
    }
  };

  const twentyOneYearsAgo = dayjs().subtract(21, "year");
  const handleDateChange = (date) => {
    const formattedDate = date ? dayjs(date).format("YYYY-MM-DD") : null;

    setFormone((log) => ({
      ...log,
      dateOfBirth: formattedDate,
    }));
  };
  const handleTime = (time) => {
    const formattedTime = time ? time.format("HH:mm A") : null;
    setFormone((prevValues) => ({
      ...prevValues,
      timeOfBirth: formattedTime,
    }));
  };

  const [formErrors, setFormErrors] = useState({
    fname: "",
    lname: "",
    dateOfBirth: "",
    timeOfBirth: "",
    placeOfBirthCountry: "",
    placeOfBirthState: "",
    placeOfBirthCity: "",
    manglik: "",
    horoscope: "",
  });
  const [isFocused, setIsFocused] = useState(false);
  const handleFocus = () => {
    setIsFocused(true);
  };

  const validateForm = () => {
    const errors = {};
    let hasErrors = false;

    // Check each required field
    if (!formone.fname) {
      errors.fname = "First name is required";
      hasErrors = true;
    }
    if (!formone.lname) {
      errors.lname = "Last name is required";
      hasErrors = true;
    }
    if (!formone.dateOfBirth) {
      errors.dateOfBirth = "Date of birth is required";
      hasErrors = true;
    } 
    
    if (!formone.timeOfBirth) {
      errors.timeOfBirth = "Time of birth is required";
      hasErrors = true;
    }
    if (!formone.placeOfBirthCountry) {
      errors.placeOfBirthCountry = "Country name is required";
      hasErrors = true;
    }
    if (!formone.placeOfBirthState) {
      errors.placeOfBirthState = "State name is required";
      hasErrors = true;
    }
    if (!formone.placeOfBirthCity) {
      errors.placeOfBirthCity = "City name is required";
      hasErrors = true;
    }
    if (!formone.manglik) {
      errors.manglik = "Manglik is required";
      hasErrors = true;
    }

    if (!formone.horoscope) {
      errors.horoscope = "horoscope is required";
      hasErrors = true;
    }

    setFormErrors(errors);
    return !hasErrors;
  };

  const handleSubmitForm1 = async () => {
    if (!validateForm()) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (!validateForm()) {
      toast.error("Please fill in all required fields.");
      return;
    }
    try {
      const response = await apiurl.post(`/user-data/${userIdData}?page=1`, {
        basicDetails: { ...formone },
      });
      toast.success(response.data.message);
      if (admin === "new") {
        dispatch(setUser({ userData: { ...response.data.user } }));
      } else if (admin === "adminAction") {
        dispatch(
          setUserAddedbyAdminId({
            userAddedbyAdminId: response?.data?.user?._id,
          })
        );
      }
      return response.status;
    } catch (error) {
      toast.error(error.response?.data?.message || "Error submitting form");
      console.error("Error submitting form:", error);
      return;
    }
  };
  const passPage = "passPage";
  const handleNext = async () => {
    if (!validateForm()) {
      toast.error("Please fill in all required fields.");
      return;
    }
    const res = await handleSubmitForm1();
    if (res === 200) {
      navigate(`/registration-form/${parseInt(page) + 1}`, { state: passPage });
      window.scrollTo(0, 0);
    }
  };
  // console.log(location, "location")
  const customErrorMessages = {
    fname: "First name",
    lname: "Last name",
    dateOfBirth: "Date of birth",
    timeOfBirth: "Time of birth",
    placeOfBirthCountry: "Country",

    manglik: "Manglik status",
    horoscope: "Horoscope matching",
  };

  const handleBlur = (e) => {
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
    dispatch(setStep(page));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const formData = await getFormData(userIdData, page);

        setFormone(formData.basicDetails);
        if (formData.basicDetails.name) {
          const [fname, mname, lname] = formData.basicDetails.name.split(" ");

          // console.log((DateTime() + "T" + timeFormat(timeOfBirths)))
          // console.log(mname);
          setFormone((prevValues) => ({
            ...prevValues,
            fname: fname || "",
            mname: mname == "undefined" ? "" : mname,
            lname: lname || "",
            timeOfBirth: formData?.basicDetails?.timeOfBirth,
            placeOfBirthCountry: formData.basicDetails.placeOfBirthCountry,
            placeOfBirthState: formData.basicDetails.placeOfBirthState,
            placeOfBirthCity: formData.basicDetails.placeOfBirthCity,
          }));
        }

        if (formData.basicDetails.placeOfBirthState) {
          const stateId = formData.basicDetails.placeOfBirthState;
          const cities = await getCitiesByState(stateId, stateId);
          const mappedCities = cities.map((item) => ({
            cityName: item.city_name,
            cityId: item.city_id,
          }));
          setCity(mappedCities);
        }
      } catch (error) {
        // console.log(error);
      }
    };

    fetchData();
  }, [userIdData, page]);
  // console.log(userId);

  const manglikData = ["yes", "no", "partial", "notsure"];

  const formatOption = (option) => {
    if (option === "notsure") {
      return "Not Sure";
    }
    return option.charAt(0).toUpperCase() + option.slice(1);
  };

  const capitalizedManglikData = manglikData.map(formatOption);
  {
    userData?.createdFor === "myself" ? "My" : "na";
  }

  const horoscopeData = ["Required", "Not Required", "Not Important"];
  const selectedDate = formone?.dateOfBirth
    ? dayjs(formone.dateOfBirth, "MM/DD/YYYY")
    : "";
  return (
    <>
      <>
        <div className="bg-[#FCFCFC] sm:mx-12 md:mx-0 px-9 py-12 rounded-xl shadow ">
          <TextInput
            label={getLabel()}
            type="text"
            name="fname"
            value={formone.fname}
            onChange={handleinput}
            onBlur={handleBlur}
            error={formErrors.fname}
            placeholder="First Name "
          />

          <div className="flex flex-col mb-5">
            <label className="font-semibold">
              {getLabel()} Middle Name{" "}
              <span className="font-normal text-[#414141]">(Optional)</span>
            </label>
            <input
              value={formone.mname}
              onChange={handleinput}
              className={`p-2 bg-[#F0F0F0] mt-1 outline-0 md:h-[55px] w-full border focus:border-[#CC2E2E] rounded-md 
          }`}
              type="text"
              name="mname"
              placeholder="Middle Name"
            />
          </div>

          {/* Last Name */}
          <TextInput
            label={getLabel()}
            type="text"
            name="lname"
            value={formone.lname}
            onChange={handleinput}
            onBlur={handleBlur}
            error={formErrors.lname}
            placeholder="Last Name "
          />

          {/* Date of Birth */}

          <div className=" w-full mb-5 relative">
            <label className="font-semibold">
              {getLabel()} Date of Birth <span className="text-primary">*</span>
            </label>
            <div className="mt-2">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DatePicker"]}>
                  <DatePicker
                    value={selectedDate}
                    label="Date of Birth"
                    maxDate={twentyOneYearsAgo} // Prevent selection of dates less than 21 years ago
                    disableFuture
                    onChange={handleDateChange}
                    className="w-full time"
                  />
                </DemoContainer>
              </LocalizationProvider>
            </div>

            <div className="flex flex-col mb-5 mt-6 relative">
              <label className="font-semibold">
                {getLabel()} Time of Birth{" "}
                <span className="text-primary">*</span>
              </label>
              <div className="w-[100%] sm:w-[100%] md:w-[100%]">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["TimePicker"]}>
                    <TimePicker
                      className="time w-full font-DMsans "
                      value={dayjs(formone?.timeOfBirth, "hh:mm A")}
                      onChange={(e) => handleTime(e)}
                      onBlur={(e) => handleBlur(e)}
                      viewRenderers={{
                        hours: renderTimeViewClock,
                        minutes: renderTimeViewClock,
                        seconds: renderTimeViewClock,
                      }}
                    />
                  </DemoContainer>
                </LocalizationProvider>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <span className="font-semibold    ">
              {getLabel()} Place of Birth{" "}
              <span className="text-primary">*</span>
            </span>

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
                      option.country_id === formone.placeOfBirthCountry
                  ) || null
                }
                getOptionLabel={(option) => option.country_name}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Country"
                    InputLabelProps={{
                      shrink: !!formone.country || params.inputProps?.value,
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
          </div>

          <div className="mt-6">
            <Autocomplete
              onChange={(event, newValue) =>
                handleSelectChange(event, newValue.state_id, "state")
              }
              options={state.filter(
                (item) => item.country_id === formone.placeOfBirthCountry
              )}
              value={
                state.find(
                  (option) => option.state_id === formone.placeOfBirthState
                ) || null
              }
              getOptionLabel={(option) => option.state_name}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="State"
                  InputLabelProps={{
                    shrink: !!formone.state || params.inputProps?.value,
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
                  (option) => option.cityId === formone.placeOfBirthCity
                ) || null
              }
              getOptionLabel={(option) => option.cityName}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="City"
                  InputLabelProps={{
                    shrink: !!formone.city || params.inputProps?.value,
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
            options={manglikData.map((option, index) => ({
              value: option, // original value for state
              label: capitalizedManglikData[index], // capitalized label for display
            }))}
            field="Manglik Status"
            selectedValue={formone.manglik}
            onChange={(value) =>
              setFormone((prevValues) => ({ ...prevValues, manglik: value }))
            }
          />
          <RadioInput
            label={getLabel()}
            options={horoscopeData.map((option) => ({
              value: option,
              label: option,
            }))}
            field="Horoscope Matching"
            selectedValue={formone.horoscope}
            onChange={(value) =>
              setFormone((prevValues) => ({ ...prevValues, horoscope: value }))
            }
          />
          <div className="mt-9 flex justify-center items-center gap-16 px-12">
            <button
              className="px-3 py-2 text-lg rounded-md w-full text-white text-center background"
              onClick={handleSubmitForm1}
            >
              Save
            </button>
            <Link
              className="px-3 py-2 text-lg rounded-md w-full text-white text-center background"
              onClick={handleNext}
            >
              Next
            </Link>
          </div>
        </div>
      </>
    </>
  );
};

export default Form1;
