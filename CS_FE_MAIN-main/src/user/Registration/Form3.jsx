import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setStep, selectStepper } from "../../Stores/slices/Regslice";
import { setUser, userDataStore } from "../../Stores/slices/AuthSlice";
import { Link, useLocation, useNavigate } from "react-router-dom";
import apiurl from "../../util";
import { RadioInput, TextInput } from "../../components/CustomInput";
import { getFormData } from "../../Stores/service/Genricfunc";
import { getLabel, getMasterData } from "../../common/commonFunction.js";
import { FaXmark } from "react-icons/fa6";
import { toast } from "react-toastify";
import {
  setNewUserData,
  setUserAddedbyAdminId,
  setUserDataAddedbyAdmin,
} from "../../Stores/slices/Admin.jsx";
import RegError from "../../components/RegError.jsx";
const Form3 = ({ page }) => {
  const { profession, education } = useSelector((state) => state.masterData);
  const [formthree, setFormthree] = useState({
    highestEducation: "",
    highestQualification: "",
    currentDesignation: "",
    previousOccupation: "",
    profession: "",
    isOther: false,
    currencyType: "",
    annualIncomeValue: "",
    otherProfession: "",
    university: "",
  });

  const { admin, userDataAddedByAdmin } = useSelector((state) => state.admin);

  const dispatch = useDispatch();
  const { currentStep } = useSelector(selectStepper);
  const { userData, userId } = useSelector(userDataStore);
  const [isPageCheck, setIsPageCheck] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { userAddedbyAdminId } = useSelector((state) => state.admin);
  let userIdData;
  if (admin === "new") {
    userIdData = userId;
  } else {
    userIdData = userAddedbyAdminId.userAddedbyAdminId;
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

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
      if (name === "profession") {
        setFormthree((prev) => ({
          ...prev,
          profession: value === "other" ? prev.profession : value,
          isOther: value === "other",
        }));
      } else if (name === "otherProfession") {
        setFormthree((prev) => ({
          ...prev,
          otherProfession: value,
        }));
      } else {
        setFormthree((prev) => ({
          ...prev,
          [name]: type === "checkbox" ? checked : value,
        }));
      }
    }
  };

  const handleInput = (e) => {
    const { name, value, type, checked } = e.target;

    let isValid = true;

    if (type === "text") {
      const regex = /^[A-Za-z\s]*$/;
      if (!regex.test(value)) {
        isValid = false;
        toast.error("Alphanumeric value is not valid");
        e.preventDefault(); 
      }
    } else if (type === "email") {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!regex.test(value)) {
        isValid = false;

        e.preventDefault();
      }
    } else if (type === "number") {
     
      const regex = /^\d+$/;
      if (!regex.test(value)) {
        isValid = false;

        e.preventDefault(); // Prevent the default behavior if the input is invalid
      }
    } else if (type === "date") {
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
      setFormthree((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleAddProfession = async () => {
    try {
      let response = await apiurl.post(`/add-profession`, {
        professionName: formthree.otherProfession,
      });
      return response?.data?.profession?.proffesion_id;
    } catch (err) {
      // console.log(err);
    }
  };

  const handleCurrencyChange = (currency) => {
    setFormthree((prev) => ({
      ...prev,
      currencyType: currency,
    }));
  };

  const prevForm = () => {
    dispatch(setStep(currentStep - 1));
  };

  const handleinput = (e) => {
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

        e.preventDefault();
      }
    } else if (type === "number") {
      // Allow empty string or fifteen-digit numbers
      const regex = /^(|0|[0-9]{1,15})$/; // 0 or numbers with up to 15 digits
      if (!regex.test(value)) {
        isValid = false;
      }
    }

    if (isValid) {
      const parsedValue = name === "profession" ? parseInt(value) : value;
      setFormthree((prevState) => ({
        ...prevState,
        [name]: parsedValue,
      }));
    }
  };

  const [formErrors, setFormErrors] = useState({
    highestEducation: "",
    highestQualification: "",
    currentDesignation: "",
    profession: "",
    currencyType: "",
    annualIncomeValue: "",
    university: "",
  });

  const validateForm = (formData) => {
    const errors = {};
    let hasErrors = false;

    if (!formData.highestEducation) {
      errors.highestEducation = "Education is required";
      hasErrors = true;
    }
    if (!formData.highestQualification) {
      errors.highestQualification = "Qualification is required";
      hasErrors = true;
    }
    if (!formData.currentDesignation) {
      errors.currentDesignation = "Designation is required";
      hasErrors = true;
    }
    if (!formData.profession) {
      errors.profession = "Profession is required";
      hasErrors = true;
    }

    if (userDataAddedByAdmin?.gender === "F" || userData?.gender === "F") {
      if (!formData.currencyType) {
        errors.currencyType = "Currency Type is optional";
        hasErrors = true;
      }
    }if (
      (userDataAddedByAdmin?.gender === "M" || userData?.gender === "M") && 
      !(userDataAddedByAdmin?.gender === "F" || userData?.gender === "F")
    ) {
      const { currencyType, annualIncomeValue } = formData;
    
      if (!currencyType || !annualIncomeValue || annualIncomeValue.trim() === "" || annualIncomeValue === 0) {
        errors.currencyType = "Currency Type is required";
        errors.annualIncomeValue = "Annual Income is Required";
        hasErrors = true;
      }
    }
    
    
    if (
      typeof formData.university !== "string" ||
      !formData.university.trim()
    ) {
      errors.university = "University is required";
      hasErrors = true;
    }

    setFormErrors(errors);
    return !hasErrors;
  };

  const handleSubmitForm3 = async (state) => {
    try {
      let formData;

      if (formthree.isOther === true) {
        formData = {
          ...formthree,
          "school/university": formthree.university,
          profession: profession.length + 1,
          // Map university to school/university
        };
      } else {
        formData = {
          ...formthree,
          "school/university": formthree.university,
          // Map university to school/university
        };
      }

      if (state === "") {
        if (!validateForm(formData)) {
          // console.log("Form validation failed.");
          toast.error("Please fill in all required fields.");
          return;
        }
        handleSendData(formData);
      } else if (state === "next") {
        handleNext(formData);
      }
    } catch (error) {
      console.error("Error submitting form data:", error);
      toast.error("An error occurred while submitting form data.");
    }
  };

  const handleSendData = async (formData) => {
    try {
      handleAddProfession();
      const response = await apiurl.post(`/user-data/${userIdData}?page=3`, {
        careerDetails: { ...formData },
      });
      toast.success(response.data.message);
      setIsPageCheck(response.status);
      if (admin === "new") {
        dispatch(setUser({ userData: { ...response.data.user } }));
        dispatch(setNewUserData(response.data.user));
      } else if (admin === "adminAction") {
        dispatch(setUserDataAddedbyAdmin(response.data.user));
        dispatch(
          setUserAddedbyAdminId({
            userAddedbyAdminId: response?.data?.user?._id,
          })
        );
      }
      return response.status;
      console.log("Form submitted successfully:", response.data);
    } catch (err) {
       console.log(err)
    }
  };
  const passPage = "passPage";
  const handleNext = async (formData) => {
    if (!validateForm(formData)) {
      toast.error("Please fill in all required fields.");
      return;
    }

    // If form validation passes, proceed to the next page

    const res = await handleSendData(formData);

    if (res === 200)
      navigate(`/registration-form/${parseInt(page) + 1}`, { state: passPage });

    window.scrollTo(0, 0);
  };

  const customErrorMessages = {
    highestEducation: "Education  is required",
    highestQualification: "Qualification is required",
    currentDesignation: "Designation is required",
    previousOccupation: "Occupation is required",
    profession: "Profession is required",

    currencyType: "Currency Type is required",
    annualIncomeValue: "Annual income is required",

    university: "University is required",
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
    const fetchData = async () => {
      try {
        const formData = await getFormData(userIdData, page);
        setFormthree(formData.careerDetails);
        setFormthree((prev) => ({
          ...prev,
          university: formData.careerDetails["school/university"],
        }));
      } catch (error) {
        // console.log(error);
      }
    };

    fetchData();
  }, [userIdData, page]);

  useEffect(() => {
    dispatch(setStep(page));
  }, []);

  const resetOther = () => {
    setFormthree({
      ...formthree,
      profession: "",
      otherProfession: "",
      isOther: false,
    });
  };
  return (
    <>
      {location.state === "passPage" && (
        <div className="bg-[#FCFCFC] sm:mx-12 md:mx-0 md:px-9 sm:px-6 px-5 py-12 rounded-xl shadow ">
          {/*highestEducation Qualification */}
          <div className=" mb-2">
            <RadioInput
              label={getLabel()}
              options={education.map((item) => ({
                value: item.education_id,
                label: item.education_name,
              }))}
              field="Education Qualification"
              onBlur={handleBlur}
              selectedValue={formthree.highestEducation}
              onChange={(value) =>
                setFormthree((prev) => ({ ...prev, highestEducation: value }))
              }
            />
          </div>

          {/* Highest Qualification */}
          <div className="pb-5 relative">
            <TextInput
              type="text"
              label={getLabel()}
              placeholder=" Highest Qualification"
              value={formthree.highestQualification}
              onChange={handleInput}
              onBlur={handleBlur}
              name="highestQualification"
            />
            <span className="text-primary text-[13px] font-DMsans absolute top-20 md:top-24">
              Please write your qualification in full form (eg: Masters of
              Business Administration and not MBA)
            </span>
          </div>
          {/* School / University */}
          <div className="md:mt-2 mt-10">
          <TextInput
            type="text"
            label={getLabel()}
            placeholder="School or University"
            value={formthree.university}
            onChange={handleInput}
            onBlur={handleBlur}
            name="university"
          />
          </div>
          {/* Profession */}
          <div className="flex flex-col mb-2">
            <label className="font-semibold">
              {" "}
              {getLabel()} Profession
               <sup className="text-primary">*</sup>
            </label>

            {formthree.isOther ? (
              <div className="relative">
                <input
                  type="text"
                  placeholder="Wirite your profession"
                  className="p-2 bg-[#F0F0F0] mt-1 outline-0 h-[8vh] border focus:border-[#CC2E2E] rounded-md mb-3 w-full"
                  value={formthree.otherProfession}
                  onChange={handleChange}
                  name="otherProfession"
                />
                <button
                  type="button"
                  onClick={resetOther}
                  className="absolute right-2 top-6 text-primary text-28"
                >
                  <FaXmark />
                </button>
              </div>
            ) : (
              <select
                onChange={handleChange}
                className="p-2 bg-[#F0F0F0] mt-1 outline-0 h-[55px] border focus:border-[#CC2E2E] rounded-md"
                name="profession"
                onBlur={handleBlur}
                value={formthree.profession}
              >
                <option value="">Select Profession</option>
                {profession.map((p, index) => (
                  <option
                    key={`${p.proffesion_id}-${index}`}
                    value={p.proffesion_id}
                  >
                    {p.proffesion_name}
                  </option>
                ))}
                <option value="other">Other</option>
              </select>
            )}
          </div>
          <span className="text-primary text-[13px] font-DMsans ">
            If your profession is not in the list, then choose other and add
            your profession.
          </span>
          {/* Current currentDesignation */}
          <div className="mt-2">
            <TextInput
              type="text"
              label={getLabel()}
              placeholder=" Current Designation"
              value={formthree.currentDesignation}
              onChange={handleChange}
              onBlur={handleBlur}
              name="currentDesignation"
            />
          </div>

          {/* Previous Occupation */}

          <div className="flex flex-col mb-5">
            <label className="font-semibold">
              {getLabel()} Previous Occupation{" "}
              <span className="font-normal text-[#414141]">(Optional)</span>
            </label>
            <input
              value={formthree.previousOccupation}
              onChange={handleinput}
              className={`p-2 bg-[#F0F0F0] mt-1 outline-0 md:h-[55px] w-full border focus:border-[#CC2E2E] rounded-md 
          }`}
              onBlur={handleBlur}
              type="text"
              name="previousOccupation"
              placeholder=" Previous Occupation"
            />
          </div>

          {/* Approximate Annual Income */}
          <div className=" mb-2">
            <label className="font-semibold">
              {" "}
              {getLabel()} Currency Type 
              <span className="text-primary">*</span>
            </label>
            <span className="flex flex-col justify-start items-start md:mx-5 mt-3 mb-3">
              {/* Add appropriate onChange handlers */}
              <span className="flex items-center mb-3">
                <input
                  type="radio"
                  name="incomeCurrency"
                  value="INR"
                  checked={formthree.currencyType === "INR"}
                  onChange={() => handleCurrencyChange("INR")}
                  onBlur={handleBlur}
                />
                <label htmlFor="rupee" className="px-3 font-DMsans">
                  Indian Rupee (INR)
                </label>
              </span>
              <span className="flex items-center mb-3">
                <input
                  type="radio"
                  name="incomeCurrency"
                  value="USD"
                  checked={formthree.currencyType === "USD"}
                  onBlur={handleBlur}
                  onChange={() => handleCurrencyChange("USD")}
                />
                <label htmlFor="dollar" className="px-3 font-DMsans">
                  United States Dollar (USD)
                </label>
              </span>
              <span className="flex items-center mb-3">
                <input
                  type="radio"
                  name="incomeCurrency"
                  value="AED"
                  checked={formthree.currencyType === "AED"}
                  onChange={() => handleCurrencyChange("AED")}
                  onBlur={handleBlur}
                />
                <label htmlFor="dhiram" className="px-3 font-DMsans">
                  United Arab Emirates Dirham (AED)
                </label>
              </span>
              <span className="flex items-center mb-2">
                <input
                  type="radio"
                  name="incomeCurrency"
                  value="GBP"
                  checked={formthree.currencyType === "GBP"}
                  onBlur={handleBlur}
                  onChange={() => handleCurrencyChange("GBP")}
                />
                <label htmlFor="pound" className="px-3 font-DMsans">
                  United Kingdom Pound (GBP)
                </label>
              </span>
            </span>
          </div>

          <div className="flex flex-col mb-5">
            <label className="font-semibold">
              {getLabel()} Annual Income Value{" "}
              {console.log(userDataAddedByAdmin?.gender, admin)}
              {(userDataAddedByAdmin?.gender || userData?.gender) === "F" ? (
  <span className="font-normal text-[#414141]">(Optional)</span>
) : (userDataAddedByAdmin?.gender || userData?.gender) === "M" ? (
  <span className="text-primary">*</span>
  
) : null}

            </label>

            <input
              value={formthree.annualIncomeValue}
              onChange={handleinput}
              className={`p-2 bg-[#F0F0F0] mt-2 outline-0 md:h-[55px] w-full border focus:border-[#CC2E2E] rounded-md 
          }`}
              type="number"
              name="annualIncomeValue"
              placeholder="Annual Income :"
            />
          </div>
          {/* Navigation Buttons */}
          <span className="mt-9 flex justify-center  items-center md:gap-16 gap-3 px-12">
            <Link
              to={`/registration-form/2`}
              state={passPage}
              onClick={prevForm}
              className="px-3 py-2 text-lg rounded-md w-full text-white text-center background"
            >
              Previous
            </Link>
            <button
              onClick={() => handleSubmitForm3("")}
              className="px-3 py-2 text-lg rounded-md w-full text-white text-center background"
            >
              Save
            </button>
            <button
              onClick={() => handleSubmitForm3("next")}
              className="px-3 py-2 text-lg rounded-md w-full text-white text-center background"
            >
              Next
            </button>
          </span>
        </div>
      )}
    </>
  );
};

export default Form3;
