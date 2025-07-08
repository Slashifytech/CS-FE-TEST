import React, { lazy, Suspense, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { heroCircles, logo } from "../assets/index.js";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useDispatch, useSelector } from "react-redux";
import { userDataStore } from "../Stores/slices/AuthSlice.jsx";
import apiurl from "../util.js";
import { jwtDecode } from "jwt-decode";
import Footer from "../components/Footer.jsx";
import HomeAnimation, { ChooseSection } from "../components/HomeAnimation.jsx";
import { useState } from "react";

const ProcessSection = React.lazy(() =>
  import("../components/HomeAnimation.jsx").then((module) => ({
    default: module.ProcessSection,
  }))
);
const AboutFounder = React.lazy(() =>
  
  import("../components/HomeAnimation.jsx").then((module) => ({
    default: module.AboutFounder,
  }))
);
const HomeAppDownloadSec = React.lazy(() =>
  import("../components/HomeAnimation.jsx").then((module) => ({
    default: module.HomeAppDownloadSec,
  }))
);


gsap.registerPlugin(ScrollTrigger);
const Home = () => {
  const dispatch = useDispatch();
  const { userData, userId } = useSelector(userDataStore);
  const waitForRouteStringAndNavigate = () => {
    const checkInterval = setInterval(() => {
      const route = localStorage.getItem("enString");
      if (route && route.trim() !== "" ) {
        clearInterval(checkInterval);
        setTimeout(() => {
          navigate(`/user-dashboard/${route}`);
        }, 300); 
      }
    }, 200);
  };
  
  const navigate = useNavigate();
  const isAuthTokenValid = (action) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      localStorage.removeItem("authToken");
      navigate("/verify-number", { state: { action } });
      return false;
    }
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      const expiryTime = decodedToken.exp;
      const timeDifference = expiryTime - currentTime;
      if (timeDifference <= 0) {
        localStorage.removeItem("authToken");
      navigate("/verify-number", { state: { action } });

        return false;
      }

      return true;
    } catch (error) {
      localStorage.removeItem("authToken");
      navigate("/verify-number", { state: { action } });

      return false;
    }
  };

  const passPage = "passPage";

  const handleVerify = async (user, action) => {
    try {
      if (!localStorage.getItem("authToken")) {
      navigate("/verify-number", { state: { action } });
      }
      if (!isAuthTokenValid(action) || userData === null) {
        if (user) {
          let num;
          if (user.mobile && user.mobile.number) {
            num = user?.mobile?.number;
          } else {
            num = user?.identities[0]?.identityValue;
          }

          const response = await apiurl.post("/auth/signin");
          const { existingUser, token, message } = response.data;
          dispatch(setUser({ userData: { ...existingUser } }));
          dispatch(setAuthTokenCookie(token));
          if (existingUser) {
            if (existingUser?.registrationPhase === "rejected") {
              //decline
              navigate("/inreview");
            } else if (existingUser.isDeleted === true) {
              navigate("/reapprove");
            } else if (
              existingUser.accessType === "0" ||
              existingUser.accessType === "1"
            ) {
                     waitForRouteStringAndNavigate(); 

            } else if (
              existingUser.registrationPage === "6" &&
              existingUser.registrationPhase === "notapproved"
            ) {
              navigate(`/waiting`);
            } else if (
              existingUser.registrationPage !== "" &&
              existingUser.registrationPhase === "registering"
            ) {
              navigate(`/registration-form/${existingUser.registrationPage}`, {
                state: passPage,
              });
            } else {
                     waitForRouteStringAndNavigate(); 

            }
          } else {
            navigate(`/signup/${num}`);
          }
        }
        return false;
      } else {
        if (userData) {
          if (userData?.registrationPhase === "rejected") {
            //decline
            navigate("/inreview");
          } else if (userData?.isDeleted === true) {
            navigate("/reapprove");
          } else if (
            userData.accessType === "0" ||
            userData.accessType === "1"
          ) {
            navigate(`/admin/dashboard`);
          } else if (
            userData.registrationPage === "6" &&
            userData.registrationPhase === "notapproved"
          ) {
            navigate(`/waiting`);
          } else if (
            userData.registrationPage !== "" &&
            userData.registrationPhase === "registering"
          ) {
            navigate(`/registration-form/${userData.registrationPage}`, {
              state: passPage,
            });
          } else {
                   waitForRouteStringAndNavigate(); 

          }
        }
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  useEffect(() => {
    gsap.from(".anim", {
      duration: 1,
      opacity: 0,
      x: 200,
      ease: "power2.out",
    });

    gsap.from(".popimg", {
      opacity: 0,
      scale: 0.5,
      ease: "back",
      duration: 0.5,
      stagger: 0.8,
    });

    gsap.from(".popHero", {
      opacity: 0,
      scale: 0.5,
      ease: "back",
      duration: 1.5,
      stagger: 0.8,
    });

    gsap.from(".anim-img", {
      duration: 2,
      opacity: 0.5,
      x: -90,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".anim-img",
        start: "top 80%",
        end: "bottom 20%",
        scrub: 2,
      },
    });

    gsap.from(".anim-text", {
      duration: 2,
      opacity: 0,
      x: 90,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".anim-text",
        start: "top 80%",
        end: "bottom 20%",
        scrub: 2,
      },
    });
  }, []);

  return (
    <>
      <nav>
        <div className="flex w-full justify-between item-center md:px-9 px-6  py-1 bg-[#FCFCFC] navshadow z-30">
          <img loading="lazy" src={logo} alt="logo" className="sm:w-28 w-24 " />
          <span className="flex justify-end items-center flex-1">
            <span
              className="border-[1px] mx-6 border-[#A92525] p-1 px-3 rounded-lg text-[#A92525] cursor-pointer hover:bg-[#A92525] hover:text-white"
  onClick={() => handleVerify(null, "signup")}
            >
              Sign up
            </span>
            <span
              className="background p-[7px] px-5 rounded-xl text-white cursor-pointer"
  onClick={() => handleVerify(null, "login")}
            >
              Log in
            </span>
          </span>
        </div>
      </nav>

      {/* HERO SECTION */}

      <div>
        <span className=" flex  md:flex-row flex-col sm:flex-row relative md:mx-16 mx-6 mb-0 ">
            <HomeAnimation/>
          <span className="md:mt-36 sm:mt-36 md:absolute  md:right-9  sm:right-0  mb-6">
            <img
              src={heroCircles}
              alt="ellipse"
              className="absolute top-0 right-16 w-36 md:-translate-y-9 popimg "
              loading="lazy"
            />
            <img
              src={heroCircles}
              alt="ellipse"
              className="absolute top-80 right-0 w-36 popimg "
              loading="lazy"
            />
            <p className=" font-montserrat text-primary md:mt-0 mt-3 font-bold md:text-[48px] sm:text-[28px] text-[28px] relative  anim">
              Connecting hearts, <br />
              building futures
            </p>
            <img
              src={heroCircles}
              alt="ellipse"
              className="absolute top-0 w-16 -translate-x-3 popimg"
              loading="lazy"
            />
            <p className="text-[18px] font-DMsans font-normal mt-1 anim">
              Your Journey to happily ever after starts here with us at
              Connecting <br /> Soulmate -{" "}
              <span className="text-primary font-normal">
                honorary services for hindu community
              </span>
            </p>
            <span className="flex flex-row items-center font-DMsans mt-9 gap-9">
              <span
  onClick={() => handleVerify(null, "signup")}
                className="border popimg border-primary text-primary px-6 py-2 cursor-pointer rounded-lg"
              >
                Sign up
              </span>
              <span
  onClick={() => handleVerify(null, "login")}
                className="px-7 py-[10px] bg-primary text-white cursor-pointer rounded-lg popimg"
              >
                Log in
              </span>
              <img
                src={heroCircles}
                alt="ellipse"
                className="absolute top-36 right-0 w-16 popimg "
                loading="lazy"
              />
            </span>
            <img
              src={heroCircles}
              alt="ellipse"
              className="absolute top-80 right-60 w-16 popimg"
              loading="lazy"
            />
          </span>
        </span>
      </div>

      {/* //why choose us */}
      <span>
  
          <ChooseSection />
   

        <Suspense fallback={<span>Loading...</span>}>
          <ProcessSection />
        </Suspense>

        {/* About section */}
        <Suspense fallback={<span>Loading...</span>}>
          <AboutFounder />
        </Suspense>

        <Suspense fallback={<span>Loading...</span>}>
          <HomeAppDownloadSec />
        </Suspense>
     
          <Footer/>
     
      </span>
    </>
  );
};

export default Home;
