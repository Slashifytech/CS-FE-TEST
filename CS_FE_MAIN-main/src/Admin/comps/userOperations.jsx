import React, { useEffect, useRef, useState } from "react";
import { RiDeleteBin5Line } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import DeleteUserPopup from "./DeleteUserPopup";
import { useDispatch } from "react-redux";
import { setAdmin } from "../../Stores/slices/Admin";
import PdfData from "./PdfData";
import { FaBan } from "react-icons/fa";
import BanUserpopUp from "./BanPopUp";

const config = {
  headers: {
    Authorization: ``,
    "Content-Type": "application/json; charset=UTF-8",
  },
};

const UserOperation = ({
  key,
  index,
  handleUpdateCategory,
  userData,
  config,
  deleteUsers,
  currentPage,
  perPage,
  deleteData,
  userBan,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isBanOpen, setIsBanOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false); // Corrected state name
  const [selectedCategories, setSelectedCategories] = useState({});
  const pdfRef = useRef();
  const openDeletePopup = () => {
    setIsDeleteOpen(true); // Corrected function name
  };

  const closeDelete = () => {
    setIsDeleteOpen(false);
  };
  const openBanPopUp = () => {
    setIsBanOpen(true); 
  };
  const closeBan = () => {
    setIsBanOpen(false);
  };
  const handleDownloadClick = () => {
    if (pdfRef.current) {
      pdfRef.current.handleDownloadPDF();
    }
  };
  const handleCategoryChange = (e, userId) => {
    const { value, checked } = e.target;
    setSelectedCategories((prevState) => {
      const userCategories = prevState[userId] || [];
      if (checked) {
        // Add category to the user's selected categories
        return { ...prevState, [userId]: [...userCategories, value] };
      } else {
        // Remove category from the user's selected categories
        return {
          ...prevState,
          [userId]: userCategories.filter((category) => category !== value),
        };
      }
    });
  };

  const handleUserType = (id) => {
    dispatch(setAdmin("adminAction"));
    navigate("/profile", { state: { userId: id } });
  };
  const categoriesOption = ["A", "B", "C"];
  useEffect(() => {
    const category = {
      [userData._id]: userData.category ? userData.category.split(",") : [],
    };
    setSelectedCategories(category);
  }, [userData]);

  const admin_view = "admin_View";
  return (
    <>
      <ul className="  text-[15px] py-7  flex flex-row justify-evenly  items-center md:mx-10 sm;mx-6 mx-6  md:ml-64 sm:ml-64 ml-6 gap-2  rounded-lg mt-8 h-[6vh] md:w-[83%] w-[190%] text-black font-normal">
        <li className="w-[3%] ">
          {(currentPage - 1) * parseInt(10) + index + 1}
        </li>
        <li className="md:w-[12%] w-[15%] sm:w-[12%] text-center overflow-x-scroll md:overflow-hidden  sm:overflow-hidden">
          {userData?.userId}
        </li>
        <li className="md:w-[15%] w-[20%] sm:w-[15%] text-center">
          {userData?.basicDetails[0]?.name?.replace("undefined", "")}
        </li>
        <li className="md:w-[12%] w-[12%] sm:w-[11%] text-center flex items-center">
          {categoriesOption?.map((option, idx) => (
            <span key={idx} className="">
              <input
                type="checkbox"
                className="bg-[#F0F0F0] rounded-md mt-2 mx-1"
                onChange={(e) => handleCategoryChange(e, userData?._id)}
                onClick={(e) => handleUpdateCategory(e, userData?._id)}
                name="categories"
                value={option}
                checked={selectedCategories[userData._id]?.includes(option)}
              />
              <label>{option}</label>
            </span>
          ))}
        </li>

        <Link
          to="/profile"
          state={{
            userId: userData?._id,
            location: location.pathname,
            AdminViewProfile: admin_view,
          }}
          className="md:w-[7%] text-center px-3 py-1 bg-primary text-white rounded-md cursor-pointer"
        >
          View
        </Link>
        <span
          onClick={handleDownloadClick}
          className="md:w-[10%] text-center px-3 py-1 bg-primary text-white rounded-md cursor-pointer"
        >
          Download
        </span>

        <li className="md:w-[10%] w-[10%] sm:[13%] text-center flex items-center gap-2">
          <span className=" flex items-center gap-6">
            <span className="flex items-center gap-2">
              {/* <span >
            <IoPencilOutline />{" "}
          </span>{" "}
          <span onClick={() => handleUserType(userData?._id)}  className="cursor-pointer">Edit</span> */}
            </span>

            <span>
              {userData?.isDeleted === true ? (
                <span className="bg-red-500 text-white rounded-md p-2">
                  Deleted
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <RiDeleteBin5Line />
                  <span
                    className="cursor-pointer"
                    onClick={() => {
                      // deleteUsers(userData._id);
                      openDeletePopup();
                    }}
                  >
                    Delete
                  </span>
                </span>
              )}
            </span>
          </span>

          <span
            onClick={openBanPopUp}
            className="flex items-center  cursor-pointer"
          >
            <span className=" text-primary">
              <FaBan />{" "}
            </span>{" "}
            <span className="pl-2">Ban</span>
          </span>
        </li>
      </ul>
      <span className="hidden">
        <PdfData ref={pdfRef} userId={userData?._id} />
      </span>
      <DeleteUserPopup
        isDeleteOpen={isDeleteOpen}
        userId={userData?._id}
        closeDelete={closeDelete}
        deleteUsers={deleteData}
      />
      <BanUserpopUp
        userBan={userBan}
        isBanOpen={isBanOpen}
        closeBan={closeBan}
        userId={userData?._id}
      />
    </>
  );
};

export default UserOperation;
