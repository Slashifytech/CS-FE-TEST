import React, { useEffect, useState, useCallback } from "react";
import Match from "./Match";
import Card from "../../components/Card";
import { useSelector } from "react-redux";
import { userDataStore } from "../../Stores/slices/AuthSlice";
import apiurl from "../../util";
import DataNotFound from "../../components/DataNotFound";
import "react-loading-skeleton/dist/skeleton.css";
import Skeleton from "react-loading-skeleton";
import Pagination from "../../Admin/comps/Pagination";
import { useLocation, useNavigate } from "react-router-dom";

const Shortlisted = () => {
  const { userId } = useSelector(userDataStore);
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
    if (userId) {
      try {
        const response = await apiurl.get(`/shortlist/get/${userId}`, {
          params: { page, limit: perPage }
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
  }, [userId, navigate]);

  const handlePageChange = useCallback((pageNumber) => {
    setIsLoading(true);
    fetchData(pageNumber);
  }, [fetchData]);

  useEffect(() => {
    const page = getPageFromURL();
    fetchData(page);
  }, [getPageFromURL, userId, isToggle, fetchData]);

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
            <div key={index} className="px-96 w-full mt-5">
              <Skeleton height={300} />
            </div>
          ))
        ) : matchData?.length === 0 ? (
          <DataNotFound
            className="flex flex-col items-center ml-20 mt-6"
            message="Data not found"
            linkText="Back to Dashboard"
            linkDestination="/user-dashboard"
          />
        ) : (
          matchData?.map((item) => (
            <Card
              key={item._id}
              item={item?.shortlistedUser}
              UserDataM={item}
              type="shortList"
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

export default Shortlisted;
