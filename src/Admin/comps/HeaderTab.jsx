import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const HeaderTab = () => {
  const location = useLocation();
  const path = location.pathname;
  const [activeTab, setActiveTab] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    setActiveTab(path); // Set the active tab based on the current path
    
    // Scroll to center the active tab
    if (containerRef.current) {
      const activeElement = containerRef.current.querySelector('.active');
      if (activeElement) {
        const scrollLeft = activeElement.offsetLeft - (containerRef.current.offsetWidth / 2) + (activeElement.offsetWidth / 2);
        containerRef.current.scrollLeft = scrollLeft;
      }
    }
  }, [path]);

  return (
    <>
      <div ref={containerRef} className="flex md:justify-start sm:justify-start justify-start items-center gap-9 md:mt-9 sm:mt-9 mt-20 md:gap-16 overflow-x-scroll md:mx-6 sm:mx-9 scrollbar-hide sm:gap-10">
        <Link to="/admin/active-users">
          <p className={`bg-[#FCFCFC] rounded-xl hover:bg-primary hover:text-white mb-9 font-medium md:px-6 sm:px-6 w-44 px-6 text-center py-2 cursor-pointer ${path === "/admin/active-users" && "active"}`}>
            Active Users
          </p>
        </Link>
        <Link to="/admin/male-users">
          <p className={`bg-[#FCFCFC] rounded-xl hover:bg-primary hover:text-white mb-9 font-medium md:px-6 sm:px-6 w-44 px-6 text-center py-2 cursor-pointer ${path === "/admin/male-users" && "active"}`}>
            Male Users
          </p>
        </Link>
        <Link to="/admin/female-users">
          <p className={`bg-[#FCFCFC] rounded-xl hover:bg-primary hover:text-white mb-9 py-2 font-medium md:px-6 sm:px-6 sm:w-48 w-52 px-6 text-center cursor-pointer ${path === "/admin/female-users" && "active"}`}>
            Female Users
          </p>
        </Link>
        <Link to="/admin/successfull-married">
          <p className={`bg-[#FCFCFC] rounded-xl hover:bg-primary hover:text-white mb-9 py-2 font-medium md:px-6 sm:px-6 w-52 px-6 text-center cursor-pointer ${path === "/admin/successfull-married" && "active"}`}>
            Successful Married
          </p>
        </Link>
        <Link to="/admin/deleted-users">
          <p className={`bg-[#FCFCFC] rounded-xl hover:bg-primary hover:text-white mb-9 py-2 font-medium md:px-6 sm:px-6 sm:w-48 w-52 px-6 text-center cursor-pointer ${path === "/admin/deleted-users" && "active"}`}>
            Deleted Users
          </p>
        </Link>
        <Link to="/admin/CategoryA-users">
          <p className={`bg-[#FCFCFC] rounded-xl hover:bg-primary hover:text-white mb-9 py-2 font-medium md:px-6 sm:px-6 sm:w-48 w-52 px-6 text-center cursor-pointer ${path === "/admin/CategoryA-users" && "active"}`}>
            Category A Users
          </p>
        </Link>
        <Link to="/admin/categoryB-users">
          <p className={`bg-[#FCFCFC] rounded-xl hover:bg-primary hover:text-white mb-9 py-2 font-medium md:px-6 sm:px-6 sm:w-48 w-52 px-6 text-center cursor-pointer ${path === "/admin/categoryB-users" && "active"}`}>
            Category B Users
          </p>
        </Link>
        <Link to="/admin/categoryC-users">
          <p className={`bg-[#FCFCFC] rounded-xl hover:bg-primary hover:text-white mb-9 py-2 font-medium md:px-6 sm:px-6 sm:w-48 w-52 px-6 text-center cursor-pointer ${path === "/admin/categoryC-users" && "active"}`}>
            Category C Users
          </p>
        </Link>
        <Link to="/admin/uncategorised-users">
          <p className={`bg-[#FCFCFC] rounded-xl hover:bg-primary hover:text-white mb-9 py-2 font-medium md:px-6 sm:px-6 sm:w-48 w-52 md:w-52 px-6 text-center cursor-pointer ${path === "/admin/uncategorised-users" && "active"}`}>
            Un-Categorised Users
          </p>
        </Link>
        <Link to="/admin/banned-users">
          <p className={`bg-[#FCFCFC] rounded-xl hover:bg-primary hover:text-white mb-9 font-medium md:px-6 sm:px-6 w-44 px-6 text-center py-2 cursor-pointer ${path === "/admin/banned-users" && "active"}`}>
            Banned Users
          </p>
        </Link>
        <Link to="/admin/rejected-users">
          <p className={`bg-[#FCFCFC] rounded-xl hover:bg-primary hover:text-white mb-9 font-medium md:px-6 sm:px-6 w-44 px-6 text-center py-2 cursor-pointer ${path === "/admin/rejected-users" && "active"}`}>
            Declined Users
          </p>
        </Link>
      </div>
    </>
  );
};

export default HeaderTab;
