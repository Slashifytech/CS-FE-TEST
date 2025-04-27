import React from "react";
import { BackArrow } from "./DataNotFound";
import Footer from "./Footer";
import { logo } from "../assets";

const ContactUs = () => {
  const token = localStorage.getItem('authToken');

  return (
    <>
      <div className="bg-[#FCFCFC] md:px-12 sm:px-9 navshadow #conditions md:block sm:block hidden">
        <img src={logo} alt="" className="md:w-[16vh] sm:w-[11vh] pt-2 " />
      </div>
      <BackArrow className="md:absolute sm:fixed  md:ml-12   w-full fixed  sm:ml-5" />
      <div
        className="bg-[#FCFCFC]  px-9 py-12 rounded-xl shadow md:mt-9 sm:mt-20 mt-28  md:mx-56 sm:mx-12 mx-6 mb-9"
        id="policy"
      >
        <p className=" font-montserrat  font-semibold text-[22px] text-center my-5">
          Get in Touch with Us
        </p>
        <span className=" font-DMsans font-light text-[14px]">
          <p>
            At Connecting Soulmate, we value your feedback and support. If you
            have any questions, concerns, or need assistance, please don't
            hesitate to contact us.
          </p>
          <p className="text-[16px] font-semibold font-montserrat my-3 mt-4">
            Contact Information
          </p>
          <p className ="font-medium">
            Email: work.connectingsoulmate@gmail.com
            <p className="mt-4 text-primary mb-2 font-medium">
              Our dedicated team is available to assist you. We aim to respond
              to all inquiries within 3-5 business days.
            </p>
            Thank you for choosing Connecting Soulmate . We look forward to
            helping you find your perfect match.
          </p>
        </span>
      </div>
      {!token &&
      
      <Footer />
      }
    </>
  );
};

export default ContactUs;
