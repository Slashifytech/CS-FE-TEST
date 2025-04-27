import React, { useEffect, useState, useCallback } from "react";
import Match from "./Match";
import Card from "../../components/Card";
import { useSelector } from "react-redux";
import { userDataStore } from "../../Stores/slices/AuthSlice";
import apiurl from "../../util";
import DataNotFound from "../../components/DataNotFound";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Pagination from "../../Admin/comps/Pagination";
import { useLocation, useNavigate } from "react-router-dom";

const NewJoin = () => {
  const { userData, userId } = useSelector(userDataStore);
  const isToggle = useSelector((state) => state.toggle.isToggle);
  
  const [isLoading, setIsLoading] = useState(true);
  const [matchData, setMatchData] = useState([]);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsersCount, setTotalUsersCount] = useState(0);
  const [totalPagesCount, setTotalPagesCount] = useState(0);

  const perPage = 10;
  const location = useLocation();
  const navigate = useNavigate();

  const getPageFromURL = useCallback(() => {
    const searchParams = new URLSearchParams(location.search);
    return parseInt(searchParams.get('page')) || 1;
  }, [location.search]);

  const fetchData = useCallback(async (page = 1) => {
    if (userData?.gender) {
      try {
        const partnerDetails = {
          ...userData?.partnerPreference,
          gender: userData.gender,
          limit: perPage,
        };
        const response = await apiurl.get(`/newlyJoined/${userId}`, {
          params: { ...partnerDetails, page },
        });

        const { users, totalUsersCount, lastPage } = response.data;
        
        setMatchData(users);
        setTotalUsersCount(totalUsersCount);
        setTotalPagesCount(lastPage);
        setCurrentPage(page);
        navigate(`?page=${page}`);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [userData, userId, navigate]);

  const handlePageChange = useCallback((pageNumber) => {
    setIsLoading(true);
    fetchData(pageNumber);
  }, [fetchData]);

  useEffect(() => {
    const page = getPageFromURL();
    fetchData(page);
  }, [getPageFromURL, userData, isToggle, fetchData]);

  const handleBlockUser = useCallback((id) => {
    setBlockedUsers((prevBlockedUsers) => [...prevBlockedUsers, id]);
    setMatchData((prevMatchData) => prevMatchData.filter((item) => item._id !== id));
  }, []);

  const handleUnblockUser = useCallback((id) => {
    setBlockedUsers((prevBlockedUsers) => prevBlockedUsers.filter((userId) => userId !== id));
    fetchData(currentPage);
  }, [fetchData, currentPage]);

  return (
    <>
      <Match />
      <div className="mb-28">
        {isLoading ? (
          Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="md:px-96 px-9 w-full mt-9">
              <Skeleton height={300} />
            </div>
          ))
        ) : matchData.length === 0 ? (
          <DataNotFound
            className="flex flex-col items-center ml-20"
            message="Data not found"
            linkText="Back to Dashboard"
            linkDestination="/user-dashboard"
          />
        ) : (
          matchData.map((item) => (
            <Card
              item={item}
              key={item._id}
              fetchData={fetchData}
              handleBlockUser={handleBlockUser}
              handleUnblockUser={handleUnblockUser}
              blockedUsers={blockedUsers}
            />
          ))
        )}
        {matchData.length > 0 && (
          <div className="flex justify-center items-center mt-3 mb-20 ml-4">
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

export default NewJoin;
