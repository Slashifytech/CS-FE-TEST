

import React, { useState } from "react";

const DeleteUserPopup = ({
  isDeleteOpen,
  closeDelete,
  deleteUsers,
  userId,
}) => {
  const [deleteAccount, setDeleteAccount] = useState({
    deleteProfile: "",
    marriageFixedOption: false,
    marriageFixedDecision: "",
    marriedOption: false,
    marriedDecision: "",
    isSuccessFulMarraige: false,
  });

  const [validationError, setValidationError] = useState("");

  const additionalOptions = {
    marriageFixedOption: deleteAccount.marriageFixedOption,
    marriageFixedDecision: deleteAccount.marriageFixedDecision,
    marriedOption: deleteAccount.marriedOption,
    marriedDecision: deleteAccount.marriedDecision,
  };

  const handleInput = (e) => {
    const { value, name } = e.target;
    if (name === "deleteProfile") {
      if (value === "Marriage Fixed") {
        setDeleteAccount((prevState) => ({
          ...prevState,
          [name]: value,
          marriageFixedOption: true,
          marriageFixedDecision: "",
          marriedOption: false,
          marriedDecision: "",
        }));
      } else if (value === "Married") {
        setDeleteAccount((prevState) => ({
          ...prevState,
          [name]: value,
          marriageFixedOption: false,
          marriageFixedDecision: "",
          marriedOption: true,
          marriedDecision: "",
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

  const validate = () => {
    if (!deleteAccount.deleteProfile) {
      setValidationError("⁠Please select a reason why you are deleting the profile.");
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

  const handleDelete = () => {
    if (validate()) {
      closeDelete();
      deleteUsers(userId, deleteAccount.deleteProfile, additionalOptions);
    }
  };

  const deleteOptions = ["Marriage Fixed", "Married", "Other Reason"];

  return (
    <>
      {isDeleteOpen && (
        <div
          className={`fixed inset-0 flex items-center justify-center popup-backdrop z-50 sm:px-52 px-6 ${
            isDeleteOpen ? "block" : "hidden"
          }`}
        >
          <div className="bg-white pb-9 rounded-lg md:w-[58%] w-full relative p-9 app-open-animation">
            <span>
              <p className="font-semibold mb-3 text-[22px]">Delete Profile</p>
              <p className="font-medium">
              Please choose a reason to delete your profile.

              </p>
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
                        <div>
                          <p className="mr-2 mb-2">
                            Is your marriage fixed by Connecting Soulmate?
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
                    {deleteAccount.marriedOption &&
                      option === "Married" && (
                        <div>
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
              {validationError && (
                <p className="text-red-500">{validationError}</p>
              )}
              <div className="mt-6 m-2 flex justify-between items-center mx-32 gap-3">
                <span
                  onClick={closeDelete}
                  className="px-8 py-2 cursor-pointer rounded-lg text-primary border border-primary"
                >
                  No
                </span>
                <span
                  className="bg-primary px-6 py-2 rounded-lg text-white cursor-pointer"
                  onClick={handleDelete}
                >
                  Delete
                </span>
              </div>
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteUserPopup;
