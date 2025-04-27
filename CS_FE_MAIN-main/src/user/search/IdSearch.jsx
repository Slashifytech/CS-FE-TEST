import React, { useState } from "react";
import Header from "../../components/Header";
import { Link, useLocation, useNavigate } from "react-router-dom";

const IdSearch = () => {
  const navigate = useNavigate();
  const path = window.location.pathname;
  const location = useLocation();
  const { idData } = location.state || {};
  const [searchId, setSearchId] = useState(idData || ""); // Corrected useState usage
  const handleSubmit = () => {
    
    navigate("/search-results", { state: { searchId: searchId, source: 'searchbyid' } });
  };

  return (
    <>
      <Header />
      <div className="flex justify-between md:justify-center sm:justify-center  sm:gap-9 gap-9  items-center md:mt-36 sm:mt-44 mt-20 sm:overflow-hidden md:overflow-hidden overflow-x-auto scrollbar-hide whitespace-nowrap w-full">
       <Link to="/searchbyid" className=" md:mx-9 ml-6  shrink-0 w-[60%] sm:w-[40%] md:w-[20%]">
         <p
           className={`bg-[#FCFCFC] rounded-xl  hover:bg-primary text-center hover:text-white mb-9 font-medium  py-2 cursor-pointer  ${
             path === "/searchbyid" && "active"
           }`}
         >
           Search By Profile Id/Name
         </p>
       </Link>
       <Link to="/basic-search" className=" shrink-0 mr-9 sm:w-[30%] w-[40%] md:w-[20%]">
         <p className="bg-[#FCFCFC] rounded-xl hover:bg-primary text-center hover:text-white mb-9 font-medium px-3 py-2 cursor-pointer">
           Basic Search
         </p>
       </Link>
     </div>
      <div className="md:w-1/2 shadow md:absolute mx-6 md:mx-0 sm:mx-36 mb-2 mt-5 left-[25%] py-5 rounded-lg">
        <span className="flex justify-center items-center "> 
          <div className="input-container w-1/2 ">
            <input
              className="input-field "
              placeholder="Search by Id/Name"
              type="text"
              name="searchId"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
            />
            <label htmlFor="input-field" className="input-label">
              Search by Id/Name
            </label>
            <span className="input-highlight" />
          </div>
        </span>

        <div
          className="flex justify-center items-center mt-12 mb-16"
          onClick={handleSubmit}
        >
          <span className="bg-primary px-12 py-2 text-[16px] text-white rounded-xl cursor-pointer">
            Search
          </span>
        </div>
      </div>
    </>
  );
};

export default IdSearch;
