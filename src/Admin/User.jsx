import React, { useEffect, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import Nav from "./Nav";
import { getToken } from "../Stores/service/getToken";
import UserOperation from "./comps/userOperations";
import apiurl from "../util";
import Pagination from "./comps/Pagination";
import { toast } from "react-toastify";
import DataNotFound from "../components/DataNotFound";
import Loading from "../components/Loading";
import { useDispatch, useSelector } from "react-redux";
import { setAdmin } from "../Stores/slices/Admin";
import { useLocation, useNavigate } from "react-router-dom";

const config = {
  headers: {
    Authorization: ``,
    "Content-Type": "application/json; charset=UTF-8",
  },
};

const User = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const passPage = "passPage"

  const [isCategoryData, setIsCategoryData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [totalUsersCount, setTotalUsersCount] = useState(0);
  const [totalPagesCount, setTotalPagesCount] = useState({});
  const [page, setPage] = useState(1);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isBanUser, setIsBanUser] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const userDataAddedByAdmin = useSelector(state => state.admin.userDataAddedByAdmin); // Accessing from Redux store

  const perPage = 10; // Number of users per page

  const getPageFromURL = () => {
    const searchParams = new URLSearchParams(location.search);
    return parseInt(searchParams.get("page")) || 1;
  };
  const handleUpdateCategory = async (e, userId) => {
    try {
      const token = getToken();
      config["headers"]["Authorization"] = `Bearer ` + token;
      await apiurl.put(
        `/update-user-category/${userId}`,
        { categoryType: e.target.value },
        config
      );
      toast.success("Category updated Successfully");
    } catch (err) {
      console.log(err);
    }
  };
  
  const getAllUsers = async (page = 1, options = {}) => {
    try {
      const token = getToken();
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json; charset=UTF-8",
        },
        params: {
          page,
          limit: perPage,
        },
      };
      if (options.search) {
        config.params.page = 1;
        config.params.search = options.search;
        page = 1;
      }
      const response = await apiurl.get("/get-all-user-data-admin", config);
      setAllUsers(response.data?.result?.data);
      setCurrentPage(page);
      setTotalPagesCount(response.data.lastPage);
      setTotalUsersCount(response.data.totalUsersCount);
      setIsCategoryData(response.data?.result?.data[0]?.category);
      setIsDeleted(false);
      setIsBanUser(false);
      navigate(`?page=${page}`);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const downloadPDF = async () => {
    try {
      // Replace 'user_id_here' with the actual user ID
      const response = await apiurl.get("/downloadUsers");

      // Create a blob URL to download the PDF
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", ` users.csv`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };

  const deleteUsers = async (userId) => {
    try {
      const token = getToken();
      config["headers"]["Authorization"] = `Bearer ` + token;
      await apiurl.put(`/delete-user/${userId}`, { type: "delete" }, config);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteData = async (userId, deleteReason, additionalOptions = {}) => {
    if (userId) {
      try {
        if (additionalOptions.marriageFixedOption) {
          deleteReason += `, fixed by connecting soulmate: ${additionalOptions.marriageFixedDecision}`;
        }
        const token = getToken();
        config["headers"]["Authorization"] = `Bearer ` + token;
        await apiurl.put(
          `/delete-user/${userId}`,
          { type: "delete" },
          config,
          userId,
          deleteReason
        );
        setIsDeleted(true);
      } catch (err) {
        // Handle the error
        console.error(err);
      }
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setPage(1); // Reset page to 1 when performing a search
    getAllUsers(1, { search: query }); // Immediately fetch results for the new query
  };

  useEffect(() => {
    const delayDebounceFn = () => {
      const page = getPageFromURL();
      getAllUsers(page, { search: searchQuery });
    };

    delayDebounceFn();

    return () => {};
  }, [searchQuery, page, isDeleted, isBanUser]);

  const handlePageChange = (pageNumber) => {
    getAllUsers(pageNumber, { search: searchQuery });
  };

  const handleUserType = () => {
 
  
    dispatch(setAdmin("adminAction"));
  
    // Ensure `registrationPage` is defined
    const registrationPage = userDataAddedByAdmin?.registrationPage;
    const targetPath = registrationPage ? `/registration-form/${registrationPage}` : '/signup-newUser';
    
    navigate(targetPath, {state: passPage});
  };

  const banUser = async (userId, banReason) => {
    try {
      const token = getToken();
      config["headers"]["Authorization"] = `Bearer ` + token;
      const response = await apiurl.post(
        "/ban-user",
        {
          userId: userId,
          banReason: banReason,
        },
        config
      );
      setIsBanUser(true);
      toast.success("User Banned Successfully");
      return response.data;
    } catch (error) {
      console.log(error);
      toast.error("Something Went Wrong");
    }
  };

  const categoriesOption = ["A", "B", "C"];
  return (
    <>
      <div className="fixed">
        <span className="absolute">
          <Nav />
        </span>
      </div>
      <div className="md:px-16 md:pt-10 pt-20 md:mx-0 mx-6 md:ml-56 ">
        <p className="font-semibold text-[30px]  font-montserrat ">User List</p>
        <span className="md:flex md:justify-between  mt-9 md:gap-96">
          <span className="font-DMsans">
            <p
              onClick={handleUserType}
              className="bg-primary sm:ml-64 md:ml-0 ml-0 text-white md:px-12  px-6 md:mr-0 mr-32 sm:mr-72 mt-6 md:mt-0 py-2 rounded-lg cursor-pointer"
            >
              + Add New User
            </p>
            <p className="bg-[#F0F0F0] mt-5 text-center rounded-lg py-2 w-36  font-medium sm:ml-64 md:ml-0 ml-0">
              Total Users : {totalUsersCount}
            </p>
          </span>
          <span className="flex flex-col  mt-3 md:mt-0  sm:ml-64 md:ml-0 ml-0">
            <div className="flex  rounded-lg">
              <span className=" text-[23px] pt-2 px-3  rounded-l-md bg-[#F0F0F0]">
                {" "}
                <IoSearchOutline  />
              </span>
              <input
                type="text"
                className=" py-2  bg-[#F0F0F0]  rounded-r-md outline-none md:w-[42vh] sm:w-52   "
                placeholder="Search"
                onChange={handleSearch}
              />
            </div>
            <span
              onClick={downloadPDF}
              className="text-white bg-primary mt-5 py-2 sm:mr-40  md:mr-0 mr-0 rounded-lg text-center md:w-[28vh] cursor-pointer"
            >
              Download
            </span>
          </span>
        </span>
      </div>
      <div className="  overflow-x-scroll w-[100%] md:w-[100%] scrollbar-hide ">
        <ul className=" bg-[#F0F0F0] text-[15px] py-7  flex flex-row justify-evenly  items-center md:mx-0 mx-6 md:ml-64 sm:ml-64 gap-2  rounded-lg mt-8 h-[6vh] md:w-[84%] w-[200%] text-black font-medium  ">
          <li className="w-[5%] ">S.No</li>
          <li className="md:w-[11%] w-[16%] sm:w-[12%] text-center">User Id</li>
          <li className="md:w-[15%] w-[19%] sm:w-[15%] text-center">
            Name of the user
          </li>
          <li className="md:w-[13%] w-[12%] sm:w-[12%] text-center">
            Category
          </li>
          <li className="md:w-[22%] w-[18%] sm:w-[20%] text-center">
            View/Download Profiles
          </li>
          {/* <li className="w-[10%] text-center">Download Profile PDf</li> */}
          <li className="md:w-[13%] w-[15%] sm:w-[12%] text-center">Actions</li>
        </ul>

        {loading ? (
          <div className="mt-28 ml-52">
            <Loading customText={"Loading"} />
          </div>
        ) : allUsers.length === 0 ? (
          <DataNotFound
            className="flex flex-col items-center md:ml-36  mt-11 sm:ml-28 sm:mt-20"
            message="No data available to show"
            linkText="Back to Dashboard"
            linkDestination="/user-dashboard"
          />
        ) : (
          allUsers.map((item, index) => (
            <UserOperation
              key={index}
              handleUpdateCategory={handleUpdateCategory}
              categoriesOptions={categoriesOption}
              userData={item}
              deleteUsers={deleteUsers}
              isCategoryData={isCategoryData}
              currentPage={currentPage}
              perPage={perPage}
              index={index}
              isDeleted={isDeleted}
              deleteData={deleteData}
              userBan={banUser}
            />
          ))
        )}

        <div className="flex justify-center items-center mt-3 mb-5 ml-52">
          <Pagination
            currentPage={currentPage}
            hasNextPage={currentPage * perPage < totalUsersCount}
            hasPreviousPage={currentPage > 1}
            onPageChange={handlePageChange}
            totalPagesCount={totalPagesCount}
          />
        </div>
      </div>
    </>
  );
};

export default User;
