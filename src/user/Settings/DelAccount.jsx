// import React, { useState } from "react";
// import Header from "../../components/Header";
// import SideBar from "../Dashboard/SideBar";
// import { BackArrow } from "../../components/DataNotFound";
// import DeleteProfilePop from "../PopUps/DeleteProfilePop";
// import { useDispatch, useSelector } from "react-redux";
// import apiurl from "../../util";
// import { userDataStore } from "../../Stores/slices/AuthSlice";

// const DelAccount = () => {
//   const [deleteAccount, setDeleteAccount] = useState({
//     deleteProfile: "",
//     marriageFixedOption: false,
//     marriageFixedDecision: "",
//     isSuccessFulMarraige: false,
//   });

//   const { userId } = useSelector(userDataStore);
//   const [isDeleteOpen, setIsDeleteOpen] = useState(false);
//   const [validationError, setValidationError] = useState("");

//   const validate = () => {
//     if (!deleteAccount.deleteProfile) {
//       setValidationError("Please select a reason for profile deletion.");
//       return false;
//     }
//     if (deleteAccount.deleteProfile === "Marriage Fixed" && !deleteAccount.marriageFixedDecision) {
//       setValidationError("Please select 'Yes' or 'No' for marriage fixed by Connecting Soulmate.");
//       return false;
//     }
//     return true;
//   };

//   const openDeletePopup = () => {
//     if (validate()) {
//       setIsDeleteOpen(true);
//     }
//   };

//   const deleteData = async () => {
//     if (userId) {
//       try {
//         let deleteReason = deleteAccount.deleteProfile;
//         if (deleteAccount.marriageFixedOption === true) {
//           deleteReason += `, fixed by connecting soulmate: ${deleteAccount.marriageFixedDecision}`;
//         }
//         await apiurl.put(`/delete-user`, {
//           userId,
//           deleteReason,
//         });
//       } catch (err) {
//         console.error("Failed to delete user:", err);
//       }
//     }
//   };

//   const closeDelete = () => {
//     setIsDeleteOpen(false);
//   };

//   const handleInput = (e) => {
//     const { value, name } = e.target;
//     if (name === "deleteProfile" && value === "Marriage Fixed") {
//       setDeleteAccount((prevState) => ({
//         ...prevState,
//         [name]: value,
//         marriageFixedOption: true,
//       }));
//     } else {
//       setDeleteAccount((prevState) => ({
//         ...prevState,
//         [name]: value,
//         marriageFixedOption: false,
//         marriageFixedDecision: "",
//       }));
//     }
//     setValidationError(""); // Clear validation error on change
//   };

//   const handleDecision = (e) => {
//     const { value } = e.target;
//     setDeleteAccount((prevState) => ({
//       ...prevState,
//       marriageFixedDecision: value,
//       isSuccessFulMarraige: value === "Yes",
//     }));
//     setValidationError(""); // Clear validation error on change
//   };

//   const deleteOptions = ["Marriage Fixed", "Married", "Other Reason"];

//   return (
//     <>
//       <Header />
//       <div className="md:block hidden sm:block">
//         <SideBar />
//       </div>
//       <BackArrow className="sm:hidden md:hidden block" />
//       <div className="shadow md:px-9 py-3 px-6 mb-36 md:mb-5 md:mx-28 my-5 rounded-md md:ml-96 sm:ml-72 sm:mt-36 sm:mb-9 md:mt-40 mt-7 mx-6">
//         <DeleteProfilePop
//           deleteData={deleteData}
//           isDeleteOpen={isDeleteOpen}
//           closeDelete={closeDelete}
//         />
//         <span>
//           <p className="font-semibold mb-3 text-[22px]">Delete Profile</p>
//           <p>Please choose a reason for profile deletion.</p>
//           <p>Note: If you delete your profile, it cannot be restored.</p>
//           <span className="flex flex-col">
//             {deleteOptions.map((option, index) => (
//               <span key={index}>
//                 <input
//                   type="radio"
//                   className="bg-[#F0F0F0] rounded-md mt-2 mx-1"
//                   onChange={handleInput}
//                   id={`deleteProfile${index}`}
//                   name="deleteProfile"
//                   value={option}
//                 />
//                 <label htmlFor={`deleteProfile${index}`}>{option}</label>
//                 {deleteAccount.marriageFixedOption && option === "Marriage Fixed" && (
//                   <div className="">
//                     <p className="mr-2 mb-2">
//                       Is your marriage fixed by Connnecting Soulmate?
//                     </p>
//                     <span className="flex mx-1">
//                       <div className="mr-4">
//                         <input
//                           type="radio"
//                           id="yesOption"
//                           name="marriageFixedDecision"
//                           value="Yes"
//                           onChange={handleDecision}
//                           className="me-2"
//                         />
//                         <label htmlFor="yesOption">Yes</label>
//                       </div>
//                       <div>
//                         <input
//                           type="radio"
//                           id="noOption"
//                           name="marriageFixedDecision"
//                           value="No"
//                           onChange={handleDecision}
//                           className="me-2"
//                         />
//                         <label htmlFor="noOption">No</label>
//                       </div>
//                     </span>
//                   </div>
//                 )}
//               </span>
//             ))}
//           </span>
//           {validationError && <p className="text-red-500">{validationError}</p>}
//           <div className="mt-6 m-2">
//             <span
//               className="bg-primary px-6 py-2 rounded-lg text-white cursor-pointer"
//               onClick={openDeletePopup}
//             >
//               Delete
//             </span>
//           </div>
//         </span>
//       </div>
//     </>
//   );
// };

// export default DelAccount;
import React, { useState } from "react";
import Header from "../../components/Header";
import SideBar from "../Dashboard/SideBar";
import { BackArrow } from "../../components/DataNotFound";
import DeleteProfilePop from "../PopUps/DeleteProfilePop";
import { useSelector } from "react-redux";
import apiurl from "../../util";
import { userDataStore } from "../../Stores/slices/AuthSlice";
import { getToken } from "../../Stores/service/getToken";

const DelAccount = () => {
  const [deleteAccount, setDeleteAccount] = useState({
    deleteProfile: "",
    marriageFixedOption: false,
    marriageFixedDecision: "",
    marriedOption: false,
    marriedDecision: "",
    isSuccessFulMarraige: false,
  });

  const { userId } = useSelector(userDataStore);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [validationError, setValidationError] = useState("");

  const validate = () => {
    if (!deleteAccount.deleteProfile) {
      setValidationError(
        "⁠Please select a reason why you are deleting the profile."
      );
      return false;
    }
    if (
      deleteAccount.deleteProfile === "Marriage Fixed" &&
      !deleteAccount.marriageFixedDecision
    ) {
      setValidationError(
        "Please select 'Yes' or 'No' for marriage fixed by Connecting Soulmate."
      );
      return false;
    }
    if (
      deleteAccount.deleteProfile === "Married" &&
      !deleteAccount.marriedDecision
    ) {
      setValidationError(
        "Please select 'Yes' or 'No' for married from Connecting Soulmate."
      );
      return false;
    }
    return true;
  };

  const openDeletePopup = () => {
    if (validate()) {
      setIsDeleteOpen(true);
    }
  };

  const deleteData = async () => {
    if (userId) {
      try {
        const token = getToken();
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json; charset=UTF-8",
          },
        };
        let deleteReason = deleteAccount.deleteProfile;
        if (deleteAccount.marriageFixedOption) {
          deleteReason += `, fixed by connecting soulmate: ${deleteAccount.marriageFixedDecision}`;
        }
        if (deleteAccount.marriedOption) {
          deleteReason += `, married from connecting soulmate: ${deleteAccount.marriedDecision}`;
        }
        await apiurl.put(
          `/delete-user`,
          {
            userId,
            deleteReason,
          },
          config
        );
      } catch (err) {
        console.error("Failed to delete user:", err);
      }
    }
  };

  const closeDelete = () => {
    setIsDeleteOpen(false);
  };

  const handleInput = (e) => {
    const { value, name } = e.target;
    if (name === "deleteProfile" && value === "Marriage Fixed") {
      setDeleteAccount((prevState) => ({
        ...prevState,
        [name]: value,
        marriageFixedOption: true,
        marriedOption: false,
        marriedDecision: "",
      }));
    } else if (name === "deleteProfile" && value === "Married") {
      setDeleteAccount((prevState) => ({
        ...prevState,
        [name]: value,
        marriageFixedOption: false,
        marriageFixedDecision: "",
        marriedOption: true,
      }));
    } else {
      setDeleteAccount((prevState) => ({
        ...prevState,
        [name]: value,
        marriageFixedOption: false,
        marriageFixedDecision: "",
        marriedOption: false,
        marriedDecision: "",
      }));
    }
    setValidationError(""); // Clear validation error on change
  };

  const handleDecision = (e) => {
    const { value, name } = e.target;
    setDeleteAccount((prevState) => ({
      ...prevState,
      [name]: value,
      isSuccessFulMarraige: value === "Yes",
    }));
    setValidationError(""); // Clear validation error on change
  };

  const deleteOptions = ["Marriage Fixed", "Married", "Other Reason"];

  return (
    <>
      <Header />
      <div className="md:block hidden sm:block">
        <SideBar />
      </div>
      <BackArrow className="sm:hidden md:hidden block" />
      <div className="shadow md:px-9 py-3 px-6 mb-36 md:mb-5 md:mx-28 my-5 rounded-md md:ml-96 sm:ml-72 sm:mt-36 sm:mb-9 md:mt-40 mt-7 mx-6">
        <DeleteProfilePop
          deleteData={deleteData}
          isDeleteOpen={isDeleteOpen}
          closeDelete={closeDelete}
        />
        <span>
          <p className="font-semibold mb-3 text-[22px]">Delete Profile</p>
          <p>Please choose a reason to delete your profile.</p>
          <p>Note: If you delete your profile, it cannot be restored.</p>
          <span className="flex flex-col">
            {deleteOptions.map((option, index) => (
              <span key={index}>
                <input
                  type="radio"
                  className="bg-[#F0F0F0] rounded-md mt-2 mx-1"
                  onChange={handleInput}
                  id={`deleteProfile${index}`}
                  name="deleteProfile"
                  value={option}
                />
                <label htmlFor={`deleteProfile${index}`}>{option}</label>
                {deleteAccount.marriageFixedOption &&
                  option === "Marriage Fixed" && (
                    <div className="">
                      <p className="mr-2 mb-2">
                        Is your marriage fixed by Connnecting Soulmate?
                      </p>
                      <span className="flex mx-1">
                        <div className="mr-4">
                          <input
                            type="radio"
                            id="yesOptionMarriage"
                            name="marriageFixedDecision"
                            value="Yes"
                            onChange={handleDecision}
                            className="me-2"
                          />
                          <label htmlFor="yesOptionMarriage">Yes</label>
                        </div>
                        <div>
                          <input
                            type="radio"
                            id="noOptionMarriage"
                            name="marriageFixedDecision"
                            value="No"
                            onChange={handleDecision}
                            className="me-2"
                          />
                          <label htmlFor="noOptionMarriage">No</label>
                        </div>
                      </span>
                    </div>
                  )}
                {deleteAccount.marriedOption && option === "Married" && (
                  <div className="">
                    <p className="mr-2 mb-2">
                      Married from Connecting Soulmate?
                    </p>
                    <span className="flex mx-1">
                      <div className="mr-4">
                        <input
                          type="radio"
                          id="yesOptionMarried"
                          name="marriedDecision"
                          value="Yes"
                          onChange={handleDecision}
                          className="me-2"
                        />
                        <label htmlFor="yesOptionMarried">Yes</label>
                      </div>
                      <div>
                        <input
                          type="radio"
                          id="noOptionMarried"
                          name="marriedDecision"
                          value="No"
                          onChange={handleDecision}
                          className="me-2"
                        />
                        <label htmlFor="noOptionMarried">No</label>
                      </div>
                    </span>
                  </div>
                )}
              </span>
            ))}
          </span>
          {validationError && <p className="text-red-500">{validationError}</p>}
          <div className="mt-6 m-2">
            <span
              className="bg-primary px-6 py-2 rounded-lg text-white cursor-pointer"
              onClick={openDeletePopup}
            >
              Delete
            </span>
          </div>
        </span>
      </div>
    </>
  );
};

export default DelAccount;
