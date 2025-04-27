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
} from "../../common/commonFunction.js"; // Import your utility functions
import CustomSlider, { HeightSlider } from "../../components/CustomSlider.jsx";
import { getFormData } from "../../Stores/service/Genricfunc.jsx";
import Header from "../../components/Header.jsx";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { Autocomplete } from "@mui/material";
import TextField from "@mui/material/TextField";
import { convertFeetInchesToInches, convertToFeetInchesDecimal } from "../../common/common.js";

function valuetext(value) {
  return `${value}°C`;
}

const AdvanceSearch = ({ page }) => {
  const navigate = useNavigate();
  const { profession, diet, community, country, state, education, interest } =
    useSelector((state) => state.masterData);
  const [selectAll, setSelectAll] = useState(false);
  const [selectAllEducation, setSelectAllEducation] = useState(false);
  const [selectDiet, setSelectDiet] = useState(false);
  const location = useLocation();
  const { basicSearchData } = location.state || {};
  const [basicSearch, setBasicSearch] = useState({
    country: [],
    state: [],
    city: [],
    maritalStatus: "",
    education: "",

    smoking: [],
    community: [],
    profession: [],
    interests: [],

    alcohol: [],
    dietType: "",
    ageRangeStart: "",
    ageRangeEnd: "",
    heightRangeStart: "",
    heightRangeEnd: "",
  });
  const dispatch = useDispatch();

  useEffect(() => {
    if (basicSearchData) {
      setBasicSearch(basicSearchData);
    }
  }, [basicSearchData]);

  const path = window.location.pathname;

  const [states, setState] = useState([]);
  const [city, setCity] = useState([]);

  const [isOpen, setIsOpen] = useState(false);
  const [interests, setInterests] = useState([]);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (basicSearchData) {
      setBasicSearch(basicSearchData);
    }
  }, [basicSearchData]);

  // Function to handle focus
  const handleFocus = () => {
    setIsFocused(true);
  };

  // Function to handle blur
  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleAge = (event, newValues, activeThumb) => {
    if (!Array.isArray(newValues)) {
      return;
    }

    const [newValueStart, newValueEnd] = newValues;

    if (activeThumb === 0) {
      setBasicSearch((prevForm) => ({
        ...prevForm,
        ageRangeStart: newValueStart === 21 ? "" : newValueStart,
      }));
    } else {
      setBasicSearch((prevForm) => ({
        ...prevForm,
        ageRangeEnd: newValueEnd === 21 ? "" : newValueEnd,
      }));
    }
  };
  const handleInput = (fieldName, values) => {
    if (values.includes("Select All")) {
      if (fieldName === "smoking") {
        setBasicSearch((prevValues) => ({
          ...prevValues,
          smoking: smokingData,
        }));
      } else if (fieldName === "alcohol") {
        setBasicSearch((prevValues) => ({
          ...prevValues,
          alcohol: optionsWithOpenToAll.filter(
            (option) => option !== "Select All"
          ),
        }));
      }
    } else {
      setBasicSearch((prevValues) => ({
        ...prevValues,
        [fieldName]: values,
      }));
    }
  };
  
  const handleHeight = (event, newValues, activeThumb) => {
    if (!Array.isArray(newValues)) {
      return;
    }

    const [newValueStart, newValueEnd] = newValues;

    setBasicSearch((prevForm) => ({
      ...prevForm,
     heightRangeStart: convertToFeetInchesDecimal(newValueStart),
      heightRangeEnd: convertToFeetInchesDecimal(newValueEnd),
    }));
  };

  const handleCommunityChange = (event, newValue, fieldName) => {
    let selectedValues = "";

    if (newValue) {
      if (newValue.some((option) => option.community_id === "all")) {
        // If "Select all" is selected, set selectedValues to "opentoall"
        selectedValues = "opentoall";
      } else {
        // If other option(s) are selected, include them
        selectedValues = newValue.map((option) => option.community_id);
      }
    }

    setBasicSearch((prevValues) => ({
      ...prevValues,
      [fieldName]: selectedValues,
    }));
  };

  const handleInterest = (fieldName, values, options) => {
    let selectedValues;

    if (values.some((option) => option.intrest_name === " Select All")) {
      // If "Open to all" is selected, set selectedValues to an empty string
      selectedValues = "opentoall";
    } else {
      // If other options are selected, include only InterestIds
      selectedValues = values.map((option) => option.intrest_id);
    }

    setBasicSearch((prevValues) => ({
      ...prevValues,
      [fieldName]: selectedValues,
    }));
  };

  const handleCheckboxChange = (e, option, field, id) => {
    const { checked } = e.target;

    if (id === -1) {
      // Set all values in the field to checked or unchecked based on the 'checked' value
      setBasicSearch((prevForm) => ({
        ...prevForm,
        [field]: checked ? option : [],
      }));
    } else {
      if (checked) {
        // Add the selected option to the corresponding field in the basicSearch state
        setBasicSearch((prevForm) => ({
          ...prevForm,
          [field]: Array.isArray(prevForm[field])
            ? [...prevForm[field], option]
            : prevForm[field] == undefined
            ? [option]
            : [...stringToArray(prevForm[field]), option],
        }));
      } else {
        // Remove the unselected option from the corresponding field in the basicSearch state
        setBasicSearch((prevForm) => ({
          ...prevForm,
          [field]: Array.isArray(prevForm[field])
            ? prevForm[field].filter((item) => item !== option)
            : stringToArray(prevForm[field]).filter((item) => item !== option),
        }));
      }
    }
  };

  function stringToArray(str) {
    return str.split(", ").map((item) => item.trim());
  }
  const handleSelectAllChange = (e, name) => {
    const isChecked = e.target.checked;

    if (isChecked) {
      if (name === "maritalStatus") {
        setBasicSearch((prevForm) => ({
          ...prevForm,
          maritalStatus: [...maritalData], // Select all options
        }));
        setSelectAll(true);
      } else if (name === "education") {
        setBasicSearch((prevForm) => ({
          ...prevForm,
          education: education.map((val) => val.education_id), // Select all options
        }));
        setSelectAllEducation(true);
      } else if (name === "workingpreference") {
        setBasicSearch((prevForm) => ({
          ...prevForm,
          workingpreference: workingpreferenceData.map((val) => val), // Select all options
        }));
      } else if (name === "dietType") {
        setBasicSearch((prevForm) => ({
          ...prevForm,
          dietType: diet.map((val) => val.diet_id), // Select all options
        }));
        setSelectDiet(true);
      }
    } else {
      if (name === "maritalStatus") {
        setBasicSearch((prevForm) => ({
          ...prevForm,
          maritalStatus: [], // Select all options
        }));
        setSelectAll(false);
      } else if (name === "education") {
        setBasicSearch((prevForm) => ({
          ...prevForm,
          education: [], // Select all options
        }));
        setSelectAllEducation(false);
      } else if (name === "workingpreference") {
        setBasicSearch((prevForm) => ({
          ...prevForm,
          workingpreference: [], // Select all options
        }));
      } else if (name === "dietType") {
        setBasicSearch((prevForm) => ({
          ...prevForm,
          dietType: [], // Select all options
        }));
        setSelectDiet(false);
      }
    }
  };

  useEffect(() => {
    dispatch(setStep(page));
  }, []);

  const handleSelectChange = (event, values, field) => {
    if (values === "Open to all") {
      if (field === "country") {
        setBasicSearch((prevValues) => ({
          ...prevValues,
          country: "opentoall",
          state: "",
          city: "",
        }));
        setState([]);
        setCity([]);
      } else if (field === "state") {
        setBasicSearch((prevValues) => ({
          ...prevValues,
          state: "",
          city: "",
        }));
        setCity([]);
      }
    } else {
      setBasicSearch((prevValues) => ({
        ...prevValues,
        [field]: values,
      }));
      if (field === "country") {
        setBasicSearch((prevValues) => ({
          ...prevValues,
          country: values,
          state: "",
          city: "",
        }));
      } else if (field === "state") {
        setBasicSearch((prevValues) => ({
          ...prevValues,
          state: values,
          city: "",
        }));
      } else if (field === "city") {
        setBasicSearch((prevValues) => ({
          ...prevValues,
          city: values,
        }));
      }
    }
  };

  const handleProfessionChange = (event, values) => {
    if (values.some((option) => option.proffesion_id === "open_to_all")) {
      // If "Open to all" is selected, set the state to an empty string
      setBasicSearch((prevValues) => ({
        ...prevValues,
        profession: "opentoall",
      }));
    } else {
      // If other options are selected, set the state to include those options
      setBasicSearch((prevValues) => ({
        ...prevValues,
        profession: values.map((value) => value.proffesion_id),
      }));
    }
  };
  const handleSubmit = () => {
    navigate("/search-results", { state: { basicSearch } });
  };
  const alcoholData = ["Regular", "Occasional", "Social", "Not at all"];
  const optionsWithOpenToAll = ["Select All", ...alcoholData];

  const smokingData = ["Regular", "Occasional", "Social", "Not at all"];
  const smokingWithOpenToAll = ["Select All", ...smokingData];
  // const manglikData = ["Yes", "No", "Partial", "Not Sure"];

  const handleinput = (e) => {
    const { value, name } = e.target;
    const parsedValue =
      name === "profession" || "annualIncomeRangeEnd" ? parseInt(value) : value;
    setBasicSearch((log) => ({
      ...log,
      [name]: parsedValue,
    }));
  };

  const maritalData = [
    "single",
    "divorcee",
    "awaitingdivorce",
    "widoworwidower",
  ];

  const handleDietChange = (option, checked) => {
    setBasicSearch((prevForm) => {
      const updatedDiet = checked
        ? [...(prevForm.dietType || []), option]
        : (prevForm.dietType || []).filter((item) => item !== option);

      return {
        ...prevForm,
        dietType: updatedDiet,
      };
    });
  };
  // console.log(basicSearch?.education?.length, "hj");

  useEffect(() => {
    if (basicSearch?.maritalStatus?.length >= 4) {
      // setSelectAll(true);
      setSelectAll(true);
    }
    if (basicSearch?.education?.length >= 5) {
      setSelectAllEducation(true);
    }

    if (basicSearch?.dietType?.length >= 5) {
      setSelectDiet(true);
    }
  }, [basicSearch]);
  useEffect(() => {
    if (basicSearch.country && basicSearch.state) {
      getCitiesByState(basicSearch.country, basicSearch.state)
        .then((cities) => {
          setCity(
            cities.map((item) => ({
              cityName: item.city_name,
              cityId: item.city_id,
            }))
          );
        })
        .catch((error) => console.error("Error fetching cities:", error));
    }
  }, [basicSearch.country, basicSearch.state]);
  const displayTextMapping = {
    single: "Single",
    divorcee: "Divorcee",
    awaitingdivorce: "Awaiting Divorce",
    widoworwidower: "Widow or Widower",
  };
  return (
    <>
      <Header />
      <div className="flex justify-between md:justify-center sm:justify-center  sm:gap-9 gap-9  items-center md:mt-36 sm:mt-44 mt-20 sm:overflow-hidden md:overflow-hidden overflow-x-auto scrollbar-hide whitespace-nowrap w-full">
       <Link to="/searchbyid" className=" md:mx-9 ml-6  shrink-0 w-[60%] sm:w-[40%] md:w-[20%]">
         <p
           className={`bg-[#FCFCFC] rounded-xl  hover:bg-primary text-center hover:text-white mb-9 font-medium  py-2 cursor-pointer  ${
             path === "/searchbyid" && "active"
           }`}
         >
           Search By Profile ID/Name
         </p>
       </Link>
       <Link to="/basic-search" className=" shrink-0 mr-9 sm:w-[30%] w-[40%] md:w-[20%]">
         <p className={`bg-[#FCFCFC] rounded-xl hover:bg-primary text-center hover:text-white mb-9 font-medium px-3 py-2 cursor-pointer ${
             path === "/basic-search" && "active"
           }`}>
           Basic Search
         </p>
       </Link>
     </div>
      <div className="bg-[#FCFCFC]  px-9 py-12 rounded-xl shadow  md:mx-80 mx-6 mb-36">
        <label htmlFor="name" className="font-semibold mb-1 mt-3 text-[25px]">
          Basic Search
        </label>
        <div className=" mb-2 mt-5">
          <label className="font-semibold mt-2 ">Age Range</label>
          <CustomSlider
            getAriaLabel={() => "Minimum distance shift"}
            value={[basicSearch.ageRangeStart, basicSearch.ageRangeEnd]}
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
          <label className="font-semibold mt-2 "> Height Range</label>
          <HeightSlider
            getAriaLabel={() => "Height range slider"}
           value={[
                                  convertFeetInchesToInches(basicSearch.heightRangeStart),
                                  convertFeetInchesToInches(basicSearch.heightRangeEnd),
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
          <div className="font-semibold pb-3">Marital Status</div>
          <span className="flex flex-col justify-start items-start mx-5">
            <span className="flex flex-row items-center" key="selectAll">
              <input
                className="p-2 bg-[#F0F0F0] mt-1 h-[5vh]"
                type="checkbox"
                name="selectAll"
                id="selectAll"
                checked={selectAll} // Make sure you have a state variable for selectAll
                onChange={(e) => handleSelectAllChange(e, "maritalStatus")}
              />
              <label htmlFor="selectAll" className="px-3 font-DMsans">
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
                  checked={basicSearch.maritalStatus.includes(option)}
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

        <div className="mt-6">
          <span className="font-medium  text-primary text-[22px] ">
            Location Details
          </span>
          <div className="mt-3">
            <Autocomplete
              onChange={(event, newValue) => {
                if (
                  newValue &&
                  newValue.some((option) => option.country_id === "open_to_all")
                ) {
                  handleSelectChange(event, "Open to all", "country");
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
                { country_id: "open_to_all", country_name: " Select all" },
                ...country,
              ]}
              value={
                basicSearch.country === "opentoall"
                  ? [{ country_id: "open_to_all", country_name: " Select all" }]
                  : country.filter(
                      (option) =>
                        basicSearch.country &&
                        basicSearch.country.includes(option.country_id)
                    )
              }
              getOptionLabel={(option) =>
                option.country_id === "open_to_all"
                  ? " Select All"
                  : option.country_name
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={
                    basicSearch.country === "opentoall" ||
                    (basicSearch.country &&
                      basicSearch.country.includes("open_to_all"))
                      ? ""
                      : "Country"
                  }
                  InputLabelProps={{
                    shrink: !!(
                      (basicSearch.country && basicSearch.country.length) ||
                      params.inputProps?.value
                    ),
                  }}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  disabled={basicSearch.country === "opentoall"}
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
            options={state.filter((item) =>
              basicSearch.country.includes(item.country_id)
            )}
            value={
              basicSearch.state === "Open to all"
                ? [{ state_id: "open_to_all", state_name: " Select all" }]
                : state?.filter(
                    (option) =>
                      basicSearch?.state &&
                      basicSearch?.state?.includes(option.state_id)
                  )
            }
            getOptionLabel={(option) => option.state_name}
            renderInput={(params) => (
              <TextField
                {...params}
                label="State"
                InputLabelProps={{
                  shrink:
                    !!(basicSearch.state && basicSearch.state.length) ||
                    params.inputProps?.value,
                }}
                onFocus={handleFocus}
                onBlur={handleBlur}
                // disabled={
                //   basicSearch.state && basicSearch.state.includes("open_to_all")
                // } // Disable when "Open to all" is selected
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
              (option) =>
                basicSearch.city && basicSearch.city.includes(option.cityId)
            )}
            getOptionLabel={(option) => option.cityName}
            renderInput={(params) => (
              <TextField
                {...params}
                label="City"
                InputLabelProps={{
                  shrink:
                    !!(basicSearch.city && basicSearch.city.length) ||
                    params.inputProps?.value,
                }}
                onFocus={handleFocus}
                onBlur={handleBlur}
                disabled={
                  basicSearch.country &&
                  basicSearch.country.includes("open_to_all")
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
          <label className="font-semibold ">Education</label>
          <span className="flex flex-col justify-start items-start mx-5 mt-3 mb-3">
            <span className="flex flex-col justify-start items-start ">
              <span className="flex flex-row items-center" key="selectAll">
                <input
                  className="p-2 bg-[#F0F0F0] mt-1 h-[5vh]"
                  type="checkbox"
                  name="selectAll"
                  id="selectAllEducation"
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
                  className="p-2 bg-[#F0F0F0] mt-1 h-[5vh]"
                  type="checkbox"
                  name={`education${index}`}
                  id={`education${index}`}
                  checked={basicSearch.education.includes(
                    eduOption.education_id
                  )}
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
                basicSearch.profession === "opentoall"
                  ? [
                      {
                        proffesion_id: "open_to_all",
                        proffesion_name: " Select all",
                      },
                    ]
                  : profession.filter((option) =>
                      basicSearch.profession.includes(option.proffesion_id)
                    )
              }
              options={[
                {
                  proffesion_id: "open_to_all",
                  proffesion_name: " Select all",
                },
                ...profession,
              ]}
              getOptionLabel={(option) =>
                option.proffesion_id === "open_to_all"
                  ? " Select All"
                  : option.proffesion_name
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Profession"
                  InputLabelProps={{
                    shrink:
                      isFocused ||
                      basicSearch.profession.length > 0 ||
                      basicSearch.profession === "",
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
                    {option.proffesion_id === "open_to_all"
                      ? " Select All"
                      : option.proffesion_name}
                  </span>
                </li>
              )}
            />
          </div>
        </div>

        <div className=" mb-2 mt-5">
          <label className="font-semibold ">Diet Type</label>
          <span className="flex flex-col justify-start items-start mx-5 mt-3 mb-3">
            <span className="flex flex-col justify-start items-start ">
              <span className="flex flex-row items-center" key="selectAll">
                <input
                  className="p-2 bg-[#F0F0F0] mt-1 h-[5vh]"
                  type="checkbox"
                  name="selectAll"
                  id="selectAllDiet"
                  checked={selectDiet} // Make sure you have a state variable for selectAll
                  onChange={(e) => handleSelectAllChange(e, "dietType")}
                />
                <label htmlFor="selectAllDiet" className="px-3 font-DMsans">
                  Select All
                </label>
              </span>
            </span>
            {diet.map((dietOption, index) => (
              <span className="flex flex-row items-center" key={index}>
                <input
                  className="p-2 bg-[#F0F0F0] mt-1 h-[5vh]"
                  type="checkbox"
                  name={`diet${index}`}
                  id={`diet${index}`}
                  value={dietOption.diet_id}
                  checked={basicSearch?.dietType?.includes(dietOption.diet_id)}
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
        <span>
          <span
            onClick={() => setIsOpen((prev) => !prev)}
            className="flex items-center  px-2 text-primary font-medium cursor-pointer"
          >
            View Advance Search{" "}
            {!isOpen ? (
              <span className="ps-2">
                <IoIosArrowDown />
              </span>
            ) : (
              <span className="ps-2">
                <IoIosArrowUp />
              </span>
            )}
          </span>
        </span>
        {isOpen && (
          <>
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
    ...[...community]?.sort((a, b) =>
      a.community_name?.localeCompare(b.community_name)
    ),
  ]}
  value={
    basicSearch.community === "opentoall"
      ? [{ community_id: "all", community_name: "Select all" }]
      : community.filter((option) =>
          basicSearch.community.includes(option.community_id)
        )
  }
  getOptionLabel={(option) =>
    option.community_id === "all"
      ? "Select All"
      : option.community_name
  }
  renderInput={(params) => (
    <TextField
      {...params}
      label="Community"
      InputLabelProps={{
        shrink:
          isFocused ||
          basicSearch.community.length > 0 ||
          basicSearch.community === "opentoall",
      }}
      onFocus={handleFocus}
      onBlur={handleBlur}
      sx={{
        "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
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
          ? "Select All"
          : option.community_name}
      </span>
    </li>
  )}
/>

              </div>
            </div>

            <div className=" mb-2 mt-9">
              <span className="font-medium  text-primary text-[22px] ">
                Interests & Lifestyle Details
              </span>
              <div className="mt-5">
                <Autocomplete
                  multiple
                  onChange={(event, values) =>
                    handleInterest("interests", values, interest)
                  }
                  options={[
                    { intrest_id: "", intrest_name: " Select All" },
                    ...interest,
                  ]}
                  value={
                    basicSearch.interests === "opentoall"
                      ? [{ intrest_id: "", intrest_name: " Select All" }]
                      : interest.filter((option) =>
                          basicSearch.interests.includes(option.intrest_id)
                        )
                  }
                  getOptionLabel={(option) => option.intrest_name}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Interest"
                      placeholder={
                        basicSearch.interests &&
                        basicSearch.interests.length > 0
                          ? ""
                          : ""
                      }
                      InputLabelProps={{
                        shrink:
                          basicSearch.interests &&
                          basicSearch.interests.length > 0
                            ? true
                            : undefined, // Hide the placeholder if there's any value
                      }}
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: params.InputProps.startAdornment,
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
                />
              </div>
            </div>

            <div className="mb-2 mt-5">
            <Autocomplete
  multiple
  onChange={(event, values) => handleInput("smoking", values)}
  value={basicSearch.smoking.includes("Select All")
    ? smokingData
    : basicSearch.smoking}
  options={smokingWithOpenToAll}
  getOptionLabel={(option) => option}
  renderInput={(params) => (
    <TextField
      {...params}
      label="Smoking"
      InputLabelProps={{
        shrink:
          isFocused ||
          (basicSearch.smoking && basicSearch.smoking.length > 0),
      }}
      onFocus={handleFocus}
      onBlur={handleBlur}
      sx={{
        "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
          border: "none",
        },
        backgroundColor: "#F0F0F0",
      }}
    />
  )}
  renderOption={(props, option) => (
    <li {...props}>
      <span>{option}</span>
    </li>
  )}
/>
            </div>

            <div className="mt-5">
              <Autocomplete
                multiple // make the selection multiple if needed
                onChange={(event, values) =>
                  handleInput("alcohol", values, alcoholData)
                } 
                options={optionsWithOpenToAll} // include the "Open to all" option
                value={basicSearch.alcohol}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Alcohol"
                    InputLabelProps={{
                      shrink:
                        isFocused ||
                        (basicSearch.alcohol && basicSearch.alcohol.length > 0),
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
          </>
        )}

        <div className="flex justify-center items-center mt-16">
          <span
            className="bg-[#A92525] px-5 py-2 rounded-lg text-[#ffffff] cursor-pointer"
            onClick={handleSubmit}
          >
            Search
          </span>
        </div>
      </div>
    </>
  );
};

export default AdvanceSearch;
