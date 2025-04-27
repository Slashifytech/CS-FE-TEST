import React, { useEffect, useMemo, useState } from "react";

import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { FiEdit } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { Autocomplete, TextField } from "@mui/material";
import { setUser, userDataStore } from "../../Stores/slices/AuthSlice";
import { RadioInput, TextInput } from "../../components/CustomInput";
import {
  getCitiesByState,
  getStatesByCountry,
} from "../../common/commonFunction";

import { selectGender } from "../../Stores/slices/formSlice";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import apiurl, { capitalizeWord } from "../../util";
const BasicDetail = ({
  showProfile,
  profileData,
  setIsUserData,
  setAgainCallFlag,
  againCallFlag,
}) => {
  const { state, country } = useSelector((state) => state.masterData);
  const dispatch = useDispatch();
  const { userId } = useSelector(userDataStore);
  const [basicDetailsData, setBsicDetailsData] = useState([]);
  const [basicData, setBasicData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [states, setState] = useState([]);
  const gender = useSelector(selectGender);
  const [city, setCity] = useState([]);
  const [detailBasic, setDetailBasic] = useState({
    fname: "",
    mname: "",
    lname: "",
    dateOfBirth: "",
    age: 0,
    timeOfBirth: "",
    placeOfBirthCountry: "",
    placeOfBirthState: "",
    placeOfBirthCity: "",
    post: "",
    manglik: "",
    horoscope: "",
  });
  const handleSelectChange = (event, values, field) => {
    if (values === "Open to all") {
      if (field === "country") {
        setDetailBasic((prevValues) => ({
          ...prevValues,
          placeOfBirthCountry: country.map((option) => option.country_id),
          placeOfBirthState: "",
          placeOfBirthCity: "",
        }));
        setState([]);
        setCity([]);
      } else if (field === "state") {
        setDetailBasic((prevValues) => ({
          ...prevValues,
          placeOfBirthState: "",
          placeOfBirthCity: "",
        }));
        setCity([]);
      }
    } else {
      setDetailBasic((prevValues) => ({
        ...prevValues,
        [field]: values,
      }));
      if (field === "country") {
        setDetailBasic((prevValues) => ({
          ...prevValues,
          placeOfBirthCountry: values,
          placeOfBirthState: "",
          placeOfBirthCity: "",
        }));

        // .catch((error) => console.error("Error fetching states:", error));
      } else if (field === "state") {
        setDetailBasic((prevValues) => ({
          ...prevValues,
          placeOfBirthState: values,
          placeOfBirthCity: "",
        }));
        getCitiesByState(detailBasic.placeOfBirthCountry, values).then(
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
        setDetailBasic((prevValues) => ({
          ...prevValues,
          placeOfBirthCity: values, // Set placeOfBirthCity to values
        }));
      }
    }
  };

  const handleinput = (e) => {
    const { value, name, type } = e.target;

    let isValid = true;

    if (type === "text") {
      // Only allow alphabets for text inputs
      const regex = /^[A-Za-z\s]*$/;
      if (!regex.test(value)) {
        isValid = false;
      }
    } else if (type === "email") {
      // Basic email validation
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!regex.test(value)) {
        isValid = false;
      }
    } else if (type === "number") {
      // Basic number validation (optional, HTML5 input type="number" already handles this)
      const regex = /^\d+$/;
      if (!regex.test(value)) {
        isValid = false;
      }
    }

    if (isValid) {
      setDetailBasic((log) => ({
        ...log,
        [name]: value,
      }));
    }
  };
  const twentyOneYearsAgo = dayjs().subtract(21, "year");
  const handleDateChange = (date) => {
    const formattedDate = date ? dayjs(date).format("YYYY-MM-DD") : null;

    setDetailBasic((log) => ({
      ...log,
      dateOfBirth: formattedDate,
    }));
  };

  const handleTime = (time) => {
    const formattedTime = time ? time.format("HH:mm A") : null;
    setDetailBasic((prevValues) => ({
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
    if (!detailBasic.fname) {
      errors.fname = "First name is required";
      hasErrors = true;
    }
    if (!detailBasic.lname) {
      errors.lname = "Last name is required";
      hasErrors = true;
    }
    if (!detailBasic.placeOfBirthCountry) {
      errors.placeOfBirthCountry = "Country name is required";
      hasErrors = true;
    }
    if (!detailBasic.placeOfBirthState) {
      errors.placeOfBirthState = "State name is required";
      hasErrors = true;
    }
    if (!detailBasic.placeOfBirthCity) {
      errors.placeOfBirthCity = "City name is required";
      hasErrors = true;
    }
    if (!detailBasic.dateOfBirth) {
      errors.dateOfBirth = "Date of birth is required";
      hasErrors = true;
    }
    // } else {
    //   // Check if date of birth indicates the user is at least 21 years old
    //   const today = dayjs();
    //   const dob = dayjs(detailBasic.dateOfBirth);
    //   const age = today.diff(dob, "year");
    //   if (age < 21) {
    //     errors.dateOfBirth = "You must be at least 21 years old";
    //     toast.error("You must be at least 21 years old");
    //     hasErrors = true;
    //   }
    // }
    if (!detailBasic.timeOfBirth) {
      errors.timeOfBirth = "Time of birth is required";
      hasErrors = true;
    }
    if (!detailBasic.manglik) {
      errors.manglik = "Manglik is required";
      hasErrors = true;
    }

    if (!detailBasic.horoscope) {
      errors.horoscope = "horoscope is required";
      hasErrors = true;
    }

    setFormErrors(errors); // Update the form errors state
    return !hasErrors; // Return true if there are no errors
  };
  const handleSubmitForm1 = async () => {
    if (!validateForm()) {
      toast.error("Please fill in all required fields.");
      setIsOpen((prev) => prev);
      return;
    }

    try {
      const response = await apiurl.post(
        `/user-data/${userId}?page=1&type=edit`,
        {
          basicDetails: { ...detailBasic },
        }
      );

      setAgainCallFlag(true);
      toast.success(response?.data?.message);

      fetchData();
      setIsUserData(true);
      setIsOpen((prev) => !prev);
      const responses = await apiurl.get(`/auth/getUser/${userId}`);
      const userData = responses?.data?.user;

      dispatch(setUser({ userId, userData }));
    } catch (error) {
      toast.error(error?.response?.data?.message);
      // console.error("Error submitting form:", error);
      return;
    }
  };

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

  const fetchData = async () => {
    const userData = profileData[0]?.basicDetails;
    // console.log(userData)
    setBasicData(userData);

    if (userData) {
      const data = userData;
      // console.log(data,"lpl")
      const nameParts = (data.name || "").split(" ");
      const fname = nameParts[0] || "";
      const lname =
        nameParts.length > 2
          ? nameParts.slice(-1).join(" ")
          : nameParts[1] || "";
      const mname =
        nameParts.length > 2 ? nameParts.slice(1, -1).join(" ") : "";

      setDetailBasic({
        fname,
        mname: mname?.replace("undefined", "") || "",
        lname,
        dateOfBirth: data?.dateOfBirth || "",
        timeOfBirth: data?.timeOfBirth || "",

        manglik: data?.manglik || "",
        horoscope: data?.horoscope || "",
        placeOfBirthCountry: data?.placeOfBirthCountry,
        placeOfBirthState: data?.placeOfBirthState,
        placeOfBirthCity: data?.placeOfBirthCity,
      });
      // console.log(timeOfBirth);
      setBsicDetailsData(data);
    }

    if (userData?.placeOfBirthCountry) {
      const countryId = userData?.placeOfBirthCountry;

      const mappedStates = state.map((item) => {
        if (item.country_id === countryId) {
          return {
            stateName: item.state_name,
            stateId: item.state_id,
          };
        }
      });
      setState(mappedStates);

      if (userData?.placeOfBirthState) {
        const stateId = userData?.placeOfBirthState;
        const cities = await getCitiesByState(countryId, stateId);
        const mappedCities = cities.map((item) => ({
          cityName: item.city_name,
          cityId: item.city_id,
        }));
        setCity(mappedCities);
      }
    }
  };

  const dateOfBirth = basicDetailsData?.dateOfBirth;

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

  useEffect(() => {
    fetchData();
    if (showProfile) {
      setIsOpen(false);
    }
  }, [showProfile, againCallFlag]);

  const manglikData = ["yes", "no", "partial", "notsure"];

  const formatOption = (option) => {
    if (option === "notsure") {
      return "Not Sure";
    }
    return option.charAt(0).toUpperCase() + option.slice(1);
  };

  const capitalizedManglikData = manglikData.map(formatOption);
  {
    basicData?.user?.createdFor === "myself" ? "My" : "na";
  }

  const horoscopeData = ["Required", "Not Required", "Not Important"];
  const selectedDate = detailBasic?.dateOfBirth
    ? dayjs(detailBasic.dateOfBirth)
    : "";

  const formatCreatedFor = (str) => {
    if (!str) return "NA";

    const mapping = {
      myself: "My Self",
      myson: "My Son",
      mydaughter: "My Daughter",
      mybrother: "My Brother",
      mysister: "My Sister",
      myfriend: "My Friend",
      myrelative: "My Relative",
    };

    const lowerStr = str.toLowerCase();
    return mapping[lowerStr] || "NA";
  };

  const displayValue = formatCreatedFor(
    profileData[0]?.createdBy[0]?.createdFor
  );

  return (
    <>
      <div className="shadow rounded-xl   py-3  mt-9 my-5 w-full ">
        <span className="flex justify-between items-center text-primary px-10 py-2 ">
          <p className="  font-medium  text-[20px]">Basic Details</p>
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
        <hr className="mx-9" />
        <span className="flex md:flex-row flex-col sm:flex-row  items-baseline justify-between  font-DMsans px-10 text-start pb-8 overflow-hidden">
          <span className=" mt-4  text-[17px] md:w-1/2 sm:w-1/2">
            <p className="  font-medium"> Profile Created For</p>
            <p className=" font-light text-[15px]">
              {/* {console.log({ response })} */}
              {displayValue}
            </p>

            <p className=" pt-4 font-medium"> Name</p>
            <p className=" font-light text-[15px]">
            {capitalizeWord(basicDetailsData?.name) || "NA"}
            </p>

            <p className=" pt-4 font-medium"> Gender</p>
            <p className=" font-light text-[15px]">
              {basicDetailsData?.gender === "M" ? " Male" : "Female" || "NA"}
            </p>

            <p className=" pt-4 text-[17px] font-medium">Birth Date</p>
            <p className=" font-light text-[15px]">{formattedDateOfBirth}</p>

            <p className=" pt-4 text-[17px] font-medium">Horoscope Matching</p>
            <p className=" font-light text-[15px]">
              {basicDetailsData?.horoscope || "NA"}
            </p>
          </span>
          <span className="text-[17px] mt-4 md:w-1/2 sm:w-1/2">
            <p className="  font-medium"> Time of Birth</p>
            <p className=" font-light text-[15px]">
              {basicDetailsData?.timeOfBirth || "NA"}
            </p>

            <p className=" pt-4 font-medium"> Age</p>
            <p className=" font-light text-[15px]">
              {basicDetailsData?.age || "NA"}yrs
            </p>

            <p className=" pt-4 font-medium"> Place of Birth</p>
            <p className=" font-light text-[15px]">
              {basicDetailsData?.citybtype || "NA"},
              {basicDetailsData?.statebtype || "NA"},
              {basicDetailsData?.countrybtype || "NA"}
            </p>

            <p className=" pt-4 font-medium">Manglik Status</p>
            <p className=" font-light capitalize text-[15px]">
              {basicDetailsData?.manglik}
            </p>
          </span>
        </span>

        {isOpen && (
          <>
            <span className="flex md:flex-row sm:flex-row flex-col  items-baseline justify-between md:gap-9 sm:gap-9 font-DMsans px-10 text-start pb-8">
              <span className="w-full">
                <div className="pb-3">
                  <TextInput
                    type="text"
                    name="fname"
                    value={detailBasic.fname}
                    onChange={handleinput}
                    onBlur={handleBlur}
                    error={formErrors.fname}
                    placeholder="First Name "
                  />
                </div>
                {/* Middle Name */}
                <div className="flex flex-col mb-5 ">
                  <label className="font-semibold">
                    Middle Name{" "}
                    <span className="font-normal text-[#414141]">
                      (Optional)
                    </span>
                  </label>
                  <input
                    value={detailBasic.mname}
                    onChange={handleinput}
                    className={`p-2 bg-[#F0F0F0] mt-1 outline-0 md:h-[55px] w-full border focus:border-[#CC2E2E] rounded-md 
          }`}
                    type="text"
                    name="mname"
                    placeholder="Middle Name"
                  />
                </div>
                <TextInput
                  label={gender}
                  type="text"
                  name="lname"
                  value={detailBasic.lname}
                  onChange={handleinput}
                  error={formErrors.lname}
                  placeholder="Last Name "
                />
                <span className="font-semibold mt-6">
                  Place of Birth <span className="text-primary">*</span>
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
                          option.country_id === detailBasic.placeOfBirthCountry
                      ) || null
                    }
                    getOptionLabel={(option) => option.country_name}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Country"
                        InputLabelProps={{
                          shrink:
                            !!detailBasic.country || params.inputProps?.value,
                        }}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        sx={{
                          "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                            {
                              border: "none",
                            },
                          backgroundColor: "#F0F0F0",
                          fontFamily: '"DM Sans", sans-serif', // Assuming 'font-dmsans' is a valid font family
                        }}
                      />
                    )}
                  />
                </div>

                <div className="mt-6">
                  <Autocomplete
                    onChange={(event, newValue) =>
                      handleSelectChange(event, newValue.state_id, "state")
                    }
                    options={state.filter(
                      (item) =>
                        item.country_id === detailBasic.placeOfBirthCountry
                    )}
                    value={
                      state.find(
                        (option) =>
                          option.state_id === detailBasic.placeOfBirthState
                      ) || null
                    }
                    getOptionLabel={(option) => option.state_name}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="State"
                        InputLabelProps={{
                          shrink:
                            !!detailBasic.state || params.inputProps?.value,
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
                          option.cityId === detailBasic.placeOfBirthCity
                      ) || null
                    }
                    getOptionLabel={(option) => option.cityName}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="City"
                        InputLabelProps={{
                          shrink:
                            !!detailBasic.city || params.inputProps?.value,
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
              </span>

              <span className="w-full">
                <div className=" w-full mb-5 relative">
                  <label className="font-semibold">
                    Date of Birth <span className="text-primary">*</span>
                  </label>
                  <span>
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
                  </span>
                </div>
                <div className="  justify-between mb-5 ">
                  <label htmlFor="batch" className="font-semibold ">
                    {gender} Time of Birth{" "}
                    <span className="text-primary">*</span>
                  </label>
                  <div className="w-full sm:w-full md:w-[100%] ]">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={["TimePicker"]}>
                        <TimePicker
                          className="time w-full "
                          value={dayjs(detailBasic?.timeOfBirth, "hh:mm A")}
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
                  {formErrors.timeOfBirth && (
                    <span className="text-red-500 font-DMsans">
                      {formErrors.timeOfBirth}
                    </span>
                  )}
                </div>
                <div className="pt-1">
                  <RadioInput
                    options={manglikData.map((option, index) => ({
                      value: option, // original value for state
                      label: capitalizedManglikData[index], // capitalized label for display
                    }))}
                    field="Manglik Status"
                    selectedValue={detailBasic.manglik}
                    onChange={(value) =>
                      setDetailBasic((prevValues) => ({
                        ...prevValues,
                        manglik: value,
                      }))
                    }
                  />
                </div>
                <div className="md:pt-6 sm:pt-0">
                  <RadioInput
                    label={gender}
                    options={horoscopeData.map((option) => ({
                      value: option,
                      label: option,
                    }))}
                    field="Horoscope Matching"
                    selectedValue={detailBasic.horoscope}
                    onChange={(value) =>
                      setDetailBasic((prevValues) => ({
                        ...prevValues,
                        horoscope: value,
                      }))
                    }
                  />
                </div>
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
                  handleSubmitForm1();
                  // setIsOpen((prev) => !prev);
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

export default BasicDetail;
