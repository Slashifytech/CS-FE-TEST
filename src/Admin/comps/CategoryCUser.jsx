import React, { useEffect, useState } from "react";
import HeaderTab from "./HeaderTab";
import apiurl from "../../util";
import Nav from "../Nav";
import Pagination from "./Pagination";
import Loading from "../../components/Loading";
import DataNotFound from "../../components/DataNotFound";
import { Link } from "react-router-dom";

const CategoryCUser = () => {
  const [categoryCUsers, setCategoryCUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;
  const [totalUsersCount, setTotalUsersCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [totalPagesCount, setTotalPagesCount] = useState(0);

  const fetchTotalCategoryCUsers = async (page = 1, limit = perPage) => {
    try {
      setLoading(true);
      const response = await apiurl.get("/total-users-category-c", {
        params: { page, limit },
      });
      setCategoryCUsers(response.data.users);
      setTotalUsersCount(response.data.totalUsersCount);
      setTotalPagesCount(response.data.lastPage);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching total female users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (pageNumber) => {
    fetchTotalCategoryCUsers(pageNumber);
  };

  useEffect(() => {
    fetchTotalCategoryCUsers();
  }, []);

  return (
    <>
      <div className="fixed">
        <span className="absolute">
          <Nav />
        </span>
      </div>
      <div className="ml-[16%] sm:ml-[28%]">
        <HeaderTab />
      </div>
      <div className="w-[100%] md:w-[100%] sm:w-[100%] overflow-x-scroll scrollbar-hide">
        <div className="flex flex-row justify-between md:mx-36 mx-6 md:ml-[27%] sm:ml-[40%] w-[220%]  md:w-[65%] sm:w-[90%] font-semibold text-center text-[17px] items-start font-DMsans mb-6">
          <p className="w-5">S.No</p>
          <p className="text-start w-16">User Id</p>
          <p className="w-36 text-start">Name</p>
          <p className="w-5 text-center">Profile</p>

          <p className="w-20">Gender</p>
        </div>
        {loading ? (
          <div className="mt-28 ml-52">
            <Loading customText={"Loading"} />
          </div>
        ) : categoryCUsers.length === 0 ? (
          <DataNotFound
            className="flex flex-col items-center md:ml-36 mt-11 sm:ml-28 sm:mt-20"
            message="No Data Available"
            linkText="Back to Dashboard"
            linkDestination="/admin/dashboard"
          />
        ) : (
          <CategoryCData
            categoryCUsers={categoryCUsers}
            currentPage={currentPage}
            perPage={perPage}
          />
        )}

        {categoryCUsers.length > 0 && (
          <div className="flex justify-center items-center mt-3 mb-20 ml-52">
            <Pagination
              currentPage={currentPage}
              hasNextPage={currentPage * perPage < totalUsersCount}
              hasPreviousPage={currentPage > 1}
              onPageChange={handlePageChange}
              totalPagesCount={totalPagesCount}
            />
          </div>
        )}
      </div>
    </>
  );
};

const CategoryCData = ({ categoryCUsers, currentPage, perPage }) => {
  //   console.log(femaleUsers, "ddn");
  return (
    <div className="flex flex-col md:mx-40  md:ml-[27%] ml-[8%] sm:ml-[41%] mx-6  md:w-[60%] w-[220%] sm:w-[90%] font-normal text-black text-[15px] items-start  font-DMsans mb-9">
      {categoryCUsers?.map((item, index) => (
        <div
          key={item.userId}
          className="flex flex-row justify-between w-full my-5"
        >
          <p className="w-3">{(currentPage - 1) * perPage + index + 1}</p>
          <p className="text-start w-36">{item?.userId}</p>
          <p className="text-start w-60">
            {item?.basicDetails[0]?.name?.replace("undefined", "")}
          </p>
          <Link
            to="/profile"
            state={{
              userId: item?._id,
              location: location.pathname,
            }}
            className="bg-primary text-white px-3 flex rounded-md cursor-pointer py-1 h-8"
          >
            View Profile
          </Link>
          <p className="text-start md:w-0 w-16">
            {item?.gender === "F" ? "Female" : "Male"}
          </p>
        </div>
      ))}
    </div>
  );
};

export default CategoryCUser;
