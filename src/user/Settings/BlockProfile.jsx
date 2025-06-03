import React, { useState, useEffect, useCallback } from "react";
import Header from "../../components/Header";
import SideBar from "../Dashboard/SideBar";
import Card from "../../components/Card";
import DataNotFound, { BackArrow } from "../../components/DataNotFound";
import { useSelector } from "react-redux";
import apiurl from "../../util";
import { userDataStore } from "../../Stores/slices/AuthSlice";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Pagination from "../../Admin/comps/Pagination";
import { useLocation, useNavigate } from "react-router-dom";

const BlockProfile = () => {
  const [isBlocked, setIsBlocked] = useState(false);
  const { userId } = useSelector(userDataStore);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(false); 
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPagesCount, setTotalPagesCount] = useState(0);
  const perPage = 10;
  const location = useLocation();
  const navigate = useNavigate();
  const [totalUsersCount, setTotalUsersCount] = useState(0);
      const routeString = localStorage.getItem('enString')

  const getPageFromURL = () => {
    const searchParams = new URLSearchParams(location.search);
    return parseInt(searchParams.get('page')) || 1;
  };

  const fetchBlockedUsers = useCallback(async (page = 1) => {
    if (userId) {
      setPageLoading(true); 
      try {
        const response = await apiurl.get(`/get-blocked-users/${userId}`, {
          params: { page, limit: perPage }
        });

        const fetchedBlockedUsers = response?.data?.blockedUsers || [];
        setBlockedUsers(fetchedBlockedUsers);
        setTotalUsersCount(response.data.totalUsersCount);
        setTotalPagesCount(response.data.lastPage);
        setCurrentPage(page);

        // if (page > 1 && fetchedBlockedUsers.length === 0) {
        //   navigate(`?page=${page - 1}`);
        //   return;
        // }

        setIsBlocked(false);
      } catch (error) {
        console.error("Error fetching blocked users:", error);
      } finally {
        setIsLoading(false);
        setPageLoading(false);
      }
    }
  }, [userId, perPage, navigate]);

  const handlePageChange = useCallback((pageNumber) => {
    navigate(`?page=${pageNumber}`);
  }, [navigate]);

  useEffect(() => {
    const page = getPageFromURL();
    fetchBlockedUsers(page);
  }, [location.search, userId, isBlocked]);

  const handleChildStateChange = (newId) => {
    console.log(newId, "id");
    const page = getPageFromURL();
    
    setBlockedUsers((prevData) => {
      return prevData.filter(item => item._id !== newId);
    });
  
    if (page > 1 && blockedUsers?.length === 1) {
      navigate(`?page=${page - 1}`);
      fetchBlockedUsers(page - 1);
      return;
    }       
  };
  
console.log(blockedUsers, "klk")
  return (
    <>
      <Header />
      <div className="md:block hidden sm:block">
        <SideBar />
      </div>
      <BackArrow className="sm:hidden md:hidden block" />

      <div className="md:px-9 py-3 px-6 mb-36 md:mb-5 md:mx-28 my-5 rounded-md md:ml-96 sm:ml-72 sm:mt-36 sm:mb-9 md:mt-40 mt-7 mx-6">
        {isLoading || pageLoading ? (
          <LoadingSkeleton />
        ) : blockedUsers?.length === 0 ? (
          <DataNotFound
            className="flex flex-col items-center mt-11 sm:mt-20"
            message="You have not blocked any profile"
            linkText="Back to Dashboard"
            linkDestination={`/user-dashboard/${routeString}`}
          />
        ) : (
          <>
            {blockedUsers?.map((item, index) => (
              <Card
                key={index}
                item={item}
                type={"blockedUsers"}
                setIsBlocked={setIsBlocked}
                onFilterData={handleChildStateChange}
              />
            ))}
            <PaginationWrapper
              currentPage={currentPage}
              totalUsersCount={totalUsersCount}
              perPage={perPage}
              handlePageChange={handlePageChange}
              totalPagesCount={totalPagesCount}
            />
          </>
        )}
      </div>
    </>
  );
};

const LoadingSkeleton = React.memo(() => (
  <>
    <div className="w-full mt-9">
      <Skeleton height={300} />
    </div>
    <div className="w-full mt-9">
      <Skeleton height={300} />
    </div>
  </>
));

const PaginationWrapper = React.memo(({ currentPage, totalUsersCount, perPage, handlePageChange, totalPagesCount }) => (
  <div className="flex justify-center items-center mt-3 mb-20 ml-4">
    <Pagination
      currentPage={currentPage}
      hasNextPage={currentPage * perPage < totalUsersCount}
      hasPreviousPage={currentPage > 1}
      onPageChange={handlePageChange}
      totalPagesCount={totalPagesCount}
    />
  </div>
));

export default BlockProfile;
