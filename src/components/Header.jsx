import React, { useEffect, useState, useCallback, useMemo } from "react";
import { logo, menu } from "../assets/index";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MdOutlineHome } from "react-icons/md";
import { IoSearchSharp } from "react-icons/io5";
import { GiLovers } from "react-icons/gi";
import { HiOutlineInboxArrowDown } from "react-icons/hi2";
import { BsChatLeftText, BsFillGrid1X2Fill } from "react-icons/bs";
import { GoBell } from "react-icons/go";
import { HiMenu } from "react-icons/hi";
import { notificationStore } from "../Stores/slices/notificationslice";
import { useSelector } from "react-redux";

import MobileSidebar from "../user/Dashboard/MobileSidebar";

const Header = () => {
  const location = useLocation();
        const routeString = localStorage.getItem('enString')
  
  const path = location.pathname;
  const [isPopupOpen, setPopupOpen] = useState(false);
  const { isThere } = useSelector(notificationStore);
  const navigate = useNavigate();
  const [localNotificationState, setLocalNotificationState] = useState(() => {
    const savedState = localStorage.getItem("notificationState");
    return savedState === null ? isThere : JSON.parse(savedState);
  });

  useEffect(() => {
    localStorage.setItem(
      "notificationState",
      JSON.stringify(localNotificationState)
    );
  }, [localNotificationState]);

  useEffect(() => {
    if (isThere) {
      setLocalNotificationState(true);
    }
  }, [isThere]);

  const openPopup = useCallback(() => {
    setPopupOpen(true);
  }, []);

  const closePopup = useCallback(() => {
    setPopupOpen(false);
  }, []);

  const handleNotificationClick = useCallback(
    (event) => {
      event.preventDefault();
      setLocalNotificationState(false);
      setTimeout(() => {
        navigate("/user-notification");
      }, 100);
    },
    [navigate]
  );

  const navItems = useMemo(
    () => [
      {
        to: `/user-dashboard/${routeString}`,
        icon: <BsFillGrid1X2Fill size={22} />,
        label: "Dashboard",
        isActive:
          path === `/user-dashboard/${routeString}` ||
          path === "/partner-edit" ||
          path === "/profile" ||
          path === "/image-edit" ||
          path === "/settings/contact-info" ||
          path === "/settings/delete-profile" ||
          path === "/settings/phonenumber" ||
          path === "/settings/email",
      },
      {
        to: "/searchbyid",
        icon: <IoSearchSharp size={23} />,
        label: "Search",
        isActive: path === "/basic-search" || path.includes("/searchbyid"),
      },
      {
        to: "/all-matches",
        icon: <GiLovers size={23} />,
        label: "Matches",
        isActive:
          path === "/all-matches" ||
          path.includes("/new-join") ||
          path.includes("/shortlisted") ||
          path.includes("/search-result"),
      },
      {
        to: "/inbox/profiles/recieved",
        icon: <HiOutlineInboxArrowDown size={23} />,
        label: "Inbox",
        isActive:
          path === "/inbox/profiles/recieved" ||
          path.includes("/inbox/profiles/sent") ||
          path.includes("/inbox/profiles/accepted") ||
          path.includes("/inbox/profiles/declined") ||
          path.includes("/inbox/interests/recieved") ||
          path.includes("/inbox/interests/sent") ||
          path.includes("/inbox/interests/accepted") ||
          path.includes("/inbox/interests/declined"),
      },
      {
        to: "/chat",
        icon: <BsChatLeftText size={20} />,
        label: "Chat",
        isActive: path === "/chat",
      },
    ],
    [path]
  );
  const responsiveNavItems = useMemo(
    () =>
      navItems.map((item) =>
        item.to === "/chat"
          ? { ...item, to: "/chat-list-interest-accepted" }
          : item
      ),
    [navItems]
  );
  return (
    <>
      <nav className="md:px-6 px-6 bg-[#FCFCFC] navshadow hidden md:block sm:block fixed  w-full  z-30 ">
        <div className="flex items-center ">
          <Link to={`/user-dashboard/${routeString}`}>
            <img src={logo} alt="logo" loading="lazy" className="md:w-28 sm:w-28 w-[9vh] pt-2" />
          </Link>
          <span className="md:block sm:block hidden">
            <ul className="flex items-center text-[16px] font-semibold absolute md:right-12 sm:right-5 md:gap-3 top-8">
              {navItems.map(({ to, icon, label, isActive }) => (
                <Link key={to} to={to}>
                  <li
                    className={`cursor-pointer flex items-center hover:bg-secondary hover:text-white rounded-lg px-2 py-1 ${
                      isActive ? "activeheader" : ""
                    }`}
                  >
                    <span className="pe-2 ">{icon}</span>
                    {label}
                  </li>
                </Link>
              ))}
              <li
                onClick={handleNotificationClick}
                className={`cursor-pointer flex items-center rounded-lg px-2 py-1 relative ${
                  path === "/user-notification" && "border border-primary"
                }`}
              >
                {localNotificationState ? (
                  <>
                    <span className="bg-primary rounded-full text-white text-[9px] font-light px-1 absolute right-[1px] top-1">
                      New
                    </span>
                    <GoBell className="text-[30px]" />
                  </>
                ) : (
                  <GoBell className="text-[28px]" />
                )}
              </li>
            </ul>
          </span>
        </div>
      </nav>

      {/* responsive navigation header-bottom */}
      <div className="px-5 w-screen bottom-5 fixed z-30">
        <div className="sm:hidden md:hidden xl:hidden ss:hidden bg-primary rounded-3xl py-5">
          <ul className="flex items-center justify-evenly ">
          {responsiveNavItems.map(({ to, icon, label, isActive }) => (
              <Link key={to} to={to}>
                <li
                  className={`flex items-center text-white cursor-pointer  ${
                    isActive ? "activeheader-mobile" : ""
                  }`}
                >
                  {icon}
                  {isActive && <span className="px-2">{label}</span>}
                </li>
              </Link>
            ))}
          </ul>
        </div>
      </div>

      {/* //responsive header-top */}
      <span className="md:hidden sm:hidden flex justify-between items-center mx-6 mt-1">
        <Link to="/user-dashboard ">
          <img src={logo} alt="logo" loading="lazy" className="md:w-[17vh] w-[13vh] pt-2" />
        </Link>
        <span className="flex items-center gap-6 relative">
          <span className="rounded-full w-[10px] h-[10px] absolute right-[63px] top-1"></span>
          <li
            onClick={handleNotificationClick}
            className={`cursor-pointer flex items-center rounded-lg px-2 py-1 relative ${
              path === "/user-notification" && "border border-primary"
            }`}
          >
            {localNotificationState ? (
              <>
                <span className="bg-primary rounded-full text-white text-[9px] font-light px-1 absolute right-[1px] top-1">
                  New
                </span>
                <GoBell className="text-[30px]" />
              </>
            ) : (
              <GoBell className="text-[28px]" />
            )}
          </li>
          <HiMenu onClick={openPopup} className="text-[35px]" alt="menu" />
        </span>
      </span>

      <span className="mt-8">
        <MobileSidebar isPopupOpen={isPopupOpen} closePopup={closePopup} />
      </span>
    </>
  );
};

export default Header;
