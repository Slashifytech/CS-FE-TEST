import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { setStep, selectStepper } from "../../Stores/slices/Regslice";
import { setUser, userDataStore } from "../../Stores/slices/AuthSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  getCitiesByState,
  getCountries,
  getStatesByCountry,
  getMasterData,
} from "../../common/commonFunction.js"; 
import apiurl from "../../util.js";
import CustomSlider, { HeightSlider } from "../../components/CustomSlider.jsx";
import { getFormData } from "../../Stores/service/Genricfunc.jsx";
import { toast } from "react-toastify";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { setUserAddedbyAdminId, setUserDataAddedbyAdmin } from "../../Stores/slices/Admin.jsx";
import { convertFeetInchesToInches, convertToFeetInchesDecimal } from "../../common/common.js";

const minDistance = 3;
function valuetext(value) {
  return `${value}°C`;
}

const Form6 = ({ page }) => {
  const {community, country, state, education, diet, profession} = useSelector((state)=>(state.masterData))
  const { userAddedbyAdminId, admin  } = useSelector((state) => state.admin);
  
  const [selectAllEducation, setSelectAllEducation] = useState(false);
  const [selectDiet, setSelectDiet] = useState(false);
  const [formsix, setFormsix] = useState({
    country: [],
    state: [],
    city: "",
    maritalStatus: "",
    education: "",
    community: [],
    profession: [],
    dietType: "",
    all: "",
    ageRangeStart: 20,
    ageRangeEnd: 39,
    heightRangeStart: 3,
    heightRangeEnd: 7,
    annualIncomeRangeStart: "",
    annualIncomeRangeEnd: "",
  });
  const dispatch = useDispatch();
  const { userId } = useSelector(userDataStore);
  const [states, setState] = useState([]);
  const [city, setCity] = useState([]);
  const navigate = useNavigate();
  const [isFocused, setIsFocused] = useState(false);
  let userIdData;
  if (admin === "new") {
    userIdData = userId;
  } else {
    userIdData = userAddedbyAdminId.userAddedbyAdminId;
  }
  // Function to handle focus
  const handleFocus = () => {
    setIsFocused(true);
  };

  // Function to handle blur
  const handleBlur = () => {
    setIsFocused(false);
  };
  const location = useLocation();
  const passPage = "passPage";
  const prevForm = () => {
    navigate("/registration-form/5", { state: passPage });
  };
  const handleAge = (event, newValues, activeThumb) => {
    if (!Array.isArray(newValues)) {
      return;
    }

    const [newValueStart, newValueEnd] = newValues;

    if (activeThumb === 0) {
      setFormsix((prevForm) => ({
        ...prevForm,
        ageRangeStart: Math.min(
          newValueStart,
          prevForm.ageRangeEnd - minDistance
        ),
      }));
    } else {
      setFormsix((prevForm) => ({
        ...prevForm,
        ageRangeEnd: Math.max(
          newValueEnd,
          prevForm.ageRangeStart + minDistance
        ),
      }));
    }
  };
  const handleHeight = (event, newValues, activeThumb) => {
    if (!Array.isArray(newValues)) {
      return;
    }
    const [newValueStart, newValueEnd] = newValues;

    setFormsix((prevForm) => ({
      ...prevForm,
       heightRangeStart: convertToFeetInchesDecimal(newValueStart),
          heightRangeEnd: convertToFeetInchesDecimal(newValueEnd),
    }));
  };
  const handleCheckboxChange = (e, option, field, id) => {
    const { checked } = e.target;

    if (id === -1) {
      setFormsix((prevForm) => ({
        ...prevForm,
        [field]: checked ? option : [],
      }));
    } else {
      if (checked) {
        setFormsix((prevForm) => ({
          ...prevForm,
          [field]: Array.isArray(prevForm[field])
            ? [...prevForm[field], option]
            : prevForm[field] == undefined
            ? [option]
            : [...stringToArray(prevForm[field]), option],
        }));
      } else {
        setFormsix((prevForm) => ({
          ...prevForm,
          [field]: Array.isArray(prevForm[field])
            ? prevForm[field].filter((item) => item !== option)
            : stringToArray(prevForm[field]).filter((item) => item !== option),
        }));
      }
    }
  };

  function stringToArray(str) {
    // console.log(str);
    return str.split(", ").map((item) => item.trim());
  }

  const [selectAllMaritalStatus, setSelectAllMaritalStatus] = useState(false);

  const handleSelectAllChange = (e, name) => {
    const isChecked = e.target.checked;

    if (isChecked) {
      if (name === "maritalStatus") {
        setFormsix((prevForm) => ({
          ...prevForm,
          maritalStatus: maritalData.map((val) => val).join(", "), // Select all options as comma-separated string
        }));
        setSelectAllMaritalStatus(true);
      } else if (name === "education") {
        setFormsix((prevForm) => ({
          ...prevForm,
          education: education.map((val) => val.education_id).join(", "), // Select all options as comma-separated string
        }));
        setSelectAllEducation(true);
      } else if (name === "workingpreference") {
        setFormsix((prevForm) => ({
          ...prevForm,
          workingpreference: workingpreferenceData.join(", "), // Select all options as comma-separated string
        }));
        setSelectWorkingPreference(true);
      } else if (name === "dietType") {
        setFormsix((prevForm) => ({
          ...prevForm,
          dietType: diet.map((val) => val.diet_id).join(", "), // Select all options as comma-separated string
        }));
        setSelectDiet(true);
      }
    } else {
      if (name === "maritalStatus") {
        setFormsix((prevForm) => ({
          ...prevForm,
          maritalStatus: "", // Deselect all options
        }));
        // setSelectAll(false);
        setSelectAllMaritalStatus(false);
      } else if (name === "education") {
        setFormsix((prevForm) => ({
          ...prevForm,
          education: "", // Deselect all options
        }));
        setSelectAllEducation(false);
      } else if (name === "workingpreference") {
        setFormsix((prevForm) => ({
          ...prevForm,
          workingpreference: "", // Deselect all options
        }));
        setSelectWorkingPreference(false);
      } else if (name === "dietType") {
        setFormsix((prevForm) => ({
          ...prevForm,
          dietType: "", // Deselect all options
        }));
        setSelectDiet(false);
      }
    }
  };

 
  useEffect(() => {
    dispatch(setStep(page));
  }, []);

  const handleProfessionChange = (event, values) => {
    if (values.some((option) => option.proffesion_id === "open_to_all")) {
      setFormsix((prevValues) => ({
        ...prevValues,
        profession: "",
      }));
    } else {
      setFormsix((prevValues) => ({
        ...prevValues,
        profession: values.map((value) => value.proffesion_id),
      }));
    }
  };

  const [formErrors, setFormErrors] = useState({
    country: "",

    maritalStatus: "",
    education: "",

    profession: "",
    dietType: "",
    community: "",
  });

  const validateForm = () => {
    const errors = {};
    let hasErrors = false;

    if (!formsix.maritalStatus) {
      errors.maritalStatus = "Marital Status is required";
      hasErrors = true;
    }

    if (!formsix.dietType) {
      errors.dietType = "Diet is required";
      hasErrors = true;
    }

    if (!formsix.education) {
      errors.education = "Education is required";
      hasErrors = true;
    }

    setFormErrors(errors);
    return !hasErrors;
  };

  const handleSubmitForm6 = async () => {
    if (!validateForm()) {
      toast.error("Please fill in all required fields.");
      return;
    }
    try {
      let strFormSix = { ...formsix };

      if (Array.isArray(formsix.state)) {
        strFormSix.state = formsix.state.join(",");
      }
      if (Array.isArray(formsix.city)) {
        strFormSix.city = formsix.city.join(",");
      }
      if (Array.isArray(formsix.country)) {
        strFormSix.country = formsix.country.join(",");
      }
      if (Array.isArray(formsix.community)) {
        strFormSix.community = formsix.community.join(",");
      }

      const response = await apiurl.post(
        `/user-data/${userIdData}?page=6&type=add`,
        {
          partnerPreference: { ...strFormSix },
        }
      );
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
      return response.status
    } catch (error) {
      toast.error("something went wrong", error);
      return [];
    }
  };

  const handleNext = async () => {
    if (!validateForm()) {
      toast.error("Please fill in all required fields.");
      return;
    }
   const res =  await handleSubmitForm6();
   if(res === 200 ){
    navigate("/form-submitted");
   }
    // navigate(`/registration-form/${parseInt(page) + 1}`);
  };



  const handleSelectChange = (event, values, field) => {
    if (values === "open_to_all") {
      if (field === "country") {
        setFormsix((prevValues) => ({
          ...prevValues,
          country: "",
          state: "",
          city: "",
        }));
        setState([]);
        setCity([]);
      } else if (field === "state") {
        setFormsix((prevValues) => ({
          ...prevValues,
          state: "",
          city: "",
        }));
        setCity([]);
      }
    } else {
      setFormsix((prevValues) => ({
        ...prevValues,
        [field]: values,
      }));
      if (field === "country") {
        setFormsix((prevValues) => ({
          ...prevValues,
          country: values,
          state: "",
          city: "",
        }));
     
      } else if (field === "state") {
        setFormsix((prevValues) => ({
          ...prevValues,
          state: values,
          city: "",
        }));
        getCitiesByState(formsix.state, values).then((cities) => {
          setCity(
            cities.map((item) => ({
              cityName: item.city_name,
              cityId: item.city_id,
            }))
          );
        });
      } else if (field === "city") {
        setFormsix((prevValues) => ({
          ...prevValues,
          city: values,
        }));
      }
    }
  };
  const handleCommunityChange = (event, newValue, fieldName) => {
    let selectedValues = "";

    if (newValue) {
      if (newValue.some((option) => option.community_id === "all")) {
        // If "Open to all" is selected, select all communities
        selectedValues = "";
      } else {
        // If other option(s) are selected, include them
        selectedValues = newValue.map((option) => option.community_id);
      }
    }

    setFormsix((prevValues) => ({
      ...prevValues,
      [fieldName]: selectedValues,
    }));
  };

  const maritalData = [
    "single",
    "divorcee",
    "awaitingdivorce",
    "widoworwidower",
  ];
  const displayTextMapping = {
    single: "Single",
    divorcee: "Divorcee",
    awaitingdivorce: "Awaiting Divorce",
    widoworwidower: "Widow or Widower",
  };

  const handleDietChange = (option, checked) => {
    setFormsix((prevForm) => {
      const dietTypeArray = Array.isArray(prevForm.dietType)
        ? prevForm.dietType
        : [];
      const updatedDiet = checked
        ? [...dietTypeArray, option]
        : dietTypeArray.filter((item) => item !== option);

      return {
        ...prevForm,
        dietType: updatedDiet,
      };
    });
  };

  const fetchCitiesByIds = async (cityIds) => {
    try {
      const response = await apiurl.get(`/muliple-cities?city=${cityIds}`);
      return response.data;
    } catch (error) {
      // console.error('Error fetching cities:', error);
      throw error;
    }
  };
 
useEffect(() => {
  
    fetchCitiesByIds();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const formData = await getFormData(userIdData, page);
        // console.log({ formData });
        const partnerPreference = formData.partnerPreference;
        const parseStringToArray = (str) => {
          if (!str) return [];
          return str
            .split(",")
            .map((item) => item.trim())
            .filter((item) => item !== "" && !isNaN(item))
            .map((item) => parseInt(item, 10));
        };
        const handleNaNValues = (arr) => {
          if (arr.length === 0) return [];
          const containsNaN = arr.some((item) => isNaN(item));
          return containsNaN ? "openToAll" : arr;
        };
        setFormsix(partnerPreference);
        setFormsix((prev) => ({
          ...prev,
          annualIncomeValue: partnerPreference.annualIncomeRangeStart,
          country:
            partnerPreference?.country === ""
              ? ""
              : handleNaNValues(
                  Array.isArray(partnerPreference?.country)
                    ? partnerPreference.country
                    : parseStringToArray(partnerPreference?.country)
                ),
                state:
                partnerPreference?.state === ""
                  ? ""
                  : handleNaNValues(
                      Array.isArray(partnerPreference?.state)
                        ? partnerPreference.state
                        : parseStringToArray(partnerPreference?.state)
                    ),
          community:
            partnerPreference?.community === ""
              ? ""
              : handleNaNValues(
                  Array.isArray(partnerPreference?.community)
                    ? partnerPreference.community
                    : parseStringToArray(partnerPreference?.community)
                ),
          profession:
            partnerPreference?.profession === ""
              ? ""
              : handleNaNValues(
                  Array.isArray(partnerPreference?.profession)
                    ? partnerPreference.profession
                    : parseStringToArray(partnerPreference?.profession)
                ),
        }));
        if (partnerPreference.maritalStatus.length >= 45) {
          setSelectAllMaritalStatus(true);
        }
        if (partnerPreference?.educationTypes?.length >= 50) {
          setSelectAllEducation(true);
        }

        if (partnerPreference?.dietTypes?.length >= 50) {
          setSelectDiet(true);
        }
       


          if (partnerPreference.city) {
            const cityId = partnerPreference.city;
            const cities = await fetchCitiesByIds(cityId);
            const mappedCities = cities.map((item) => ({
              cityName: item.city_name,
              cityId: item.city_id,
            }));
            setCity(mappedCities);
          }
        
      } catch (error) {}
    };

    fetchData();
  }, [userIdData]);

  return (
    <>
      <div className="bg-[#FCFCFC] sm:mx-6 md:mx-0 md:px-9 px-5 sm:px-6 py-12 rounded-xl shadow ">
        <label htmlFor="name" className="font-semibold mb-1 mt-3 text-[25px]">
          Partner Preference
        </label>
        <div className=" mb-2 mt-5">
          <label className="font-semibold mt-2 ">Age Range </label>
          <CustomSlider
            getAriaLabel={() => "Minimum distance shift"}
            value={[formsix.ageRangeStart, formsix.ageRangeEnd]}
            onChange={handleAge}
            valueLabelDisplay="auto"
            className="mt-12 "
            minValue={21}
            maxValue={75}
            aria-label="pretto slider"
            getAriaValueText={valuetext}
            disableSwap
          />
        </div>

        <div className=" mb-2 mt-5">
          <label className="font-semibold mt-2 "> Height Range </label>
          <HeightSlider
            getAriaLabel={() => "Height range slider"}
              value={[
                                  convertFeetInchesToInches(formsix.heightRangeStart),
                                  convertFeetInchesToInches(formsix.heightRangeEnd),
                                ]} 
            onChange={handleHeight}
            valueLabelDisplay="auto"
            className="mt-12 mb-3"
            aria-label="Height range slider"
            getAriaValueText={valuetext}
            disableSwap
            minValue={48} 
            maxValue={84}
            step={1}
          />
        </div>
        <div className=" mb-2">
          <label htmlFor="hscope" className="font-semibold ">
            Marital Status <span className="text-primary">*</span>

          </label>
          <span className="flex flex-col justify-start items-start mx-5">
            <span className="flex flex-row items-center" key="selectAll">
              <input
                type="checkbox"
                name="maritalStatus"
                id="selectAll"
                className="p-2 bg-[#F0F0F0] mt-1 h-[5vh]"
                checked={selectAllMaritalStatus}
                onChange={(e) => handleSelectAllChange(e, "maritalStatus")}
              />
              <label htmlFor="maritalStatus" className="px-3 font-DMsans">
                Select All
              </label>
            </span>
          </span>
          <span className="flex flex-col justify-start items-start mx-5">
            {maritalData.map((option, index) => (
              <span className="flex flex-row items-center" key={index}>
                <input
                  className="p-2 bg-[#F0F0F0] mt-1 h-[5vh]"
                  type="checkbox"
                  name={`maritalStatus${index}`}
                  id={`maritalStatus${index}`}
                  checked={formsix.maritalStatus.includes(option)}
                  value={option}
                  onChange={(e) =>
                    handleCheckboxChange(e, option, "maritalStatus")
                  }
                />
                <label
                  htmlFor={`maritalStatus${index}`}
                  className="px-3 font-DMsans"
                >
                  {displayTextMapping[option]}
                </label>
              </span>
            ))}
          </span>
        </div>
        <div className="mt-5">
          <span className="font-semibold ">Community</span>
          <div className="mt-5">
            <Autocomplete
              multiple
              onChange={(event, newValue) =>
                handleCommunityChange(event, newValue, "community")
              }
              options={[
                { community_id: "all", community_name: "Select all" },
                ...community,
              ]}
              value={
                formsix.community === ""
                  ? [{ community_id: "all", community_name: "Select all" }]
                  : community.filter((option) =>
                      formsix.community.includes(option.community_id)
                    )
              }
              getOptionLabel={(option) =>
                option.community_id === "all"
                  ? "Select all"
                  : option.community_name
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Community"
                  InputLabelProps={{
                    shrink:
                      isFocused ||
                      formsix.community.length > 0 ||
                      formsix.community === "",
                  }}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  sx={{
                    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                      {
                        border: "none", // Remove border when focused
                      },
                    backgroundColor: "#F0F0F0",
                  }}
                />
              )}
              renderOption={(props, option) => (
                <li {...props}>
                  <span>
                    {option.community_id === "all"
                      ? "Select all"
                      : option.community_name}
                  </span>
                </li>
              )}
            />
          </div>
        </div>

        <div className="mt-6">
          <span className="font-semibold  text-black  ">Location </span>

          <div className="mt-3">
            <Autocomplete
              onChange={(event, newValue) => {
                if (
                  newValue &&
                  newValue.some((option) => option.country_id === "open_to_all")
                ) {
                  handleSelectChange(event, "open_to_all", "country"); // Use "open_to_all" to handle the special case
                } else {
                  handleSelectChange(
                    event,
                    newValue ? newValue.map((option) => option.country_id) : [],
                    "country"
                  );
                }
              }}
              multiple
              options={[
                { country_id: "open_to_all", country_name: "Select all" },
                ...country,
              ]}
              value={
                formsix.country === "" // Check for empty string instead of "open_to_all"
                  ? [{ country_id: "open_to_all", country_name: "Select all" }]
                  : country.filter(
                      (option) =>
                        formsix.country &&
                        formsix.country.includes(option.country_id)
                    )
              }
              getOptionLabel={(option) =>
                option.country_id === "open_to_all"
                  ? "Select all"
                  : option.country_name
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={formsix.country === "" ? "" : "Country"}
                  InputLabelProps={{
                    shrink: !!(
                      (Array.isArray(formsix.country) &&
                        formsix.country.length > 0) ||
                      params.inputProps?.value
                    ),
                  }}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  disabled={formsix.country === ""}
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
    handleSelectChange(
      event,
      newValue ? newValue.map((option) => option.state_id) : [],
      "state"
    )
  }
  multiple
  options={state.filter(item => formsix.country.includes(item.country_id))}
  value={state.filter(option => formsix.state && formsix.state.includes(option.state_id))}
 getOptionLabel={(option) =>
                option.state_id === "open_to_all"
                  ? "Select all"
                  : option.state_name
              }
  renderInput={(params) => (
    <TextField
      {...params}
      label="State"
      InputLabelProps={{
        shrink: !!(formsix.state && formsix.state.length) || params.inputProps?.value,
      }}
      onFocus={handleFocus}
      onBlur={handleBlur}
      disabled={formsix.country && formsix.country.includes("open_to_all")} // Disable when "Open to all" is selected
      sx={{
        "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
          border: "none",
        },
        backgroundColor: "#F0F0F0",
      }}
    />
  )}
/>

        </div>

        <div className="mt-6">
          <Autocomplete
            onChange={(event, newValue) =>
              handleSelectChange(
                event,
                newValue ? newValue.map((option) => option.cityId) : [],
                "city"
              )
            }
            multiple
            options={city}
            value={city.filter(
              (option) => formsix.city && formsix.city.includes(option.cityId)
            )}
            getOptionLabel={(option) => option.cityName}
            renderInput={(params) => (
              <TextField
                {...params}
                label="City"
                InputLabelProps={{
                  shrink:
                    !!(formsix.city && formsix.city.length) ||
                    params.inputProps?.value,
                }}
                onFocus={handleFocus}
                onBlur={handleBlur}
                disabled={
                  formsix.country && formsix.country.includes("open_to_all")
                }
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

        <div className=" mb-2 mt-5">
          <label className="font-semibold ">
            Education <span className="text-primary">*</span>
          </label>
          <span className="flex flex-col justify-start items-start mx-5 mt-3 mb-3">
            <span className="flex flex-col justify-start items-start ">
              <span className="flex flex-row items-center" key="selectAll">
                <input
                  type="checkbox"
                  name="selectAll"
                  id="selectAllEducation"
                  className="p-2 bg-[#F0F0F0] mt-1 h-20"
                  checked={selectAllEducation} // Make sure you have a state variable for selectAll
                  onChange={(e) => handleSelectAllChange(e, "education")}
                />
                <label
                  htmlFor="selectAllEducation"
                  className="px-3 font-DMsans"
                >
                  Select All
                </label>
              </span>
            </span>
            {education.map((eduOption, index) => (
              <span className="flex flex-row items-center" key={index}>
                <input
                  className="p-2 bg-[#F0F0F0] mt-1 h-20"
                  type="checkbox"
                  name={`education${index}`}
                  id={`education${index}`}
                  checked={formsix.education.includes(eduOption.education_id)}
                  value={eduOption.education_id}
                  onChange={(e) =>
                    handleCheckboxChange(e, eduOption.education_id, "education")
                  }
                />
                <label
                  htmlFor={`education${index}`}
                  className="px-3 font-DMsans"
                >
                  {eduOption.education_name}
                </label>
              </span>
            ))}
          </span>
        </div>

        <div className=" mb-2 mt-8">
          <label className="font-semibold mt-2 ">Profession</label>
          <div className="mt-3">
            <Autocomplete
              multiple
              onChange={handleProfessionChange}
              value={
                formsix.profession === ""
                  ? [{ proffesion_id: "open_to_all", proffesion_name: "Select all" }]
                  : profession.filter((option) =>
                      formsix.profession.includes(option.proffesion_id)
                    )
              }
              options={[
                { proffesion_id: "open_to_all", proffesion_name: "Select all" },
                ...profession,
              ]}
              getOptionLabel={(option) =>
                option.id === "open_to_all" ? "Select all" : option.proffesion_name
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Profession"
                  InputLabelProps={{
                    shrink:
                      isFocused ||
                      formsix.profession.length > 0 ||
                      formsix.profession === "",
                  }}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  sx={{
                    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                      {
                        border: "none", // Remove border when focused
                      },
                    backgroundColor: "#F0F0F0",
                  }}
                />
              )}
              renderOption={(props, option) => (
                <li {...props}>
                  <span>
                    {option.proffesion_id === "open_to_all" ? "Select all" : option.proffesion_name}
                  </span>
                </li>
              )}
            />
          </div>
        </div>

        <div className=" mb-2 mt-5">
          <label className="font-semibold ">
            Diet Type <span className="text-primary">*</span>
          </label>
          <span className="flex flex-col justify-start items-start mx-5 mt-3 mb-3">
            <span className="flex flex-col justify-start items-start ">
              <span className="flex flex-row items-center" key="selectAll">
                <input
                  type="checkbox"
                  name="selectAll"
                  id="selectAllDiet"
                  className="p-2 bg-[#F0F0F0] mt-1 h-[5vh]"
                  checked={selectDiet} // Make sure you have a state variable for selectAll
                  onChange={(e) => handleSelectAllChange(e, "dietType")}
                />
                <label htmlFor="selectAllDiet" className="px-3 font-DMsans">
                  Select all
                </label>
              </span>
            </span>
            {diet.map((dietOption, index) => (
              <span className="flex flex-row items-center" key={index}>
                <input
                  className="p-2 bg-[#F0F0F0] mt-1 h-20"
                  type="checkbox"
                  name={`diet${index}`}
                  id={`diet${index}`}
                  value={dietOption.diet_id}
                  checked={formsix?.dietType?.includes(dietOption.diet_id)}
                  onChange={(e) =>
                    handleDietChange(dietOption.diet_id, e.target.checked)
                  }
                />
                <label htmlFor={`diet${index}`} className="px-3 font-DMsans">
                  {dietOption.diet_name}
                </label>
              </span>
            ))}
          </span>
        </div>

        <div className="mt-9 flex justify-center  items-center md:gap-16 gap-3 px-12">
          <Link
            to={`/registration-form/5`}
            state={passPage}
            onClick={prevForm}
            className="px-3 py-2 text-lg rounded-md w-full text-white text-center background"
          >
            Previous
          </Link>

          <button
            onClick={handleNext}
            className="px-3 py-2 text-lg rounded-md w-full text-white text-center background"
          >
            Submit
          </button>
        </div>
      </div>
    </>
  );
};

export default Form6;
