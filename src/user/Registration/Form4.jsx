import { useEffect, useState } from "react";
import { FiMinus } from "react-icons/fi";
import { LuPlus } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { setStep, selectStepper } from "../../Stores/slices/Regslice";
import { Link, useLocation, useNavigate } from "react-router-dom";
import apiurl from "../../util";
import { setUser, userDataStore } from "../../Stores/slices/AuthSlice";
import {
  getCitiesByState,
  getLabel,
  getModifieldLabelforInput,
} from "../../common/commonFunction.js";
import { RadioInput, TextInput } from "../../components/CustomInput.jsx";
import { getFormData } from "../../Stores/service/Genricfunc.jsx";
import { toast } from "react-toastify";
import { Autocomplete, TextField } from "@mui/material";
import { setUserAddedbyAdminId, setUserDataAddedbyAdmin } from "../../Stores/slices/Admin.jsx";

const Form4 = ({ page }) => {
  const { country, state, community } = useSelector(
    (state) => state.masterData
  );
  const { userDataAddedByAdmin, admin, newUserData} = useSelector(
    (state) => state.admin
  );
  const [formfour, setFormfour] = useState({
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
    communitytype: "",
    annualIncomeValue: "",
    users: [{ gender: "", option: "" }],
  });

  const [stat, setState] = useState([]);
  const [citi, setCity] = useState([]);
  const dispatch = useDispatch();
  const location = useLocation();
  const { currentStep } = useSelector(selectStepper);
  const [isFocused, setIsFocused] = useState(false);
  const { userId } = useSelector(userDataStore);

  const navigate = useNavigate();
  const { userAddedbyAdminId } = useSelector((state) => state.admin);
  let userIdData;
  if (admin === "new") {
    userIdData = userId;
  } else {
    userIdData = userAddedbyAdminId.userAddedbyAdminId;
  }

  const dataAdmin = userAddedbyAdminId?.careerDetails;

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
      setFormfour((prevForm) => ({
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
        toast.error("Alphanumeric value is not valid");
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
      // Allow only fifteen-digit numbers
      const regex = /^(|0|[0-9]{1,15})$/; // 0 or numbers with up to 15 digits
      if (!regex.test(value)) {
        isValid = false;
      }
    }

    if (isValid) {
      const parsedValue = name === "community" ? parseInt(value) : value;
      setFormfour((prevForm) => ({
        ...prevForm,
        [name]: parsedValue,
      }));
    }
  };
  const handleAddUser = () => {
    if (formfour.users.length < 5) {
      setFormfour((prevForm) => ({
        ...prevForm,
        users: [...prevForm.users, { gender: "", option: "" }],
      }));
    } else {
      toast.info("You cannot add more than 5 sibling names.");
    }
  };

  const handleRemoveUser = (index) => {
    const updatedUsers = [...formfour.users];
    updatedUsers.splice(index, 1);
    setFormfour((prevForm) => ({
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

    if (!formfour.fatherName) {
      errors.fatherName = "Father's Name is required";
      hasErrors = true;
    }
    if (!formfour.fatherOccupation) {
      errors.fatherOccupation = "Father's Occupation is required";
      hasErrors = true;
    }
    if (!formfour.motherName) {
      errors.motherName = "Mother's Name is required";
      hasErrors = true;
    }
    if (!formfour.motherOccupation) {
      errors.motherOccupation = "Mother's Occupation is required";
      hasErrors = true;
    }
    if (!formfour.withFamilyStatus) {
      errors.withFamilyStatus = "Family Status is required";
      hasErrors = true;
    }
    if (!formfour.country) {
      errors.country = "Country is required";
      hasErrors = true;
    }

    if (!formfour.community) {
      errors.community = "Community is required";
      hasErrors = true;
    }
    if (!formfour.annualIncomeValue) {
      errors.annualIncomeValue = "Annual Income is required";
      hasErrors = true;
    }

    setFormErrors(errors);
    return !hasErrors;
  };

  const handleSubmitForm4 = async () => {
    if (!validateForm()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      const response = await apiurl.post(`/user-data/${userIdData}?page=4`, {
        familyDetails: { ...formfour },
      });
      toast.success(response.data.message);
      if (admin === "new") {
        dispatch(setUser({ userData: { ...response.data.user } }));
      } else if (admin === "adminAction") {
        dispatch(setUserDataAddedbyAdmin(response?.data?.user));
        dispatch(
          setUserAddedbyAdminId({
            userAddedbyAdminId: response?.data?.user?._id,
          })
        );
      }
      return response.status;
    } catch (error) {
      toast.error("Error submitting form. Please try again.");
      console.error("Error submitting form:", error);
    }
  };

  const passPage = "passPage";
  const handleNext = async () => {
    if (!validateForm()) {
      toast.error("Please fill in all required fields.");
      return;
    }
    const res = await handleSubmitForm4();
    if (res === 200) {
      navigate(`/registration-form/${parseInt(page) + 1}`, { state: passPage });
      window.scrollTo(0, 0);
    }
  };

  const handleGenderChange = (index, value) => {
    const updatedUsers = [...formfour.users];
    updatedUsers[index].gender = value;
    setFormfour((prevForm) => ({
      ...prevForm,
      users: updatedUsers,
    }));
  };

  const handleOptionChange = (index, value) => {
    const updatedUsers = [...formfour.users];
    updatedUsers[index].option = value;
    setFormfour((prevForm) => ({
      ...prevForm,
      users: updatedUsers,
    }));
  };

  const handleSelectChange = (event, values, field) => {
    if (values === "Open to all") {
      // If "Open to all" is selected, set the state to include all options
      if (field === "country") {
        setFormfour((prevValues) => ({
          ...prevValues,
          country: country.map((option) => option.country_id),
          state: "",
          city: "",
        }));
        // Optionally, you can also clear the state and city arrays here
        setState([]);
        setCity([]);
      } else if (field === "state") {
        setFormfour((prevValues) => ({
          ...prevValues,
          state: state.map((option) => option.state_id),
          city: "",
        }));
        // Optionally, you can also clear the city array here
        setCity([]);
      }
    } else {
      // If other options are selected, set the state to include those options
      setFormfour((prevValues) => ({
        ...prevValues,
        [field]: values,
      }));
      if (field === "country") {
        setFormfour((prevValues) => ({
          ...prevValues,
          country: values,
          state: "",
          city: "",
        }));
      } else if (field === "state") {
        setFormfour((prevValues) => ({
          ...prevValues,
          state: values,
          city: "",
        }));
        getCitiesByState(formfour.country, values).then((cities) => {
          cities = cities.map((item) => ({
            cityName: item.city_name,
            cityId: item.city_id,
          }));
          setCity(cities);
        });
        // .catch((error) => console.error("Error fetching cities:", error));
      }
    }
  };
  useEffect(() => {
    dispatch(setStep(page));
  }, []);

  const prevForm = () => {
    dispatch(setStep(currentStep - 1));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const formData = await getFormData(userIdData, page);

        setFormfour(formData.familyDetails);
        setFormfour((prevValues) => ({
          ...prevValues,
          communitytype: formData.familyDetails.communitytype,
          annualIncomeValue: formData.familyDetails.familyAnnualIncomeStart,
          country: formData.familyDetails.familyLocationCountry,
          state: formData.familyDetails.familyLocationState,
          city: formData.familyDetails.familyLocationCity,
          community: formData.familyDetails.community || "",
          users: formData.familyDetails.users || [{ gender: "", option: "" }],
        }));

        if (formData.familyDetails.familyLocationCountry) {
          const countryId = formData.familyDetails.familyLocationCountry;
          const mappedStates = state.map((item) => {
            if (item.country_id === countryId) {
              return {
                stateName: item.state_name,
                stateId: item.state_id,
              };
            }
          });
          setState(mappedStates);

          if (formData.familyDetails.familyLocationState) {
            const stateId = formData.familyDetails.familyLocationState;
            const cities = await getCitiesByState(countryId, stateId);
            const mappedCities = cities.map((item) => ({
              cityName: item.city_name,
              cityId: item.city_id,
            }));
            setCity(mappedCities);
          }
        }
      } catch (error) {
        // console.log(error);
      }
    };

    fetchData();
  }, [userIdData, page]);
  return (
    <>
      {location.state === "passPage" && (
        <div className="bg-[#FCFCFC] sm:mx-12 md:mx-0 md:px-9 px-5 sm:px-9 py-12 rounded-xl shadow ">
          <TextInput
            label={getLabel()}
            name="fatherName"
            value={formfour.fatherName}
            onChange={handleInput}
            placeholder="Father's Name"
            type="text"
            // Add onBlur and error props if needed
          />

          <TextInput
            label={getLabel()}
            name="fatherOccupation"
            value={formfour.fatherOccupation}
            onChange={handleInputOccupation}
            placeholder="Father's Occupation"
            type="text"
            // Add onBlur and error props if needed
          />
          <TextInput
            label={getLabel()}
            name="motherName"
            value={formfour.motherName}
            onChange={(e) => handleInput(e)}
            placeholder="Mother's Name"
          />

          <TextInput
            label={getLabel()}
            name="motherOccupation"
            value={formfour.motherOccupation}
            onChange={(e) => handleInputOccupation(e)}
            placeholder="Mother’s Occupation"
            type="text"
          />

          <div className="mt-4">
            <label htmlFor="name" className="font-semibold mb-1 mt-3">
              {getLabel()} Siblings{" "}
              <span className="font-normal text-[#414141]">(Optional)</span>
            </label>
            {formfour?.users?.map((user, index) => (
              <div key={index} className="flex space-x-2 mb-2 mt-2">
                <select
                  value={user.gender}
                  onChange={(e) => handleGenderChange(index, e.target.value)}
                  className="p-2 border rounded w-1/2 bg-[#F0F0F0] cursor-pointer"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                <select
                  value={user.option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="p-2 border rounded w-1/2 bg-[#F0F0F0] cursor-pointer"
                >
                  <option value="">Select Option</option>
                  <option value="married">Married</option>
                  <option value="unamarried">Un-married</option>
                  <option value="Widow or Widower">Widow or Widower</option>
                  <option value="Awaiting Divorce">Awaiting Divorce</option>
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
              label={getModifieldLabelforInput()}
              options={[
                { label: "Yes", value: "Yes" },
                { label: "No", value: "No" },
              ]}
              selectedValue={formfour.withFamilyStatus}
              onChange={(value) =>
                setFormfour((prevForm) => ({
                  ...prevForm,
                  withFamilyStatus: value,
                }))
              }
            />
          </div>
          <div className="mt-6">
            <span className="font-semibold    ">
              {" "}
              {getLabel()} Family Settled{" "}
            </span>
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
                  country?.find(
                    (option) => option.country_id === formfour.country
                  ) || null
                }
                getOptionLabel={(option) => option.country_name}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Country"
                    InputLabelProps={{
                      shrink: !!formfour.country || params.inputProps?.value,
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
              options={state?.filter(
                (item) => item.country_id === formfour.country
              )}
              value={
                state?.find((option) => option.state_id === formfour.state) ||
                null
              }
              getOptionLabel={(option) => option.state_name}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="State"
                  InputLabelProps={{
                    shrink: !!formfour.state || params.inputProps?.value,
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

          <div className="mt-6">
            <Autocomplete
              onChange={(event, newValue) =>
                handleSelectChange(event, newValue.cityId, "city")
              }
              options={citi}
              value={
                citi.find((option) => option.cityId === formfour.city) || null
              }
              getOptionLabel={(option) => option.cityName}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="City"
                  InputLabelProps={{
                    shrink: !!formfour.city || params.inputProps?.value,
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

          <div className=" mb-2 mt-5">
            <label className="font-semibold ">{getLabel()} Religion</label>
            <span className="flex flex-col justify-start items-start mx-5 mt-1 mb-3">
              <span className="flex flex-row items-center">
                <input
                  className="p-2 rounded-full bg-[#F0F0F0] mt-1  h-[5vh] "
                  type="checkbox"
                  name="religion"
                  value={1}
                  checked={true}
                />
                <label className="px-3 font-DMsans">Hinduism</label>
              </span>
            </span>
          </div>

          <div className="mt-6">
            <span className="font-semibold    ">
              {getLabel()} Community <span className="text-primary">*</span>
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
                  community?.find(
                    (option) => option.community_id === formfour.community
                  ) || null
                }
                getOptionLabel={(option) => option.community_name}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Community"
                    InputLabelProps={{
                      shrink: !!formfour.community || params.inputProps?.value,
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

          <div className="mt-5">
            <label className=" font-DMsans font-semibold">
              {" "}
              {getLabel()} Family Annual Income (
              {admin === "adminAction"
                ? userDataAddedByAdmin?.careerDetails?.[0]?.currencyType
                : newUserData?.careerDetails?.[0]?.currencyType}
              ) <span className="text-primary">*</span>
            </label>
            <input
              value={formfour.annualIncomeValue}
              onChange={(e) => handleInput(e)}
              className={`p-2 bg-[#F0F0F0] mt-2 outline-0 md:h-[55px] w-full border focus:border-[#CC2E2E] rounded-md 
          }`}
              type="number"
              name="annualIncomeValue"
              placeholder="Annual Income :"
            />
          </div>
          <div className="mt-9 flex justify-center  items-center md:gap-16 gap-3 px-12">
            <Link
              to={`/registration-form/3`}
              state={passPage}
              onClick={prevForm}
              className="px-3 py-2 text-lg rounded-md w-full text-white text-center background"
            >
              Previous
            </Link>

            <button
              onClick={handleSubmitForm4}
              className="px-3 py-2 text-lg rounded-md w-full text-white text-center background"
            >
              Save
            </button>
            <button
              onClick={handleNext}
              className="px-3 py-2 text-lg rounded-md w-full text-white text-center background"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </>
  );
};
export default Form4;
