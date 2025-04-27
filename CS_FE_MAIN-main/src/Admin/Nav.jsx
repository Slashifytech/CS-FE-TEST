import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LogoutPop from "../user/PopUps/LogoutPop";
import { close, menu } from "../assets";
import { GoBell } from "react-icons/go";
import { useSelector } from "react-redux";
import { notificationStore } from "../Stores/slices/notificationslice";


const Nav = () => {
  const location = useLocation();
  const path = location.pathname;
  const [isLogoutOpen, setisLogoutOpen] = useState(false);
  const [toggle, SetToggle] = useState(false);
  const { isThere, isAdminThere } = useSelector(notificationStore);
  const navigate = useNavigate();
  const [localNotificationState, setLocalNotificationState] = useState(() => {
    const savedState = localStorage.getItem("notificationState");

    return savedState === null ? isThere : JSON.parse(savedState);
  });
  const [localAdminNotificationState, setLocalAdminNotificationState] =
    useState(() => {
      const savedAdState = localStorage.getItem("notificationAState");

      return savedAdState === null ? isAdminThere : JSON.parse(savedAdState);
    });

  useEffect(() => {
    localStorage.setItem(
      "notificationState",
      JSON.stringify(localNotificationState)
    );
  }, [localNotificationState]);
  useEffect(() => {
    localStorage.setItem(
      "notificationAState",
      JSON.stringify(localAdminNotificationState)
    );
  }, [localAdminNotificationState]);
  useEffect(() => {
    if (isThere) {
      !setLocalNotificationState(true);
    }
  }, [isThere]);
  useEffect(() => {
    if (isAdminThere) {
      !setLocalAdminNotificationState(true);
    }
  }, [isAdminThere]);

  const openLogoutPopup = () => {
    setisLogoutOpen(true);
  };

  const closeLogout = () => {
    setisLogoutOpen(false);
  };
  const handleNotificationClick = () => {
    setTimeout(() => {
      navigate(
        localNotificationState === true
          ? "/admin/usersnotification"
          : localAdminNotificationState === true
          ? "/admin/notifications"
          : localAdminNotificationState && localNotificationState === true
          ? "/admin/notifications"
          : "/admin/notifications"
      );
    }, 100);
    setLocalNotificationState(false);
    setLocalAdminNotificationState(false);
  };


 
  
  return (
    <>
      <LogoutPop isLogoutOpen={isLogoutOpen} closeLogout={closeLogout} />
      <div className="bg-primary  px-9 py-9 text-start w-60 h-screen rounded-r-3xl hidden md:block sm:block  ">
        <div className="flex  items-center relative gap-3">
          <p className="text-white font-montserrat font-medium text-[30px] px-2">
            Menu
          </p>
          {localNotificationState || localAdminNotificationState ? (
            <span className="cursor-pointer" onClick={handleNotificationClick}>
              <span className="bg-white  rounded-full text-primary text-[9px] font-light px-1 absolute right-[14px]  top-2">
                New
              </span>
              <GoBell className="text-[30px] text-white" />
            </span>
          ) : (
            <Link
              to="/admin/notifications"
              className={`${
                (path === "/admin/notifications" ||
                  path === "/admin/usersnotification") &&
                "border border-white rounded-md p-1"
              }`}
            >
              <GoBell className="text-[28px] text-white" />
            </Link>
          )}
        </div>

        <span>
          <Link to="/">
            {" "}
            <p
              className={` cursor-pointer text-white hover:bg-white hover:text-primary  py-2 px-3 mt-6 rounded-xl text-[17px]  ${
                path === "/" && "adminnav"
              }`}
            >
              Home
            </p>
          </Link>
          <Link to="/admin/dashboard">
            {" "}
            <p
              className={` cursor-pointer text-white hover:bg-white hover:text-primary  py-2 px-3  mt-6 rounded-xl text-[17px] "  ${
                (path === "/admin/dashboard" ||
                  path === "/admin/active-users" ||
                  path === "/admin/male-users" ||
                  path === "/admin/female-users" ||
                  path === "/admin/successfull-married" ||
                  path === "/admin/deleted-users" ||
                  path === "/admin/CategoryA-users" ||
                  path === "/admin/categoryB-users" ||
                  path === "/admin/categoryC-users" ||
                  path === "/admin/banned-users" ||
                     path === "/admin/rejected-users" ||
                  path === "/admin/uncategorised-users") &&
                "adminnav"
              }`}
            >
              Dashboard
            </p>
          </Link>
          <Link to="/admin/user">
            {" "}
            <p
              className={` cursor-pointer text-white hover:bg-white hover:text-primary  py-2 px-3 mt-6 rounded-xl text-[17px]  ${
                path === "/admin/user" && "adminnav"
              }`}
            >
              All Users
            </p>
          </Link>
          <Link to="/admin/currency-value">
            {" "}
            <p
              className={` cursor-pointer text-white hover:bg-white hover:text-primary  py-2 px-3  mt-6 rounded-xl text-[17px] ${
                path === "/admin/currency-value" && "adminnav"
              }`}
            >
              Currency Value
            </p>
          </Link>
          <Link to="/admin/approval-lists">
            {" "}
            <p
              className={` cursor-pointer text-white hover:bg-white hover:text-primary  py-2 px-3  mt-6 rounded-xl text-[17px] ${
                path === "/admin/approval-lists" && "adminnav"
              }`}
            >
              Approval Page
            </p>
          </Link>

          <Link to="/admin/user-reports">
            {" "}
            <p
              className={` cursor-pointer text-white hover:bg-white hover:text-primary  py-2 px-3  mt-6 rounded-xl text-[17px] ${
                (path === "/admin/user-reports" || path === "/admin/report-lists") && "adminnav"
              }`}
            >
              Manage Reports
            </p>
          </Link>
          <Link to="/admin/notification-subscribe">
            {" "}
            <p
              className={` cursor-pointer text-white hover:bg-white hover:text-primary  py-2 px-3  mt-6 rounded-xl text-[17px] ${
                path === "/admin/notification-subscribe" && "adminnav"
              }`}
            >
              Notifications
            </p>
          </Link>
          <Link to="">
            {" "}
            <p
              onClick={openLogoutPopup}
              className=" cursor-pointer text-white hover:bg-white hover:text-primary  py-2 px-3  mt-6 rounded-xl text-[17px]"
            >
              Logout
            </p>
          </Link>
        </span>
      </div>
      {/* // responsive nav */}
      <div className="bg-white w-screen mt-0 py-1 pb-4 md:hidden sm:hidden">
      <span className="md:hidden sm:hidden mt-6 flex justify-end ml-4 w-9">
    
        <img
          src={toggle ? close : menu}
          alt="menu"
          className="w-[25px] h-[25px] object-contain "
          onClick={() => SetToggle(!toggle)}
        />
       
        <div
          className={`${!toggle ? "hidden" : "flex"}
      p-6 absolute top-20 left-0  min-w-[200px] rounded-xl  admin_sidebar z-50  bg-[#FCFCFC] text-black`}
        >
          <ul className="list-none flex justify-end items-start font-DMsans  flex-1 flex-col">
            <span>
            <div className="flex  items-center relative gap-3">
          <p className="text-black font-montserrat font-medium text-[25px] px-2">
            Menu
          </p>
          {localNotificationState || localAdminNotificationState ? (
            <span className="cursor-pointer" onClick={handleNotificationClick}>
              <span className="bg-primary  rounded-full text-white text-[9px] font-light px-1 absolute right-[14px]  top-2">
                New
              </span>
              <GoBell className="text-[30px] text-black" />
            </span>
          ) : (
            <Link
              to="/admin/notifications"
              className={`${
                (path === "/admin/notifications" ||
                  path === "/admin/usersnotification") &&
                "border border-primary rounded-md p-1"
              }`}
            >
              <GoBell className="text-[28px] text-black" />
            </Link>
          )}
        </div>
            <Link to="/">
                {" "}
                <p
                  className={` cursor-pointer text-black hover:bg-primary hover:text-white  py-2 px-3  mt-6 rounded-xl text-[17px] "  ${
                    path === "/" && "adminresnav"
                  }`}
                >
                  Home
                </p>
              </Link>
              <Link to="/admin/dashboard">
                {" "}
                <p
                  className={` cursor-pointer text-black hover:bg-primary hover:text-white  py-2 px-3  mt-6 rounded-xl text-[17px] "  ${
                    (path === "/admin/dashboard" ||
                  path === "/admin/active-users" ||
                  path === "/admin/male-users" ||
                  path === "/admin/female-users" ||
                  path === "/admin/successfull-married" ||
                  path === "/admin/deleted-users" ||
                  path === "/admin/CategoryA-users" ||
                  path === "/admin/categoryB-users" ||
                  path === "/admin/categoryC-users" ||
                  path === "/admin/banned-users" ||
                    path === "/admin/rejected-users" ||
                  path === "/admin/uncategorised-users") && "adminresnav"
                  }`}
                >
                  Dashboard
                </p>
              </Link>
              <Link to="/admin/user">
                {" "}
                <p
                  className={` cursor-pointer text-black hover:bg-primary hover:text-white  py-2 px-3 mt-6 rounded-xl text-[17px]  ${
                    path === "/admin/user" && "adminresnav"
                  }`}
                >
                  All Users
                </p>
              </Link>
              <Link to="/admin/currency-value">
                {" "}
                <p
                  className={` cursor-pointer text-black hover:bg-primary hover:text-white  py-2 px-3  mt-6 rounded-xl text-[17px] ${
                    path === "/admin/currency-value" && "adminresnav"
                  }`}
                >
                  Currency Value
                </p>
              </Link>
              <Link to="/admin/approval-lists">
                {" "}
                <p
                  className={` cursor-pointer text-black hover:bg-primary hover:text-white  py-2 px-3  mt-6 rounded-xl text-[17px] ${
                    path === "/admin/approval-lists" && "adminresnav"
                  }`}
                >
                  Approval Page
                </p>
              </Link>
            
              <Link to="/admin/report-lists">
                {" "}
                <p
                  className={` cursor-pointer text-black hover:bg-white hover:text-white  py-2 px-3  mt-6 rounded-xl text-[17px] ${
                    path === "/admin/report-lists" && "adminresnav"
                  }`}
                >
                  Manage Reports
                </p>
              </Link>
              <Link to="/admin/notification-subscribe">
                {" "}
                <p
                  className={` cursor-pointer text-black hover:bg-white hover:text-white  py-2 px-3  mt-6 rounded-xl text-[17px] ${
                    path === "/admin/notification-subscribe" && "adminresnav"
                  }`}
                >
                  Notifications
                </p>
              </Link>
              <Link to="">
                {" "}
                <p
                  onClick={openLogoutPopup}
                  className=" cursor-pointer  hover:bg-primary hover:text-white  py-2 px-3  mt-6 rounded-xl text-[17px]"
                >
                  Logout
                </p>
              </Link>
            </span>
          </ul>
        </div>
      </span>
      </div>
    </>
  );
};

export default Nav;
