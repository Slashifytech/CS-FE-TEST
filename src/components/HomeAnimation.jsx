import React, { useMemo } from 'react'
import { cardData, chooseData, heroImage, heroImageTwo } from '../DummyData/HomeData';
import { appstore, founder, googleplay, MobileProto } from '../assets';
import { TbHeartSearch } from "react-icons/tb";
import { RxEnter } from "react-icons/rx";
import { FaPeopleArrows, FaUserAlt } from "react-icons/fa";
import { Link } from "react-router-dom";


const HomeAnimation = () => {
    const containerStyle = useMemo(
        () => ({
          position: "relative",
          overflow: "hidden",
        }),
        []
      );
    
      const imageContainerStyle = useMemo(
        () => ({
          display: "flex",
          flexDirection: "column",
          animation: "scroll 20s linear infinite alternate",
        }),
        []
      );
    
      const imageContainerStylerev = useMemo(
        () => ({
          display: "flex",
          flexDirection: "column",
          animation: "scrollr 20s linear infinite alternate",
        }),
        []
      );
    
      const scrollAnimation = useMemo(
        () => `
        @keyframes scroll {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-50%); 
          }
        }
      `,
        []
      );
    
      const scrollAnimationReverse = useMemo(
        () => `
        @keyframes scrollr {
          100% {
            transform: translateY(0%);
          }
          0% {
            transform: translateY(-50%); 
          }
        }
      `,
        []
      );
  return (
    <>
<div className=" flex  gap-3 sm:mx-6 md:flex-row  sm:flex-row items-center justify-start  ">
            <div className="flex ">
              <div
                className="mt-9 h-[60vh] sm:h-[30vh] md:h-[70vh] "
                style={containerStyle}
              >
                <style>{scrollAnimation}</style>
                <div
                  className="md:h-[600%] h-[300%]"
                  style={imageContainerStyle}
                >
                  {heroImage.map((item, index) => (
                    <img
                      key={item.id}
                      src={item.hero}
                      loading="lazy"
                      className="w-60 h-96   py-1 "
                      alt="banner"
                    />
                  ))}
                </div>
              </div>
            </div>
            <div
              className="mt-9 h-[60vh] sm:h-[30vh] md:h-[70vh]"
              style={containerStyle}
            >
              <style>{scrollAnimationReverse}</style>
              <div
                className="md:h-[600%] h-[300%]"
                style={imageContainerStylerev}
              >
                {heroImageTwo.map((item, index) => (
                  <img
                    key={item.id}
                    src={item.hero}
                    loading="lazy"
                    className="w-60 h-96  py-1"
                    alt="banner"
                  />
                ))}
              </div>
            </div>
          </div>
    </>
  )
}



const AboutFounder = () => {
  return (
 <>
   <span className="flex md:flex-row sm:flex-row flex-col justify-center items-center mt-24">
          <h2 className="text-[#262626] text-[32px] font-bold font-montserrat ">
            About The Founder
          </h2>
        </span>

        <span className="md:px-24 sm:px-16  pt-12 sm:gap-9 md:gap-0 grid md:grid-cols-2  sm:grid-cols-2 grid-cols-1   items-center">
          <div className="mx-14">
            <div className="  md:rounded-[90px] rounded-[60px] background md:w-[76%]    sm:mt-5">
              <img
                src={founder}
                alt="mg"
                className=" pl-5 pt-3   "
                loading="lazy"
              />
            </div>
          </div>

          <span className=" mx-6">
            <h3 className="text-[22px] pt-5  font-semibold font-montserrat">
              Late Shri Bhagwan Das Kalwani
            </h3>
            <p className="text-[16px] text-normal md:mt-5 md:pe-8 sm:pe- ">
              Late Shri Bhagwan Das Kalwani, a charismatic soul, left an
              indelible mark by serving diverse communities worldwide. His
              magnetic personality propelled him to selflessly contribute to
              society, channeling his physical, financial, and emotional
              strengths.
              <br /> <br /> Alongside Mr. & Mrs. Lulla at Astoria Hotel, Dubai,
              he managed a marriage bureau as part of his charitable endeavors,
              benefiting all communities. Even in his absence, his legacy lives
              on through the dedicated members of his organization, perpetuating
              his energetic commitment to societal well-being. Shri Bhagwan Das
              Kalwani's spirit continues to inspire a global community,
              fostering connections and shared aspirations.
            </p>
          </span>
        </span>
 </>
  )
}



const HomeAppDownloadSec = () => {
  return (
    <div className="md:px-16 px-6 md:rounded-[99px] rounded-[50px] bg-primary md:mx-16 sm:mx-9 mx-6 mt-32 py-5">
          <span className="flex md:flex-row sm:flex-row sm:py-6 flex-col-reverse  justify-between items-center">
            <span className="  ">
              <h3 className="font text-white md:text-[35px] sm:text-[22px] text-[20px]  font-bold mt-6">
                Your Perfect Match Awaits – Instantly on Your Fingertips!
              </h3>
              <p className=" text-white md:pe-36 sm:pe-32 pt-3 text-[16px] ">
                Unlock a world of genuine connections with the Connecting
                Soulmate App. Download today on apple store or google play.
              </p>
              <span className="flex justify-start items-center mt-5 gap-5">
              <Link to = "https://play.google.com/store/apps/details?id=com.connecting_soulmate">
                <img
                  src={googleplay}
                  alt="googleplaylogo"
                  className="w-28"
                  loading="lazy"
                />
                </Link>
              <Link to = "https://apps.apple.com/app/connecting-soulmate-app/id6739143901">

                <img
                  src={appstore}
                  alt="appstorelogo"
                  className="w-28"
                  loading="lazy"
                />
                </Link>
              </span>
            </span>
            <img
              src={MobileProto}
              alt="img"
              className=" m-9 sm:w-60 md:w-96  "
              loading="lazy"
            />
          </span>
        </div>
  )
}


const ProcessSection =()=>{
  const icons = [FaUserAlt, TbHeartSearch, RxEnter, FaPeopleArrows];

  return(
    <>
    <span className="flex justify-center items-center mt-20">
    <h2 className="text-[#262626] text-[32px] font-bold font-montserrat ">
      Process
    </h2>
  </span>
    <span className="grid grid-cols-1 md:grid-cols-4 ss:grid-cols-2 sm:grid-cols-2 gap-8  md:px-16 px-6 sm:px-16 mt-12 font-DMsans">
    {cardData.map((m, index) => (
      <span className="rounded-2xl py-5 pb-9  card ">
        <span className="flex items-center justify-center ">
          {React.createElement(icons[index % icons.length], {
            size: 39,
            className: "mt-12",
          })}
        </span>
        <span className="flex items-center justify-center">
          <h3 className="text-[22px] font-medium font mt-3 text-center px-5">
            {m.title}
          </h3>
        </span>
        <span className="flex items-center justify-center">
          <p className="text-[16px] pt-5 px-5 pe-3 font-normal font-DMsans text-start ">
            {m.text}
          </p>
        </span>
      </span>
    ))}
  </span>
  </>
  )
}


const ChooseSection =()=>{
  return(
    <>
    <span className="flex justify-center items-center px-3 md:mt-24 mt-8 ">
    <h2 className="text-[#262626] text-[32px] font-bold font-montserrat ">
      Why You Choose Us
    </h2>
  </span>

    <span className="flex flex-wrap justify-center items-center   text-primary  ">
    {chooseData.map((i, index) => (
      <React.Fragment key={index}>
        <div className="flex flex-col justify-center items-center md:w-[30%] sm:w-[30%] w-[70%] mt-14">
          <span className="px-7 md:text-[25px] sm:text-[20px]  text-[25px] font-semibold text-style">
            {i.head}
          </span>
          <span className="font-semibold sm:text-center">{i.title}</span>
          <p className="font text-[16px] font-DMsans font-medium text-black text-center text-wrap w-2/3">
            {i.text}
          </p>
        </div>
        {index !== 5 && (
          <hr className="w-36 bg-primary h-[2px] sm:hidden md:hidden mt-5" />
        )}
        {index !== 2 && index !== 5 && (
          <div className="line mt-14 hidden sm:block md:block"></div>
        )}
      </React.Fragment>
    ))}
  </span>
  </>
  )
}

export {HomeAnimation, AboutFounder, HomeAppDownloadSec, ProcessSection, ChooseSection}
export default HomeAnimation