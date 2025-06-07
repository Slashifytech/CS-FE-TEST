import React, { useState, useEffect } from "react";
import "react-phone-input-2/lib/style.css";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Marquee from "react-fast-marquee";
import image from "../../DummyData/image";
import {
  setUser,
  setAuthTokenCookie,
  userDataStore,
} from "../../Stores/slices/AuthSlice";
import apiurl from "../../util";
import { jwtDecode } from "jwt-decode";
import Home from "../Home";
import { isAdminNotificationState, isNotificationsState } from "../../Stores/slices/notificationslice";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const isAuthTokenValid = () => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    console.log("noToken");
    return false;
  }

  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000; // Convert to seconds
    const expiryTime = decodedToken.exp;
    const timeDifference = expiryTime - currentTime;

    // Convert timestamps to readable date format
    const currentDate = new Date(currentTime * 1000);
    const expiryDate = new Date(expiryTime * 1000);

    // console.log("Current Date:", currentDate);
    // console.log("Expiry Date:", expiryDate);
    // console.log("Time Difference (seconds):", timeDifference);

    if (timeDifference <= 0) {
      console.log("expiredToken");
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error decoding token:", error);
    return false;
  }
};

export const VerifyOtpLessNum = ({ onOtplessUser }) => {
  useEffect(() => {
    const script = document.createElement("script");
    script.id = "otpless-sdk";
    script.type = "text/javascript";
    script.src = "https://otpless.com/v2/auth.js";
    script.setAttribute("data-appid", "USR70XG286B5M4HTKS3E");

    script.onload = () =>{
    window.otpless = (otplessUser) => {
      // console.log(otplessUser);
      onOtplessUser(otplessUser); // Call the callback function with otplessUser data
    };
};

document.body.appendChild(script);
    
    return () => {
      const scriptElement = document.getElementById("otpless-sdk");
      if (scriptElement) {
        document.body.removeChild(scriptElement);
    }
    };
  }, []);

  return (
    <>
     <span>
       
      </span>

      <div className="absolute pt-9 md:block sm:hidden hidden md:mt-20">
        <Marquee
          autoFill
          speed={100}
          loop={0}
          gradientWidth={500}
          className="w-full bg-red-0 inset-0 opacity-70 mb-[4rem] px-16 py-9"
        >
          <div className="flex justify-around items-center gap-[2rem]">
            {image.map((data) => (
              <img
                key={data.link} 
                src={data.link}
                alt="img"
                className="w-[20rem] h-[20rem] object-cover rounded-xl ml-9 zoom cursor-pointer"
              />
            ))}
          </div>
        </Marquee>
      </div>
      <div className=" md:absolute md:w-[35%] md:px-9 sm:px-9 px-5 py-6 md:mx-[33%] sm:mx-52 mx-6 mt-9 md:mt-6 my-2 rounded-xl  items-center font-DMsans">
      <div id="otpless-login-page"></div>
      </div>
    </>
  );
};


const VerifyNumber = ({ onClose, onSignupClick }) => {
  const dispatch = useDispatch();
  
  const { userData , userId} = useSelector(userDataStore);
  const [isLoading, setIsLoading] = useState(false);
  const [countryCode, setCountryCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(userData?.createdBy[0]?.phone);
  const [valid, setValid] = useState(true);
  const location = useLocation();
  const action = location.state?.action;
  const navigate = useNavigate();

  

 
  
  const handleChange = (value, country) => {
    setCountryCode(country.dialCode);
    setPhoneNumber(value);
    setValid(validatePhoneNumber(value));
  };

  const validatePhoneNumber = (phoneNumber) => {
    const phoneNumberPattern = /^\+?[1-9]\d{1,14}$/;
    return phoneNumberPattern.test(phoneNumber);
  };

  // console.log(isAuthTokenValid());

 
  
  const passPage = "passPage"

    const handleVerify = async (user) => {
        try {
        if (!isAuthTokenValid() || userData === null || userData?.createdBy[0]?.phone !== `${countryCode?.replace("+", "")}${phoneNumber?.slice(countryCode?.length)}`) {
            // console.log("entered");
            // console.log(user);
            if (user) {
            // console.log("Using user data for verification:", user);
            let num;
            if (user?.mobile && user?.mobile?.number) {
                num = user?.mobile?.number;
            } else {
                num = user?.identities[0]?.identityValue;
            }

            const response = await apiurl.post("/auth/signin", { num });
            const { existingUser, token, message, user: userData, isNotification, isAdminNotification } = response.data;
            // console.log(existingUser, token, message);
            // Dispatch actions to set user data and JWT token in Redux state
            dispatch(isNotificationsState(isNotification))
            dispatch(isAdminNotificationState(isAdminNotification))
            
            dispatch(setUser({ userData: { ...userData } }));
            dispatch(setAuthTokenCookie(token)); 
            // navigate("/l
            if (existingUser) {
                if(existingUser?.registrationPhase === "rejected"){   //decline
                navigate("/inreview")
                }else if (existingUser.isDeleted === true) {
                navigate("/reapprove");
                
                } else if (existingUser.accessType === "0" || existingUser.accessType === "1") {
                navigate(`/admin/dashboard`);
                // } else if (existingUser.registrationPhase === "rejected") {
                //   navigate(`/waiting-or-rejected`);
                } else if (existingUser.registrationPage === "6" && existingUser.registrationPhase === "notapproved") {
                navigate(`/waiting`);
                } else if (existingUser.registrationPage !== "" && existingUser.registrationPhase === "registering") {
                navigate(`/registration-form/${existingUser.registrationPage}`, {state: passPage});
                } else {
               navigate('/verifying/user/auth')
                // window.location.reload();
                
                }
            }else{
              navigate('/signup', { state: { userNum: num } });     
            }
            } 
            return false;
        } else {
          const response = await apiurl.post("/auth/signin", { num : userData?.createdBy[0]?.phone  });
          const { existingUser, token, message, user: userData, isNotification, isAdminNotification } = response.data;
          dispatch(isNotificationsState(isNotification))
          dispatch(isAdminNotificationState(isAdminNotification))
          
          dispatch(setUser({ userData: { ...userData } }));
          dispatch(setAuthTokenCookie(token));
            if (existingUser) {
            if(existingUser?.registrationPhase === "rejected"){   //decline
                    navigate("/inreview")
            }else if (existingUser?.isDeleted === true) {
                navigate("/reapprove");
            } else if (existingUser.accessType === "0" || existingUser.accessType === "1") {
                navigate(`/admin/dashboard`);
            // } else if (existingUser.registrationPhase === "rejected") {       //review 
            //   navigate(`/registration-form/1`);
            } else if (existingUser.registrationPage === "6" && existingUser.registrationPhase === "notapproved") {
                navigate(`/waiting`);
            } else if (existingUser.registrationPage !== "" && existingUser.registrationPhase === "registering") {
                navigate(`/registration-form/${existingUser.registrationPage}`, {state: passPage});
            } else {
                
             waitForRouteStringAndNavigate(); 
        
            }
            }
        }
        } catch (error) {
      if( error?.response?.data?.message === "You are banned"){
        navigate("/banned")
      }
        console.error("Login failed:", error);
        
        }
    };
  
    // console.log(userData, "verifl")

  const handleOtplessUser = (user) => {
    // console.log("Otpless user set:", user);
    handleVerify(user)
  };

  if (!isAuthTokenValid() || (userData && userData?.createdBy[0]?.phone !== `${countryCode?.replace("+", "")}${phoneNumber?.slice(countryCode?.length)}`)) {
    return <VerifyOtpLessNum onOtplessUser={handleOtplessUser}/>;
  }
 

  return (
    <>
     
      <Home />
    </>
  );
};

export default VerifyNumber;

