import React, { useEffect, useState, useCallback } from "react";
import Nav from "../Nav";
import apiurl from "../../util";
import { getToken } from "../../Stores/service/getToken";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { isNotAdminNotifications } from "../../Stores/slices/notificationslice";

const AdminNotificationForUser = () => {
  const perPage = 40;
  const [userAdminNotification, setUserAdminNotification] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [isFetching, setIsFetching] = useState(false);
  const dispatch = useDispatch();
  dispatch(isNotAdminNotifications());

  const getAdminNotificationsForUser = useCallback(async (page = 1) => {
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
      const response = await apiurl.get(`/admin-notification-data`, config);
      setUserAdminNotification((prevNotifications) => [
        ...prevNotifications,
        ...response.data.notifications,
      ]);
      return response.data;
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }
  }, []);

  useEffect(() => {
    getAdminNotificationsForUser(page);
  }, [page, getAdminNotificationsForUser]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop !==
          document.documentElement.offsetHeight ||
        isFetching
      )
        return;
      setIsFetching(true);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isFetching]);

  useEffect(() => {
    if (!isFetching) return;
    setPage((prevPage) => prevPage + 1);
  }, [isFetching]);

  return (
    <>
      <span className="fixed">
        <Nav />
      </span>
      {isLoading? (
        <>
          <div className="mr-44 ml-80 mt-36 ">
            <Skeleton height={50} />
          </div>
          <div className="mx-3 mt-9 mr-44 ml-80">
            <Skeleton height={50} />
          </div>
          <div className="mx-3 mt-9 mr-44 ml-80">
            <Skeleton height={50} />
          </div>
          <div className="mx-3 mt-9 mr-44 ml-80">
            <Skeleton height={50} />
          </div>
          <div className="mx-3 mt-9 mr-44 ml-80">
            <Skeleton height={50} />
          </div>
        </>
      ) : (
        <AdminNotificationsData userAdminNotification={userAdminNotification} />
      )}
     
    </>
  );
};

const AdminNotificationsData = ({ userAdminNotification }) => {
  const path = window.location.pathname;

  
  const notifications = Array.isArray(userAdminNotification)
    ? userAdminNotification
    : [];
    

    function formatDate(isoString) {
      const date = new Date(isoString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    }
    
  return (
    <>
      <div className="flex justify-center items-center md:mt-9 sm:mt-9 mt-20 md:gap-16 sm:gap-14 gap-6 sm:ml-52">
        <Link to={`/admin/notifications`}>
          <p
            className={`bg-[#FCFCFC] rounded-xl  font-medium px-6 py-2 cursor-pointer ${
              path === `/admin/notifications` && "activeheader"
            }`}
          >
            Admin Notifications
          </p>
        </Link>
        <Link to={`/admin/usersnotification`}>
          <p
            className={`bg-[#FCFCFC] rounded-xl light-shadow font-medium px-6 py-2 cursor-pointer `}
          >
            Users Notifications
          </p>
        </Link>
      </div>
      <div className="shadow md:px-9 mt-9 my-6 md:ml-72 mx-6 pb-6 rounded-md md:mr-36 px-6 sm:ml-72">
        <h2 className="text-primary font-semibold font-montserrat py-2 pt-6 text-[22px]">
          Notifications
        </h2>
        <hr className="border border-[#e9e9e9]" />
        {notifications?.map((item, index) => (
          <div className="flex flex-col" key={index}>
            <ul className="flex items-center gap-2 py-3 pt-6 ">
              <li>
                <Link
                  to="/admin/approval-lists"
                  className="text-black font-DMsans text-[15px]"
                >
                  {`${item?.notificationBy?.basicDetails?.[0]?.name?.replace(
                    "undefined",
                    ""
                  )}(${item?.notificationBy?.userId}) 
                 Requested for ${
                   item.notificationType === "reapproval"
                     ? "Reapproval of Profile"
                     : "Profile Approval"
                 } on ${formatDate(item?.createdAt)} . `}
                </Link>
              </li>
            </ul>
          </div>
        ))}
      </div>
    </>
  );
};

export default AdminNotificationForUser;
