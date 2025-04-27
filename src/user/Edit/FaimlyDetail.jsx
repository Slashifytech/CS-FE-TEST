import { useEffect, useState } from "react";
import { FiMinus } from "react-icons/fi";
import { LuPlus } from "react-icons/lu";

import {
  getCitiesByState,
  getCountries,
  getStatesByCountry,
} from "../../common/commonFunction";
import { FiEdit } from "react-icons/fi";

import{
  RadioInput,
  TextInput,
} from "../../components/CustomInput";
import { Autocomplete, TextField } from "@mui/material";
import {useSelector } from "react-redux";
import { userDataStore } from "../../Stores/slices/AuthSlice";
import apiurl, { capitalizeWord } from "../../util";
import { toast } from "react-toastify";


const FaimllyDetail = ({
  showProfile,
  isUserData,

  getUser,
  profileData, setAgainCallFlag, againCallFlag
}) => {
  const { userId } = useSelector(userDataStore);
  const [isOpen, setIsOpen] = useState(false);
   const {state, country, community} = useSelector((state) => state.masterData)
  const [familyEdit, setFamilyEdit] = useState({
    fatherName: "",
    fatherOccupation: "",
    motherName: "",
    motherOccupation: "",
    withFamilyStatus: "",
    country: "",
    state: "",
    city: "",
    religion: "",
    community: "",
    annualIncomeValue: "",
    users: [{ gender: "", option: "" }],
  });
  const [stat, setState] = useState([]);
  const [citi, setCity] = useState([]);
  const [familyDatas, setFamilyDatas] = useState([]);
  const [islabel, setIsLabel] = useState(null); 
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  // Function to handle blur
  const handleBlur = () => {
    setIsFocused(false);
  };
  const handleInputOccupation = (e) => {
    const { value, name, type } = e.target;

    let isValid = true;

    if (type === "text") {
      // Allow alphanumeric characters only
      const regex = /^[A-Za-z0-9\s]*$/;
      if (!regex.test(value)) {
        isValid = false;

        e.preventDefault(); // Prevent the default behavior if the input is invalid
      }
    } else if (type === "email") {
      // Basic email validation
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!regex.test(value)) {
        isValid = false;

        e.preventDefault(); // Prevent the default behavior if the input is invalid
      }
    } else if (type === "number") {
      // Basic number validation (optional, HTML5 input type="number" already handles this)
      const regex = /^\d+$/;
      if (!regex.test(value)) {
        isValid = false;

        e.preventDefault(); // Prevent the default behavior if the input is invalid
      }
    } else if (type === "date") {
      // Basic date validation (optional, HTML5 input type="date" already handles this)
      const regex = /^\d{4}-\d{2}-\d{2}$/;
      if (!regex.test(value)) {
        isValid = false;

        e.preventDefault();
      }
    } else if (type === "time") {
      const regex = /^\d{2}:\d{2}$/;
      if (!regex.test(value)) {
        isValid = false;

        e.preventDefault();
      }
    }

    if (isValid) {
      const parsedValue = name === "community" ? parseInt(value) : value;
      setFamilyEdit((prevForm) => ({
        ...prevForm,
        [name]: parsedValue,
      }));
    }
  };
  const handleInput = (e) => {
    const { value, name, type } = e.target;

    let isValid = true;

    if (type === "text") {
      // Allow alphanumeric characters only
      const regex = /^[A-Za-z\s]*$/;
      if (!regex.test(value)) {
        isValid = false;
        // toast.error("Alphanumeric value is not valid");
        e.preventDefault(); // Prevent the default behavior if the input is invalid
      }
    } else if (type === "email") {
      // Basic email validation
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!regex.test(value)) {
        isValid = false;

        e.preventDefault(); // Prevent the default behavior if the input is invalid
      }
    } else if (type === "number") {
      // Allow only fifteen-digit numbers, disallowing any symbols
      const regex = /^(|0|[0-9]{1,15})$/;
      if (!regex.test(value)) {
        isValid = false;
      }
    }

    if (isValid) {
      const parsedValue = name === "community" ? parseInt(value) : value;
      setFamilyEdit((prevForm) => ({
        ...prevForm,
        [name]: parsedValue,
      }));
    }
  };
  const handleAddUser = () => {
    if (familyEdit.users.length < 5) {
      setFamilyEdit((prevForm) => ({
        ...prevForm,
        users: [...prevForm.users, { gender: "", option: "" }],
      }));
    } else {
      toast.info("You cannot add more than 5 sibling names.");
    }
  };

  const handleRemoveUser = (index) => {
    const updatedUsers = [...familyEdit.users];
    updatedUsers.splice(index, 1);
    setFamilyEdit((prevForm) => ({
      ...prevForm,
      users: updatedUsers,
    }));
  };

  const [formErrors, setFormErrors] = useState({
    fatherName: "",
    fatherOccupation: "",
    motherName: "",
    motherOccupation: "",
    withFamilyStatus: "",
    country: "",
    religion: "",
    community: "",
    annualIncomeValue: "",
  });
  const validateForm = () => {
    const errors = {};
    let hasErrors = false;

    if (!familyEdit.fatherName) {
      errors.fatherName = "Father's Name is required";
      hasErrors = true;
    }
    if (!familyEdit.fatherOccupation) {
      errors.fatherOccupation = "Father's Occupation is required";
      hasErrors = true;
    }
    if (!familyEdit.motherName) {
      errors.motherName = "Mother's Name is required";
      hasErrors = true;
    }
    if (!familyEdit.motherOccupation) {
      errors.motherOccupation = "Mother's Occupation is required";
      hasErrors = true;
    }
    if (!familyEdit.withFamilyStatus) {
      errors.withFamilyStatus = "Family Status is required";
      hasErrors = true;
    }
    if (!familyEdit.country) {
      errors.country = "Country is required";
      hasErrors = true;
    }

    if (!familyEdit.community) {
      errors.community = "Community is required";
      hasErrors = true;
    }
    if (!familyEdit.annualIncomeValue) {
      errors.annualIncomeValue = "Annual Income is required";
      hasErrors = true;
    }

    setFormErrors(errors);
    return !hasErrors;
  };

  const handleSubmitForm4 = async () => {
    if (!validateForm()) {
      toast.error("Please fill in all required fields.");
      setIsOpen((prev) => prev);
      return;
    }

    try {
      const response = await apiurl.post(`/user-data/${userId}?page=4&type=edit`, {
        familyDetails: { ...familyEdit },
      });
      setIsOpen((prev) => !prev);
      setAgainCallFlag(true);
      toast.success(response.data.message);
      // dispatch(setUser({ userData: { ...response.data.user } }));
  
    } catch (error) {
      toast.error(error.data.message);
      // console.error("Error submitting form:", error);
    }
  };



  

  const handleGenderChange = (index, value) => {
    const updatedUsers = [...familyEdit.users];
    updatedUsers[index].gender = value;
    setFamilyEdit((prevForm) => ({
      ...prevForm,
      users: updatedUsers,
    }));
  };
 
  
  const handleOptionChange = (index, value) => {
    const updatedUsers = [...familyEdit.users];
    updatedUsers[index].option = value;
    setFamilyEdit((prevForm) => ({
      ...prevForm,
      users: updatedUsers,
    }));
  };

  const handleSelectChange = (event, values, field) => {
 
    if (values === "Open to all") {
      if (field === "country") {
        setFamilyEdit((prevValues) => ({
          ...prevValues,
          country: country.map((option) => option.country_id),
          state: "",
          city: "",
        }));
        setState([]);
        setCity([]);
      } else if (field === "state") {
        setFamilyEdit((prevValues) => ({
          ...prevValues,
          state: state.map((option) => option.state_id),
          city: "",
        }));
        // Optionally, you can also clear the city array here
        setCity([]);
      }
    } else {
      // If other options are selected, set the state to include those options
      setFamilyEdit((prevValues) => ({
        ...prevValues,
        [field]: values,
      }));
      if (field === "country") {
        setFamilyEdit((prevValues) => ({
          ...prevValues,
          country: values,
          state: "",
          city: "",
        }));
       
      } else if (field === "state") {
        setFamilyEdit((prevValues) => ({
          ...prevValues,
          state: values,
          city: "",
        }));
        getCitiesByState(familyEdit.country, values).then((cities) => {
          cities = cities?.map((item) => ({
            cityName: item?.city_name,
            cityId: item?.city_id,
          }));
          setCity(cities);
        });
        // .catch((error) => console.error("Error fetching cities:", error));
      }
    }
  };


    const fetchData = async () => {
      const userData = profileData[3];
      if (userData) {
        const data = profileData[3];
        // console.log(data?.familyLocationCity)
        setFamilyEdit({
          fatherName: data?.fatherName || "",
          fatherOccupation: data?.fatherOccupation || "",
          motherName: data?.motherName || "",
          motherOccupation: data?.motherOccupation || "",
          withFamilyStatus: data?.withFamilyStatus || "",
          country: data?.familyLocationCountry || "",
          state: data?.familyLocationState || "",
          city: data?.familyLocationCity || "",

          community: data?.community || "",
          communitytype: data?.communityftype || "",
          annualIncomeValue: data?.familyAnnualIncomeStart || "",
          users: data?.users || [{ gender: "", option: "" }],
        });

        const additionalDetails = profileData[3];
        setFamilyDatas([
          
          additionalDetails,
        ]);
      }
      if (userData?.familyLocationCountry) {
        const countryId = userData?.familyLocationCountry;
        const mappedStates = state.map((item) => {
          if(item?.country_id === countryId){
            return {
              stateName: item.state_name,
          stateId: item.state_id,
            }
          
        }});
        setState(mappedStates);

        if (userData?.familyLocationState) {
          const stateId = userData?.familyLocationState;
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
    if(showProfile){
      setIsOpen(false);
    }
  }, [ showProfile, againCallFlag]);

 
   const labelFunc= async () => {
    const userData = await getUser(userId);
    if (!userData || !userData?.user?.createdBy || !userData?.user?.createdBy) {
      return "NA";
    }
  
    const createdForCheck = userData?.user?.createdBy[0]?.createdFor;
    const genderCheck = userData?.user?.createdBy[0]?.gender;
  
    switch (createdForCheck) {
      case "myself":
        return "I live with my family";
      case "myson":
      case "mybrother":
        return "He lives with his family";
      case "mysister":
      case "mydaughter":
        return "She lives with her family";
      case "myrelative":
        return genderCheck === "M" ? "He lives with his family" : "She lives with her family ";
      case "myfriend":
        return genderCheck === "M" ? "He lives with his family" : "She lives with her family";
      default:
        return "NA";
    }
  };

useEffect(() => {
  const fetchDataAndSetLabel = async () => {
    try {
      const result = await labelFunc(userId);
      setIsLabel(result);
    } catch (error) {
      console.error('Error fetching label:', error);
      setIsLabel("NA");
    }
  };

  fetchDataAndSetLabel();
}, [userId]);
  return (
    <>
      <div className="shadow rounded-xl  py-3 mt-9 my-5 w-full overflow-hidden">
        <span className="flex justify-between items-center text-primary px-10 py-2">
          <p className="  font-medium  text-[20px]">Family Details</p>
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
        <span className="flex md:flex-row sm:flex-row flex-col items-baseline justify-between  font-DMsans px-10 text-start pb-8">
          <span className=" mt-4  text-[17px] md:w-1/2 sm:w-1/2">
            <p className="  font-medium">Father’s Name</p>
            <p className=" font-light text-[15px]">
              {familyDatas[0]?.fatherName ? capitalizeWord(familyDatas[0]?.fatherName) : "NA"}
            </p>
            <p className=" pt-4 font-medium"> Father’s Occupation</p>
            <p className=" font-light text-[15px]">
              {familyDatas[0]?.fatherOccupation
                ? familyDatas[0]?.fatherOccupation
                : "NA"}
            </p>
            <p className=" pt-4 font-medium"> Mother’s Name</p>
            <p className=" font-light text-[15px]">
              {familyDatas[0]?.motherName ? capitalizeWord(familyDatas[0]?.motherName) : "NA"}
            </p>
            <p className=" pt-4 font-medium">Mother’s Occupation</p>
            <p className=" font-light text-[15px]">
              {familyDatas[0]?.motherOccupation
                ? familyDatas[0]?.motherOccupation
                : "NA"}
            </p>
            <p className="pt-4 font-medium">Siblings</p>
            {familyDatas[0]?.users &&
              familyDatas[0]?.users.map((userDetail, index) => (
                <div key={index} className="flex capitalize">
                  <p className="font-light text-[15px]">{userDetail.gender} - </p>
                  <p className="font-light text-[15px]"> {userDetail.option}</p>
                </div>
              ))}
            <p className=" pt-4 font-medium">Lives with Family</p>
            <p className=" font-light text-[15px]">
              {familyDatas[0]?.withFamilyStatus || "NA"}
            </p>
          </span>
          <span className="text-[17px] mt-4 md:w-1/2 sm:w-1/2">
            <p className="  font-medium"> Family Settled (Country)</p>
            <p className=" font-light text-[15px]">
              {familyDatas[0]?.countryftype || "NA"}
            </p>
            <p className=" pt-4 font-medium">Family Settled (State)</p>
            <p className=" font-light text-[15px]">{familyDatas[0]?.stateftype || "NA"}</p>
            <p className=" pt-4 font-medium"> Family Settled (City)</p>
            <p className=" font-light text-[15px]">{familyDatas[0]?.cityftype || "NA"}</p>
            <p className=" pt-4 font-medium">Religion</p>
            <p className=" font-light text-[15px]">Hinduism</p>
            <p className=" pt-4 font-medium">Community</p>
            <p className=" font-light text-[15px]">
              {familyDatas[0]?.communityftype || "NA"}
            </p>
            <p className=" pt-4 font-medium">
              Family Annual Income (
              {isUserData?.careerDetails?.currencyType})
            </p>
            <p className=" font-light text-[15px]">
              {familyEdit?.annualIncomeValue || "0"}
            </p>
          </span>
        </span>

        {isOpen && (
          <>
            <span className="flex md:flex-row sm:flex-row flex-col  items-baseline justify-between md:gap-6 sm:gap-6 font-DMsans px-10 text-start pb-8 pt-5">
              <span className="w-full ">
                <TextInput
                  name="fatherName"
                  value={familyEdit.fatherName}
                  onChange={handleInput}
                  placeholder="Father's Name"
                  type="text"
                  // Add onBlur and error props if needed
                />

                <TextInput
                  name="fatherOccupation"
                  value={familyEdit.fatherOccupation}
                  onChange={handleInputOccupation}
                  placeholder="Father's Occupation"
                  type="text"
                  // Add onBlur and error props if needed
                />
                <TextInput
                  name="motherName"
                  value={familyEdit.motherName}
                  onChange={(e) => handleInput(e)}
                  placeholder="Mother's Name"
                />

                <TextInput
                  name="motherOccupation"
                  value={familyEdit.motherOccupation}
                  onChange={(e) => handleInputOccupation(e)}
                  placeholder="Mother’s Occupation"
                  type="text"
                />
                <div className="mt-4">
                  <label htmlFor="name" className="font-semibold mb-1 mt-3">
                    Sibling’s{" "}
                    <span className="font-normal text-[#414141]">
                      (Optional)
                    </span>
                  </label>
                  {/* {console.log(familyEdit)} */}
                  {familyEdit?.users?.map((user, index) => (
                    <div key={index} className="flex space-x-2 mb-2 mt-2">
                      <select
                        value={user.gender}
                        onChange={(e) =>
                          handleGenderChange(index, e.target.value)
                        }
                        className="p-2 border rounded w-1/2 bg-[#F0F0F0] cursor-pointer"
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                      <select
                        value={user.option}
                        onChange={(e) =>
                          handleOptionChange(index, e.target.value)
                        }
                        className="p-2 border rounded w-1/2 bg-[#F0F0F0] cursor-pointer"
                      >
                        <option value="">Select Option</option>
                        <option value="married">Married</option>
                        <option value="unamarried">Un-married</option>
                        <option value="Widow or Widower">
                          Widow or Widower
                        </option>
                        <option value="Awaiting Divorce">
                          Awaiting Divorce
                        </option>
                      </select>
                      {index === 0 && (
                        <button
                          onClick={handleAddUser}
                          className="p-2  text-white rounded ml-2"
                        >
                          <LuPlus color="#CC2E2E" size={35} />
                        </button>
                      )}
                      {index !== 0 && (
                        <button
                          onClick={() => handleRemoveUser(index)}
                          className="p-2  text-white rounded "
                        >
                          <FiMinus color="#CC2E2E" size={35} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-5 mb-3">
                  <RadioInput
                    label= {islabel}
                    options={[
                      { label: "Yes", value: "Yes" },
                      { label: "No", value: "No" },
                    ]}
                    selectedValue={familyEdit.withFamilyStatus}
                    onChange={(value) =>
                      setFamilyEdit((prevForm) => ({
                        ...prevForm,
                        withFamilyStatus: value,
                      }))
                    }
                  />
                </div>
              </span>

              <span className="w-full ">
                <div className="mt-6">
                  <span className="font-semibold    "> Family Settled </span>
                  <p className="font-medium font-DMsans my-2">
                    {" "}
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
                          (option) => option.country_id === familyEdit.country
                        ) || null
                      }
                      getOptionLabel={(option) => option.country_name}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Country"
                          InputLabelProps={{
                            shrink:
                              !!familyEdit.country || params.inputProps?.value,
                          }}
                          onFocus={handleFocus}
                          onBlur={handleBlur}
                          sx={{
                            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                              {
                                border: "none",
                              },
                              backgroundColor: "#F0F0F0"
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
                    options={state.filter(item=>item.country_id === familyEdit.country)}

                    value={
                      state.find(
                        (option) => option.state_id === familyEdit.state
                      ) || null
                    }
                    getOptionLabel={(option) => option.state_name}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="State"
                        InputLabelProps={{
                          shrink:
                            !!familyEdit.state || params.inputProps?.value,
                        }}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        sx={{
                          "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                            {
                              border: "none",
                            },
                            backgroundColor: "#F0F0F0"
                        }}
                      />
                    )}
                  />
                </div>

                <div className="mt-6">
                  <Autocomplete
                    onChange={(event, newValue) =>
                      handleSelectChange(event, newValue.cityId, "city")
                    }
                    options={citi}
                    value={
                      citi.find(
                        (option) => option.cityId === familyEdit.city
                      ) || null
                    }
                    getOptionLabel={(option) => option.cityName}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="City"
                        InputLabelProps={{
                          shrink: !!familyEdit.city || params.inputProps?.value,
                        }}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        sx={{
                          "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                            {
                              border: "none",
                            },
                        }}
                      />
                    )}
                  />
                </div>

                <div className=" mb-2 mt-5">
                  <label className="font-semibold ">Religion</label>
                  <span className="flex flex-col justify-start items-start mx-5 mt-1 mb-3">
                    <span className="flex flex-row items-center">
                      <input
                        className="p-2 rounded-full bg-[#F0F0F0] mt-1  h-[5vh] "
                        type="checkbox"
                        name="religion"
                        value={1}
                        checked={true}
                        // onChange={(e) => handleInput(e)}
                      />
                      <label className="px-3 font-DMsans">Hinduism</label>
                    </span>
                  </span>
                </div>
                <div className="mt-6">
                  <span className="font-semibold    ">
                    Community <span className="text-primary">*</span>
                  </span>
                  <div className="mt-3">
                    <Autocomplete
                      onChange={(event, newValue) =>
                        handleSelectChange(
                          event,
                          newValue ? newValue.community_id : "",
                          "community"
                        )
                      }
                      options={[...community].sort((a, b) =>
        a.community_name.localeCompare(b.community_name)
      )}
                      value={
                        community.find(
                          (option) =>
                            option.community_id === familyEdit.community
                        ) || null
                      }
                      getOptionLabel={(option) => option.community_name}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Community"
                          InputLabelProps={{
                            shrink:
                              !!familyEdit.community ||
                              params.inputProps?.value,
                          }}
                          onFocus={handleFocus}
                          onBlur={handleBlur}
                          sx={{
                            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                              {
                                border: "none",
                              },
                          }}
                        />
                      )}
                    />
                  </div>
                </div>

                <div className="mt-10 sm:md-10">
                  <label className=" font-DMsans font-semibold">
                    {" "}
                    Family Annual Income (
                      {isUserData?.careerDetails?.currencyType}){" "}
                    <span className="text-primary">*</span>
                  </label>
                  <input
                    value={familyEdit.annualIncomeValue}
                    onChange={(e) => handleInput(e)}
                    className={`p-2 bg-[#F0F0F0] mt-2 outline-0 md:h-[55px] w-full border focus:border-[#CC2E2E] rounded-md 
          }`}
                    type="number"
                    name="annualIncomeValue"
                    placeholder="Annual Income :"
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
                  handleSubmitForm4();
                  
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

export default FaimllyDetail;
