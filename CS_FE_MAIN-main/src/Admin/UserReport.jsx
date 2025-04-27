import React, { useEffect, useState } from "react";
import Nav from "./Nav";
import apiurl from "../util";
import { getToken } from "../Stores/service/getToken";
import DataNotFound from "../components/DataNotFound";
import Loading from "../components/Loading";
import Pagination from "./comps/Pagination";
import { Link } from "react-router-dom";

const UserReport = () => {
  const path = window.location.pathname;

  const [reportedData, setReportedData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;
  const [totalUsersCount, setTotalUsersCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [totalPagesCount, setTotalPagesCount] = useState(0);

  const fetchReportedIssues = async (page = 1) => {
    setLoading(true); // Set loading to true when fetching starts
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
      const response = await apiurl.get("/get-all-user-reports", config);
      setReportedData(response.data.reports);
      setTotalUsersCount(response.data.totalRecords);
      setTotalPagesCount(response.data.totalPages);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching reported issues:", error);
    } finally {
      setLoading(false); // Set loading to false when fetching is done
    }
  };

  const handlePageChange = (pageNumber) => {
    fetchReportedIssues(pageNumber);
  };

  useEffect(() => {
    fetchReportedIssues();
  }, []);

  return (
    <>
      <span className="fixed">
        <Nav />
      </span>
      <div className="flex justify-between md:justify-center sm:justify-center  sm:gap-9 gap-9  items-center md:mt-9 sm:mt-9 mt-20 sm:overflow-hidden md:overflow-hidden overflow-x-auto scrollbar-hide whitespace-nowrap w-full ml-9 sm:ml-24">
        <Link
          to="/admin/user-reports"
          className=" md:mx-9 ml-6  shrink-0 w-[60%] sm:w-[40%] md:w-[20%]"
        >
          <p
            className={`bg-[#FCFCFC] rounded-xl  hover:bg-primary text-center hover:text-white mb-9 font-medium  py-2 cursor-pointer  ${
              path === "/admin/user-reports" && "active"
            }`}
          >
            User Report
          </p>
        </Link>
        <Link
          to="/admin/report-lists"
          className=" shrink-0 mr-9 sm:w-[30%] w-[40%] md:w-[20%]"
        >
          <p
            className={`bg-[#FCFCFC] rounded-xl hover:bg-primary text-center hover:text-white mb-9 font-medium px-3 py-2 cursor-pointer ${
              path === "/admin/report-lists" && "active"
            }`}
          >
            Chat Report
          </p>
        </Link>
      </div>
      <p className="font-semibold text-[28px] md:ml-72 sm:ml-72 mx-6 md:mx-0 ">
        User Report List
      </p>
      <ul className="bg-[#F0F0F0] text-[15px] py-7 flex flex-row justify-around items-center md:mx-12 mx-6 md:ml-72 sm:ml-72  gap-2 rounded-lg mt-8 h-[6vh] text-black font-medium">
        <li className="md:ml-24 sm:mr-16">S.No</li>
        <li className="md:mr-48 text-center">Reports</li>
      </ul>
      {loading ? (
        <div className="mt-28 md:ml-52 sm:ml-60">
          <Loading customText={"Loading"} />
        </div>
      ) : reportedData.length === 0 ? (
        <DataNotFound
          className="flex flex-col items-center md:ml-36 mt-11 sm:ml-28 sm:mt-20"
          message="No Reported Data Available"
          linkText="Back to Dashboard"
          linkDestination="/admin/dashboard"
        />
      ) : (
        <ReportedData
          currentPage={currentPage}
          perPage={perPage}
          reportedData={reportedData}
        />
      )}
      {reportedData.length > 0 && (
        <div className="flex justify-center items-center mt-3 mb-20 md:ml-52 ml-20 sm:ml-60">
          <Pagination
            currentPage={currentPage}
            hasNextPage={currentPage * perPage < totalUsersCount}
            hasPreviousPage={currentPage > 1}
            onPageChange={handlePageChange}
            totalPagesCount={totalPagesCount}
          />
        </div>
      )}
    </>
  );
};

const ReportedData = ({ currentPage, perPage, reportedData }) => {
  return (
    <div>
      {reportedData?.map((item, index) => (
        <ul
          key={index}
          className="text-[15px] flex flex-row justify-around items-center mx-10 md:mx-0 md:mr-40 md:ml-72 sm:ml-72  rounded-lg mt-8 text-black font-medium"
        >
          <li className="md:ml-40 md:px-10  px-12 sm:px-20">
            {(currentPage - 1) * perPage + index + 1}
          </li>
          <li className="md:w-[50%] w-full sm:ml-6  md:px-20 px-3 rounded-lg my-3 py-3 shadow">
            <p>
              {item?.reportedBy?.basicDetails[0]?.name?.replace(
                "undefined",
                ""
              )}{" "}
              ({item?.reportedBy?.userId}){" "}
              <span className="font-normal">reported </span>
              {item?.reportedOne?.basicDetails[0]?.name?.replace(
                "undefined",
                ""
              )}{" "}
              ({item?.reportedOne?.userId}).
            </p>
            <span className="text-primary mt-3">Reasons For Report: </span>
            <span className="font-normal">
              {item?.reasonForReporting || "NA"}
            </span>
            <p className="text-primary mt-3">Description: </p>
            <span className="font-light text-wrap">{item?.description}</span>
          </li>
        </ul>
      ))}
    </div>
  );
};

export default UserReport;
