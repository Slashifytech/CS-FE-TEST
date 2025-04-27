import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import SideBar from "../Dashboard/SideBar";
import { BackArrow } from "../../components/DataNotFound";
import { useDispatch, useSelector } from "react-redux";
import apiurl from "../../util";
import { userDataStore } from "../../Stores/slices/AuthSlice";
import { getUser } from "../../Stores/service/Genricfunc";
import { toast } from "react-toastify";

const SubsEmail = () => {
  const [emailSettings, setEmailSettings] = useState({
    emailOpt: "",
  });

  const { userId } = useSelector(userDataStore);

  const getdata = async () => {
    const userData = await getUser(userId);
    const subsData = userData.user?.isEmailSubscribed === true ? "Enable" : "Disable";
    setEmailSettings({
      emailOpt: subsData,
    });
  };

  useEffect(() => {
    if (userId) {
      getdata();
    }
  }, [userId]);

  const handleInput = async (e) => {
    const { value, name } = e.target;
    setEmailSettings((prevSettings) => ({
      ...prevSettings,
      [name]: value,
    }));
    await subscribeEmail(value);
  };

  const subscribeEmail = async (newValue) => {
    if (userId) {
      try {
        const value = newValue === "Enable" ? true : false;
        await apiurl.put(`/change-email-subscription`, {
          userId,
          isValue: value,
        });
        toast.info("Email settings updated")
      } catch (err) {
        console.error("Error subscribing to email:", err);
        // Handle error
      }
    }
  };

  const emailOption = ["Enable", "Disable"];

  return (
    <>
      <Header />
      <div className="md:block hidden sm:block">
      <SideBar />
      </div>
      <BackArrow className="sm:hidden md:hidden block" />
      <div className="shadow md:px-9 py-3 px-6 mb-36 md:mb-5 md:mx-28 my-5 rounded-md md:ml-96 sm:ml-72 sm:mt-36 sm:mb-9 md:mt-40 mt-7 mx-6">
        <span>
          <p className="font-semibold font-montserrat mt-5 text-[22px]">Email Settings</p>
          <p className="pt-3">Subscribe Email Services <span className="text-primary">(You will get recently joined profile notification every month).</span></p>
          <span className="flex flex-col mt-2">
            {emailOption.map((option, index) => (
              <span key={index}>
                <input
                  type="radio"
                  className="bg-[#F0F0F0] rounded-md mt-2 mx-1"
                  onChange={handleInput}
                  id={`emailOpt${index}`}
                  name="emailOpt"
                  value={option}
                  checked={emailSettings.emailOpt === option}
                />
                <label htmlFor={`emailOpt${index}`}>{option}</label>
              </span>
            ))}
          </span>
        </span>
      </div>
    </>
  );
};

export default SubsEmail;
