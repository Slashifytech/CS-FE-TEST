import React, { useEffect, useState, useMemo } from "react";
import Nav from "./Nav";
import { getToken } from "../Stores/service/getToken";
import apiurl from "../util";
import { Link } from "react-router-dom";
import OneSignal from "react-onesignal";
import axios from "axios";
import { userDataStore } from "../Stores/slices/AuthSlice";
import { useSelector } from "react-redux";
import useOneSignal from "./comps/OnesignalInitialize";
const Dashboard = () => {
  const { userData, userId } = useSelector(userDataStore);

  const [statistics, setStatistics] = useState({
    totalUsers: 0,
    totalMaleUsers: 0,
    totalFemaleUsers: 0,
    totalDeletedUsers: 0,
    totalUsersCategoryA: 0,
    totalUsersCategoryB: 0,
    totalUsersCategoryC: 0,
    totalUsersUnCategorised: 0,
    totalActiveUsers: 0,
    totalSuccessfulMarriages: 0,
    totalBannedUsers: 0,
    totalRejectedUsers: 0,
  });
  useOneSignal(userId);
  const getAllUsersStatistics = useMemo(
    () => async () => {
      try {
        const token = getToken();
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json; charset=UTF-8",
          },
        };
        const response = await apiurl.get("get-user-statistics", config);
        setStatistics(response.data);
      } catch (err) {
        console.log(err);
      }
    },
    []
  );

  useEffect(() => {
    getAllUsersStatistics();
  }, [getAllUsersStatistics]);

  const adminCards = useMemo(
    () => [
      { title: "Total Users", count: statistics.totalUsers, link: "" },
      {
        title: "Total Male Users",
        count: statistics.totalMaleUsers,
        link: "/admin/male-users",
      },
      {
        title: "Total Female Users",
        count: statistics.totalFemaleUsers,
        link: "/admin/female-users",
      },
      {
        title: "Total Deleted Users",
        count: statistics.totalDeletedUsers,
        link: "/admin/deleted-users",
      },
      {
        title: "Total Users Category A",
        count: statistics.totalUsersCategoryA,
        link: "/admin/CategoryA-users",
      },
      {
        title: "Total Users Category B",
        count: statistics.totalUsersCategoryB,
        link: "/admin/categoryB-users",
      },
      {
        title: "Total Users Category C",
        count: statistics.totalUsersCategoryC,
        link: "/admin/categoryC-users",
      },
      {
        title: "Total Uncategorised Users",
        count: statistics.totalUsersUnCategorised,
        link: "/admin/uncategorised-users",
      },
      {
        title: "Total Active Users",
        count: statistics.totalActiveUsers,
        link: "/admin/active-users",
      },
      {
        title: "Total Successful Marriages",
        count: statistics.totalSuccessfulMarriages,
        link: "/admin/successfull-married",
      },
      {
        title: "Total Banned Users",
        count: statistics.totalBannedUsers,
        link: "/admin/banned-users",
      },
      {
        title: "Total Declined Users",
        count: statistics.totalRejectedUsers,
        link: "/admin/rejected-users",
      },
    ],
    [statistics]
  );


  

  return (
    <>
      <span className="flex">
        <span className="fixed">
          <Nav />
        </span>
        <span className="grid md:grid-cols-3 grid-cols-1 md:mx-16 mx-6 md:ml-80 sm:ml-80 px-9 w-full gap-8 mt-16 overflow-scroll scrollbar-hide mb-20">
          {adminCards.map((card, index) =>
            card.link ? (
              <Link key={index} to={card.link}>
                <AdminCard title={card.title} count={card.count} />
              </Link>
            ) : (
              <AdminCard key={index} title={card.title} count={card.count} />
            )
          )}
        </span>
      </span>
    </>
  );
};

const AdminCard = ({ title, count }) => {
  return (
    <div className="shadow rounded-3xl my-2 px-6 pt-5 pb-16 font-montserrat w-full">
      <p className="font-medium">{title}</p>
      <p className="font-semibold text-[32px]">{count}</p>
    </div>
  );
};

export default Dashboard;
