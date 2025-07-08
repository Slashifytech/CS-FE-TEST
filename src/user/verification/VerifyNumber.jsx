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
import { RxCross2 } from "react-icons/rx";
import {
  VerifyEmailLogin,
  VerifyEmailSignup,
  VerifyOtp,
} from "../../Stores/service/AuthAPi";
import { toast } from "react-toastify";
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

// export const VerifyOtpLessNum = ({ onOtplessUser }) => {
//   useEffect(() => {
//     const script = document.createElement("script");
//     script.id = "otpless-sdk";
//     script.type = "text/javascript";
//     script.src = "https://otpless.com/v2/auth.js";
//     script.setAttribute("data-appid", "USR70XG286B5M4HTKS3E");

//     script.onload = () =>{
//     window.otpless = (otplessUser) => {
//       // console.log(otplessUser);
//       onOtplessUser(otplessUser); // Call the callback function with otplessUser data
//     };
// };

// document.body.appendChild(script);

//     return () => {
//       const scriptElement = document.getElementById("otpless-sdk");
//       if (scriptElement) {
//         document.body.removeChild(scriptElement);
//     }
//     };
//   }, []);

//   return (
//     <>
//      <span>

//       </span>

//       <div className="absolute pt-9 md:block sm:hidden hidden md:mt-20">
//         <Marquee
//           autoFill
//           speed={100}
//           loop={0}
//           gradientWidth={500}
//           className="w-full bg-red-0 inset-0 opacity-70 mb-[4rem] px-16 py-9"
//         >
//           <div className="flex justify-around items-center gap-[2rem]">
//             {image.map((data) => (
//               <img
//                 key={data.link}
//                 src={data.link}
//                 alt="img"
//                 className="w-[20rem] h-[20rem] object-cover rounded-xl ml-9 zoom cursor-pointer"
//               />
//             ))}
//           </div>
//         </Marquee>
//       </div>
//       <div className=" md:absolute md:w-[35%] md:px-9 sm:px-9 px-5 py-6 md:mx-[33%] sm:mx-52 mx-6 mt-9 md:mt-6 my-2 rounded-xl  items-center font-DMsans">
//       <div id="otpless-login-page"></div>
//       </div>
//     </>
//   );
// };

// const VerifyNumber = ({ onClose, onSignupClick }) => {
//   const dispatch = useDispatch();

//   const { userData , userId} = useSelector(userDataStore);
//   const [isLoading, setIsLoading] = useState(false);
//   const [countryCode, setCountryCode] = useState("");
//   const [phoneNumber, setPhoneNumber] = useState(userData?.createdBy[0]?.phone);
//   const [valid, setValid] = useState(true);
//   const location = useLocation();
//   const action = location.state?.action;
//   const navigate = useNavigate();

//   const handleChange = (value, country) => {
//     setCountryCode(country.dialCode);
//     setPhoneNumber(value);
//     setValid(validatePhoneNumber(value));
//   };

//   const validatePhoneNumber = (phoneNumber) => {
//     const phoneNumberPattern = /^\+?[1-9]\d{1,14}$/;
//     return phoneNumberPattern.test(phoneNumber);
//   };

//   // console.log(isAuthTokenValid());

//   const passPage = "passPage"

//     const handleVerify = async (user) => {
//         try {
//         if (!isAuthTokenValid() || userData === null || userData?.createdBy[0]?.phone !== `${countryCode?.replace("+", "")}${phoneNumber?.slice(countryCode?.length)}`) {
//             // console.log("entered");
//             // console.log(user);
//             if (user) {
//             // console.log("Using user data for verification:", user);
//             let num;
//             if (user?.mobile && user?.mobile?.number) {
//                 num = user?.mobile?.number;
//             } else {
//                 num = user?.identities[0]?.identityValue;
//             }

//             const response = await apiurl.post("/auth/signin", { num });
//             const { existingUser, token, message, user: userData, isNotification, isAdminNotification } = response.data;
//             // console.log(existingUser, token, message);
//             // Dispatch actions to set user data and JWT token in Redux state
//             dispatch(isNotificationsState(isNotification))
//             dispatch(isAdminNotificationState(isAdminNotification))

//             dispatch(setUser({ userData: { ...userData } }));
//             dispatch(setAuthTokenCookie(token));
//             // navigate("/l
//             if (existingUser) {
//                 if(existingUser?.registrationPhase === "rejected"){   //decline
//                 navigate("/inreview")
//                 }else if (existingUser.isDeleted === true) {
//                 navigate("/reapprove");

//                 } else if (existingUser.accessType === "0" || existingUser.accessType === "1") {
//                 navigate(`/admin/dashboard`);
//                 // } else if (existingUser.registrationPhase === "rejected") {
//                 //   navigate(`/waiting-or-rejected`);
//                 } else if (existingUser.registrationPage === "6" && existingUser.registrationPhase === "notapproved") {
//                 navigate(`/waiting`);
//                 } else if (existingUser.registrationPage !== "" && existingUser.registrationPhase === "registering") {
//                 navigate(`/registration-form/${existingUser.registrationPage}`, {state: passPage});
//                 } else {
//                navigate('/verifying/user/auth')
//                 // window.location.reload();

//                 }
//             }else{
//               navigate('/signup', { state: { userNum: num } });
//             }
//             }
//             return false;
//         } else {
//           const response = await apiurl.post("/auth/signin", { num : userData?.createdBy[0]?.phone  });
//           const { existingUser, token, message, user: userData, isNotification, isAdminNotification } = response.data;
//           dispatch(isNotificationsState(isNotification))
//           dispatch(isAdminNotificationState(isAdminNotification))

//           dispatch(setUser({ userData: { ...userData } }));
//           dispatch(setAuthTokenCookie(token));
//             if (existingUser) {
//             if(existingUser?.registrationPhase === "rejected"){   //decline
//                     navigate("/inreview")
//             }else if (existingUser?.isDeleted === true) {
//                 navigate("/reapprove");
//             } else if (existingUser.accessType === "0" || existingUser.accessType === "1") {
//                 navigate(`/admin/dashboard`);
//             // } else if (existingUser.registrationPhase === "rejected") {       //review
//             //   navigate(`/registration-form/1`);
//             } else if (existingUser.registrationPage === "6" && existingUser.registrationPhase === "notapproved") {
//                 navigate(`/waiting`);
//             } else if (existingUser.registrationPage !== "" && existingUser.registrationPhase === "registering") {
//                 navigate(`/registration-form/${existingUser.registrationPage}`, {state: passPage});
//             } else {

//              waitForRouteStringAndNavigate();

//             }
//             }
//         }
//         } catch (error) {
//       if( error?.response?.data?.message === "You are banned"){
//         navigate("/banned")
//       }
//         console.error("Login failed:", error);

//         }
//     };

//     // console.log(userData, "verifl")

//   const handleOtplessUser = (user) => {
//     // console.log("Otpless user set:", user);
//     handleVerify(user)
//   };

//   if (!isAuthTokenValid() || (userData && userData?.createdBy[0]?.phone !== `${countryCode?.replace("+", "")}${phoneNumber?.slice(countryCode?.length)}`)) {
//     return <VerifyOtpLessNum onOtplessUser={handleOtplessUser}/>;
//   }

//   return (
//     <>

//       <Ho  me />
//     </>
//   );
// };

// export default VerifyNumber;



const VerifyNumber = () => {
  const location = useLocation();
  const identity = location?.state?.action;
  const [isEmail, setIsEmail] = useState("");
  const [isOtp, setIsOtp] = useState("");
  const [isShow, setIsShow] = useState(false);
  const [timer, setTimer] = useState(20);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = async () => {
    if (!emailRegex.test(isEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }
    try {
      const res =
        identity === "signup"
          ? await VerifyEmailSignup(isEmail)
          : await VerifyEmailLogin(isEmail);
      setIsShow(true);
      toast.success(res.data.message || "Otp sent to your email");
    } catch (error) {
      console.log("Something went wrong", error);
    }
  };
  const handleResendOtp = async () => {
    try {
      const res =
        identity === "signup"
          ? await VerifyEmailSignup(isEmail)
          : await VerifyEmailLogin(isEmail);

      toast.success(res.data.message || "Otp resent successfully");

      setTimer(300);
    } catch (error) {
      console.log("Resend failed", error);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const res = await VerifyOtp(isEmail, isOtp);
      toast.success(res.data.message || "Otp Verified successfully");
    } catch (error) {
      console.log("Something went wrong", error);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  useEffect(() => {
    let interval;
    if (isShow) {
      setTimer(20);
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
        phone;
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isShow]);


      const handleVerify = async (user) => {
        try {
        if (!isAuthTokenValid() || userData === null || userData?.createdBy?.email) {
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


 
  return (
    <>
      {/* Marquee */}
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

      {/* Centered otp ui */}
      {isShow ? (
        <div className="flex items-center justify-center min-h-screen relative">
          <div className="bg-white pb-9 shadow rounded-lg md:w-[38%] w-full p-10 app-open-animation relative">
            <Link
              to="/"
              className="absolute right-6 top-5 text-[20px] cursor-pointer"
            >
              <RxCross2 />
            </Link>
            <p className="text-center font-DMsans text-black font-semibold text-[25px]">
              Verify the Email Id
            </p>
            <p className="text-center text-gray-500 text-[14px]">
              OTP has been sent on {isEmail}
            </p>

            <div className="flex flex-col justify-center items-start font-DMsans gap-5 mt-9">
              <input
                type="text"
                className="mt-[-13px] w-full px-2 py-2 border bg-slate-200 rounded"
                placeholder="Enter Otp"
                name="otp"
                value={isOtp}
                onChange={(e) => setIsOtp(e.target.value)}
              />
            </div>
            <span className="flex justify-between items-center mt-3 text-[14px]">
              <span>{formatTime(timer)}</span>
              <span
                onClick={timer === 0 ? handleResendOtp : null}
                className={`cursor-pointer ${
                  timer > 0
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-primary hover:underline"
                }`}
              >
                Resend Otp
              </span>
            </span>
            <p
              onClick={handleVerifyOtp}
              className="text-center mt-6 bg-primary text-white py-3 rounded-md cursor-pointer"
            >
              Verify
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-screen relative">
          <div className="bg-white pb-9 shadow rounded-lg md:w-[38%] w-full p-10 app-open-animation relative">
            <Link
              to="/"
              className="absolute right-6 top-5 text-[20px] cursor-pointer"
            >
              <RxCross2 />
            </Link>
            <p className="text-center font-DMsans text-black font-semibold text-[25px]">
              Verify the Email Id
            </p>

            <div className="flex flex-col justify-center items-start font-DMsans gap-5 mt-5">
              <p>Email Id</p>

              <input
                type="text"
                className="mt-[-13px] w-full px-2 py-2 border bg-slate-200 rounded"
                placeholder="Enter your email"
                name="email"
                value={isEmail}
                onChange={(e) => setIsEmail(e.target.value)}
              />
            </div>
            <p
              onClick={handleSubmit}
              className="text-center mt-9 bg-primary text-white py-3 rounded-md cursor-pointer"
            >
              Submit
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default VerifyNumber;
