import React, { useState, useEffect } from "react";
import "react-phone-input-2/lib/style.css";
import {  useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser, setAuthTokenCookie } from "../../Stores/slices/AuthSlice";
import apiurl from "../../util";
import { logo } from "../../assets";

const LoginPopup = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const routeString = localStorage.getItem('enString')
  const params = new URLSearchParams(location.search);
  const code = params.get("code");
  const expiryTime = params.get("expiryTime");
  const [loginCode, setLoginCode] = useState(code);

  useEffect(() => {
    if (code) {
      const handleLogin = async () => {
        try {
          // Make the API call to sign in
          const response = await apiurl.post("/auth/signin", {
            code: loginCode,
            expiryTime,
          });
          const { existingUser, token, message } = response.data;

          dispatch(setUser({ userData: { ...existingUser } }));
          dispatch(setAuthTokenCookie(token)); // Assuming the API response includes a token

          if (
            existingUser.accessType === "0" ||
            existingUser.accessType === "1"
          ) {
            navigate("/admin/dashboard"); //whichever admin route
          } else if (
            existingUser.registrationPage === "6" &&
            existingUser.registrationPhase === "notapproved"
          ) {
            navigate("/waiting"); //navigate to that popup
          } else if (
            existingUser.registrationPage !== "" &&
            existingUser.registrationPhase === "registering"
          ) {
            navigate(`/registration-form/${existingUser.registrationPage}`);
          } else {
            navigate(`/user-dashboard${routeString}`);
          }
        } catch (error) {
          console.error("Login failed:", error);
        }
      };
      handleLogin();
    }
  }, [location, code, loginCode]);

  return (
    <>
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex items-center justify-center flex-col min-h-screen">
          <div className="fixed inset-0 bg-black opacity-45"></div>
          <img src={logo} alt="" />
          <p className="text-center font-montserrat font-semibold text-primary text-[25px]">
            Connecting Soulmate Welcomes you...{" "}
          </p>
        </div>
      </div>
    </>
  );
};

export default LoginPopup;
