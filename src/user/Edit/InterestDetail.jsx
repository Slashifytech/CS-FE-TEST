import React, { useEffect, useState } from "react";
import { FiEdit } from "react-icons/fi";
import apiurl from "../../util";
import { userDataStore } from "../../Stores/slices/AuthSlice";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Button, Select } from "antd";
const InterestDetail = ({
  showProfile,
  profileData,
  setAgainCallFlag,
  againCallFlag,
}) => {
  const { interest, fitness, other, funActivity } = useSelector(
    (state) => state.masterData
  );
  const { userId } = useSelector(userDataStore);
  const [isOpen, setIsOpen] = useState(false);
  const [interestDatas, setInterestDatas] = useState([]);
  const page = 5;
  const [Interestdet, setInterestDet] = useState({
    fun: [],
    fitness: [],
    other: [],
    interests: [],
  });


  const [formErrors, setFormErrors] = useState({
    fun: [],
    fitness: [],
    other: [],
    interests: [],

  
  });
  const validateForm = () => {
    const errors = {};
    let hasErrors = false;

  
    if (Interestdet.interests === "NA") {
      errors.interests = "Profile Picture is required";
      hasErrors = true;
    }
    if (Interestdet.fun === "NA") {
      errors.interests = "Profile Picture is required";
      hasErrors = true;
    }
    if (Interestdet.fitness === "NA") {
      errors.interests = "Profile Picture is required";
      hasErrors = true;
    }
      if (Interestdet.other === "NA") {
      errors.other = "Profile Picture is required";
      hasErrors = true;
    }
   

    setFormErrors(errors);
    return !hasErrors;
  };
  const onChange = (key, value) => {
    // Ensure the value is an array
    const arrayValue = Array.isArray(value) ? value : [value];
    const allSelected = arrayValue.length === interest.length;

    setInterestDet((prevState) => ({
      ...prevState,
      [key]: arrayValue.length === 0 ? "NA" : allSelected ? "" : arrayValue,
    }));
  };

  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  const handleSubmitForm5 = async () => {

    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }
    try {
      const formData = new FormData();

      formData.append("page", page);
      //converting antdesign array fromat to string
      const convertToString = (field) => {
        if (Array.isArray(field)) {
          return field.length === 0 ? "NA" : field?.join(",");
        } else {
          return field === "" ? "" : field;
        }
      };

      const interestsString = convertToString(Interestdet?.interests);
      const funString = convertToString(Interestdet?.fun);
      const fitnessString = convertToString(Interestdet?.fitness);
      const otherString = convertToString(Interestdet?.other);

      let selfDetaillsData = { ...Interestdet };
      selfDetaillsData.fitness = fitnessString;
      selfDetaillsData.fun = funString;
      selfDetaillsData.other = otherString;
      selfDetaillsData.interests = interestsString;
      formData.append("selfDetails", JSON.stringify(selfDetaillsData));

      const response = await apiurl.post(
        `/user-data/${userId}?page=5&type=edit`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setIsOpen((prev) => !prev);
      setAgainCallFlag(true);
      toast.success(response.data.message);
    } catch (err) {
      console.log(err);
      const errorMessage =
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : "An unexpected error occurred";

      toast.error(errorMessage);
      // console.error(err);
    }
  };

  const onSearch = (value) => {
    // console.log("search:", value);
  };



  const handleSelectAll = (key, dataSource, dataKey) => {
    const allValues = dataSource.map((item) => item[dataKey]);
    // console.log(allValues);
    setInterestDet((prevState) => ({
      ...prevState,
      [key]: allValues ? "" : arrayValue,
    }));
  };
  const dropdownRender = (key, dataSource, dataKey) => (menu) =>
    (
      <div>
        <div
          style={{
            padding: "4px 8px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Button
            type="link"
            size="small"
            onClick={() => handleSelectAll(key, dataSource, dataKey)}
            style={{ color: " #A92525" }}
          >
            Select All
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              // Clear all selections by setting an empty string
              setInterestDet((prevState) => ({
                ...prevState,
                [key]: [],
              }));
            }}
            style={{ color: " #A92525" }}
          >
            Clear All
          </Button>
        </div>
        {menu}
      </div>
    );
  // const getFormData = async () => {
  //   if (userId) {
  //     try {
  //       const response = await apiurl.get(`/user-data/${userId}?page=5`);
  //       setInterestDatas(response?.data?.pageData?.selfDetails)
  //       const parseField = (field) => {
  //         if (field === "NA") return "NA";
  //         if (field === "" || field === "Select All") return "Select All";
  //         return field?.split(",").map((item) => parseInt(item?.trim()));
  //       };

  //       setInterestDet((prevState) => ({
  //         ...prevState,
  //         interests: parseField(response?.data?.pageData?.selfDetails?.interests),
  //         fun: parseField(response?.data?.pageData?.selfDetails?.fun),
  //         fitness: parseField(response?.data?.pageData?.selfDetails?.fitness),
  //         other: parseField(response?.data?.pageData?.selfDetails?.other),
  //       }));
  //     } catch (err) {}
  //   }
  // };

  const fetchData = () => {
    const userData = profileData[4];
    if (userData) {
      const data = profileData[4];

      const parseStringToArray = (field) => {
        if (field === "NA") return "NA";
        if (field === "" || field === "Select All") return ["Select All"];
        return field?.split(",").map((item) => parseInt(item?.trim()));
      };

      const handleNaNValues = (arr) => {
        if (!Array.isArray(arr) || arr.length === 0) return [];
        const containsNaN = arr.some((item) => isNaN(item));
        return containsNaN ? ["Select All"] : arr;
      };

      setInterestDet({
        fun: handleNaNValues(
          Array.isArray(data?.fun) ? data.fun : parseStringToArray(data?.fun)
        ),
        other: handleNaNValues(
          Array.isArray(data?.other)
            ? data.other
            : parseStringToArray(data?.other)
        ),
        fitness: handleNaNValues(
          Array.isArray(data?.fitness)
            ? data.fitness
            : parseStringToArray(data?.fitness)
        ),
        interests: handleNaNValues(
          Array.isArray(data?.interests)
            ? data.interests
            : parseStringToArray(data?.interests)
        ),
      });
    }

    setInterestDatas(userData);
  };

  useEffect(() => {
    fetchData();
  }, [againCallFlag]);






  
  return (
    <>
      <div className="shadow rounded-xl    py-3 mt-9 my-5  md:mb-0 mb-36 sm:mb-0  w-full overflow-hidden">
        <span className="flex justify-between items-center text-primary px-10 pe-5 py-2">
          <p className="  font-medium  text-[20px]">
            Additional Details & Interests
          </p>
          <span
            onClick={() => setIsOpen((prev) => !prev)}
            className="text-[20px] cursor-pointer flex items-center font-DMsans"
          >
            {!showProfile && (
              <>
                {" "}
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
        <span className="flex md:flex-row sm:flex-row flex-col  items-baseline justify-between font-DMsans  px-10 text-start pb-8">
          <span className=" mt-4  text-[17px] md:w-1/2 sm:w-1/2">
            <p className="  font-medium"> Interests</p>
            <p className=" font-light text-[15px] md:pe-36">
              {interestDatas?.interestsTypes
                ? interestDatas?.interestsTypes
                : "Select All"}
            </p>
            <p className=" pt-4 font-medium">Fun</p>
            <p className=" font-light text-[15px] md:pe-40">
              {!interestDatas?.funActivitiesTypes &&
              !interestDatas?.funActivitiesTypes
                ? "Select All"
                : interestDatas?.funActivitiesTypes}
            </p>
          </span>
          <span className="text-[17px] mt-5 md:w-1/2 sm:w-1/2">
            <p className="  font-medium">Fitness</p>
            <p className=" font-light text-[15px]">
              {!interestDatas?.fitnessTypes && !interestDatas?.fitnessTypes
                ? "Select All"
                : interestDatas?.fitnessTypes}
            </p>
            <p className=" pt-4 font-medium">Other Interests</p>
            <p className=" font-light text-[15px]">
              {!interestDatas?.otherTypes && !interestDatas?.otherTypes
                ? "Select All"
                : interestDatas?.otherTypes}
            </p>
          </span>
        </span>

        {isOpen && (
          <>
            <span className="flex md:flex-row sm:flex-row flex-col  items-baseline justify-between sm:gap-3  font-DMsans px-10 text-start pb-8 pt-5">
              <span className="md:w-1/2 sm:w-1/2 w-full md:pe-20">
                <label className="font-semibold  pt-5  ">Interests <span className="text-primary">*</span></label>
                <Select
                  name="interest"
                  showSearch
                  value={
                    Interestdet?.interests === "NA"
                      ? []
                      : Interestdet?.interests === ""
                      ? ["Select all"]
                      : Interestdet?.interests
                  }
                  placeholder="Interests"
                  optionFilterProp="children"
                  onChange={(value) => {
                    if (value.includes("Select all")) {
                      onChange("interests", ["Select all"]);
                    } else {
                      onChange("interests", value);
                    }
                  }}
                  onSearch={onSearch}
                  filterOption={filterOption}
                  mode="multiple"
                  dropdownRender={dropdownRender(
                    "interests",
                    interest,
                    "intrest_id"
                  )}
                  options={interest.map((interest) => ({
                    value: interest.intrest_id,
                    label: interest.intrest_name,
                  }))}
                  className="w-full custom-select font-DMsans"
                />
                <div className=" mb-2 mt-5">
                  <label className="font-semibold  pt-5  ">
                    Fun Activities <span className="text-primary">*</span>
                  </label>
                  <Select
                    name="fun"
                    showSearch
                    value={
                      Interestdet?.fun === "NA"
                        ? []
                        : Interestdet?.fun === ""
                        ? ["Select all"]
                        : Interestdet?.fun
                    }
                    placeholder="Fun Activities"
                    optionFilterProp="children"
                    onChange={(value) => {
                      if (value.includes("Select all")) {
                        onChange("fun", ["Select all"]);
                      } else {
                        onChange("fun", value);
                      }
                    }}
                    onSearch={onSearch}
                    filterOption={filterOption}
                    mode="multiple"
                    dropdownRender={dropdownRender(
                      "fun",
                      funActivity,
                      "funActivity_id"
                    )}
                    options={funActivity.map((fun) => ({
                      value: fun.funActivity_id,
                      label: fun.funActivity_name,
                    }))}
                    className="w-full custom-select font-DMsans"
                  />
                </div>
              </span>

              <span className="md:w-1/2 sm:w-1/2 w-full md:pe-20">
                <label className="font-semibold mt-2 mb-9  ">Fitness <span className="text-primary">*</span></label>

                <Select
                  name="interest"
                  showSearch
                  value={
                    Interestdet?.fitness === "NA"
                      ? []
                      : Interestdet?.fitness === ""
                      ? ["Select all"]
                      : Interestdet?.fitness
                  }
                  placeholder="Fitness"
                  optionFilterProp="children"
                  onChange={(value) => {
                    if (value.includes("Select all")) {
                      onChange("fitness", ["Select all"]);
                    } else {
                      onChange("fitness", value);
                    }
                  }}
                  onSearch={onSearch}
                  filterOption={filterOption}
                  mode="multiple"
                  dropdownRender={dropdownRender(
                    "fitness",
                    fitness,
                    "fitness_id"
                  )}
                  options={fitness.map((fit) => ({
                    value: fit.fitness_id,
                    label: fit.fitness_name,
                  }))}
                  className="w-full custom-select font-DMsans "
                />

                <div className=" mb-2 mt-5">
                  <label className="font-semibold mt-2 mb-9  ">
                    {" "}
                    Other interests <span className="text-primary">*</span>
                  </label>
                  <Select
                    name="other"
                    showSearch
                    value={
                      Interestdet?.other === "NA"
                        ? []
                        : Interestdet?.other === ""
                        ? ["Select all"]
                        : Interestdet?.other
                    }
                    placeholder="Other"
                    optionFilterProp="children"
                    onChange={(value) => {
                      if (value.includes("Select all")) {
                        onChange("other", ["Select all"]);
                      } else {
                        onChange("other", value);
                      }
                    }}
                    onSearch={onSearch}
                    filterOption={filterOption}
                    mode="multiple"
                    dropdownRender={dropdownRender("other", other, "OtherId")}
                    options={other.map((other) => ({
                      value: other.other_id,
                      label: other.other_name,
                    }))}
                    className="w-full custom-select font-DMsans "
                  />
                </div>
              </span>
            </span>

            <div className="flex items-center justify-end gap-5  mx-9 md:mb-9 sm:mb-10   font-DMsans">
              <span
                onClick={() => setIsOpen((prev) => !prev)}
                className="border border-primary text-primary px-5 rounded-md py-2 cursor-pointer"
              >
                Cancel
              </span>
              <span
                onClick={() => {
                  handleSubmitForm5();
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
export default InterestDetail;
