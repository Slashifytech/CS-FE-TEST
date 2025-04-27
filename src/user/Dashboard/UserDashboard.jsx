import React, { useEffect, useState, useMemo, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import apiurl from "../../util";
const MobileSidebar = lazy(() => import("./MobileSidebar"));
const AllMatchesCard = lazy(() => import("./AllMatchesCard"));
import { userDataStore } from "../../Stores/slices/AuthSlice";
import SideBar from "./SideBar";
import Header from "./../../components/Header";
import OneSignal from "react-onesignal";
import axios from "axios";
import { getToken } from "../../Stores/service/getToken";
import useOneSignal from "../../Admin/comps/OnesignalInitialize";
const ActivityCard = () => {
  const [loading, setLoading] = useState(true);
  const { userData, userId } = useSelector(userDataStore);
  const [matchData, setMatchData] = useState([]);
  const [pendingRequest, setPendingRequests] = useState(0);
  const [links, setLinks] = useState([]);
  const [sentRequest, setSentRequest] = useState(0);
  const [acceptedRequest, setAcceptedRequest] = useState(0);
  const [shortlist, setShortlist] = useState(0);
  const [isBlockedUser, setIsBlockedUser] = useState(false);
  const [isBrowserId, setBrowserId] = useState();

  const [isPage, setPage] = useState(1);
  const dispatch = useDispatch();
  const { unseenMessages } = useSelector((state) => state.chat);
  useOneSignal(userId);
  const fetchData = async () => {
    if (userData && userData?.gender) {
      try {
        const partnerDetails = {
          ...userData?.partnerPreference,
          gender: userData?.gender,
        };
        const response = await apiurl.get(
          `/newlyJoined/${userId}?page=${isPage}&limit=5`,
          {
            params: partnerDetails,
          }
        );

        setMatchData(response?.data?.users?.slice(0, 5));
        setIsBlockedUser(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    dispatch({ type: "UNSEEN_MESSAGES" });
  }, []);

  const fetchDashboardData = async () => {
    if (userData) {
      try {
        const response = await apiurl.get(`/user-dashboard-data/${userId}`);
        const {
          interestRequestsByUser,
          interestRequestsToUser,
          profileRequestsByUser,
          profileRequestsToUser,
          acceptedProfileRequests,
          acceptedInterestRequests,
          shortListed,
        } = response.data;

        setAcceptedRequest(
          acceptedInterestRequests + acceptedProfileRequests || 0
        );
        setSentRequest(interestRequestsByUser + profileRequestsByUser || 0);
        setPendingRequests(interestRequestsToUser + profileRequestsToUser || 0);
        setShortlist(shortListed || 0);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  useEffect(() => {
    fetchData();
    fetchDashboardData();
  }, [userData, userId, isPage, isBlockedUser]);
  const userdata = useMemo(
    () => [
      { name: "Pending Invitations", quantity: pendingRequest },
      { name: "Accepted Invitations", quantity: acceptedRequest },
      { name: "Invitations Sent", quantity: sentRequest },
      { name: "Shortlisted Profiles", quantity: shortlist },
      { name: "Unread Chats", quantity: unseenMessages },
    ],
    [pendingRequest, acceptedRequest, sentRequest, shortlist]
  );

  const updateLinks = () => {
    const isMobileOrTablet = window.innerWidth <= 1080;
    const newLinks = [
      "/inbox/profiles/recieved",
      "/inbox/profiles/accepted",
      "/inbox/profiles/sent",
      "/shortlisted",
      isMobileOrTablet ? "/chat-list-interest-accepted" : "/chat",
    ];
    setLinks(newLinks);
  };

  useEffect(() => {
    updateLinks();
    window.addEventListener("resize", updateLinks);

    return () => window.removeEventListener("resize", updateLinks);
  }, []);

  // useEffect(() => {
  //   // Initialize OneSignal
  //   OneSignal.init({
  //     appId: "6018f635-bc06-403b-97c5-3cd78d92b2ce",
  //     safari_web_id: "web.onesignal.auto.184299bc-1c91-4dec-a5d4-b75cfd155372",
  //     notifyButton: {
  //       enable: true,
  //     },
  //     allowLocalhostAsSecureOrigin: true,
  //     promptOptions: {
  //       slidedown: {
  //         prompts: [
  //           {
  //             type: "push",
  //             text: {
  //               acceptButton: "Allow",
  //               cancelButton: "No Thanks",
  //               actionMessage: "We'd like to send you notifications.",
  //             },
  //           },
  //         ],
  //       },
  //     },
  //   })
  //     .then(async () => {
  //       console.log("OneSignal initialized");

  //       // Check if push notifications are supported
  //       if (OneSignal.Notifications.isPushSupported()) {
  //         // Request push notification permissions
  //         await OneSignal.Notifications.requestPermission();

  //         // Get OneSignal Player ID (user subscription ID)
  //         const oneSignalUserId = await OneSignal.User.PushSubscription.id;

  //         if (oneSignalUserId) {
  //           console.log("OneSignal Player ID:", oneSignalUserId);
  //           if (userId) {
  //             await apiurl.put(
  //               "/update-subscription-browser-id",
  //               oneSignalUserId
  //             ).then(response => {
  //               console.log('Subscription saved successfully:', response.data);
  //             })
  //             .catch(error => {
  //               console.error('Error saving subscription:', error);
  //             });
  //           }
  //         }
  //       } else {
  //         console.error("Push notifications are not supported");
  //       }
  //     })

  //     .catch((error) => {
  //       console.error("OneSignal initialization failed", error);
  //     });
  // }, []);

  // useEffect(() => {
  //   const initOneSignal = async () => {
  //     try {
  //       // Initialize OneSignal
  //       await OneSignal.init({
  //         appId: "6018f635-bc06-403b-97c5-3cd78d92b2ce",
  //         safari_web_id:
  //           "web.onesignal.auto.184299bc-1c91-4dec-a5d4-b75cfd155372",
  //         notifyButton: {
  //           enable: false,
  //         },
  //         allowLocalhostAsSecureOrigin: true,
  //         promptOptions: {
  //           slidedown: {
  //             enabled: false,
  //           },
  //         },
  //       });

  //       // console.log("OneSignal initialized");

  //       // Check if push notifications are supported
  //       if (!OneSignal.Notifications.isPushSupported()) {
  //         console.error(
  //           "Push notifications are not supported on this browser."
  //         );
  //         return; // Exit early if not supported
  //       }

  //       // Request permission for push notifications
  //       const permission = await OneSignal.Notifications.requestPermission();

  //       if (permission !== "granted") {
  //         console.error(
  //           "Permission for notifications was denied or not granted."
  //         );
  //         return;
  //       }

  //       // Get OneSignal Player ID (user subscription ID)
  //       const oneSignalUserId = await OneSignal.User.PushSubscription.id;

  //       if (oneSignalUserId && userId) {
  //         // console.log("OneSignal Player ID:", oneSignalUserId);

  //         // Send the Player ID to the backend for this user
  //         // setBrowserId(oneSignalUserId)
  //         await axios
  //           .put("/update-subscription-browser-id", {
  //             userId: userId,
  //             browserId: oneSignalUserId,
  //           })
  //           .then((response) => {
  //             // console.log("Subscription saved successfully:", response.data);
  //           })
  //           .catch((error) => {
  //             console.error("Error saving subscription:", error);
  //           });
  //       }
  //     } catch (error) {
  //       console.error("OneSignal initialization failed", error);
  //     }
  //   };

  //   // Call the initialization function
  //   if (userId) {
  //     initOneSignal();
  //   }
  // }, [userId]);

 


  // // const updateBrowserId = async()=>{
  // //   try{
  // //     const res = await apiurl.put (`/delete-subscription-browser-id`,{
  // //       browserId: isBrowserId,
  // //     })
  // //   }catch(error){
  // //     console.log(error);
  // //   }
  // // }

  return (
    <>
      <Suspense fallback={<span>loading...</span>}>
        <MobileSidebar />
      </Suspense>
      <Header />
      <SideBar />

      {loading ? (
        <>
          <span className="px-6   md:w-1/4 sm:w-[39%]  mt-28 rounded-lg absolute md:block sm:block hidden">
            <Skeleton height={830} />
          </span>
          <span className="px-4  w-full rounded-lg absolute md:hidden sm:hidden block top-24">
            <Skeleton height={260} />
          </span>
          <div className="md:block sm:hidden xl:block block">
            <div className="flex  flex-wrap items-center justify-around sm:justify-start    gap-3 md:ml-[25%]    md:justify-start  md:mt-36 mt-20">
              {Array(5)
                .fill()
                .map((_, i) => (
                  <Skeleton key={i} height={180} width={170} />
                ))}
            </div>
            <div className="flex  flex-row items-center justify-around sm:justify-start    gap-3 md:ml-[25%]    md:justify-start  md:mt-9 mt-20">
              {Array(3)
                .fill()
                .map((_, i) => (
                  <Skeleton key={i} height={380} width={370} />
                ))}
            </div>
          </div>
          <div className="sm:block hidden md:hidden xl:hidden">
            <div className="flex  flex-wrap items-center sm:justify-start   gap-3  sm:mt-36  sm:ml-[38%]   ">
              {Array(5)
                .fill()
                .map((_, i) => (
                  <Skeleton key={i} height={180} width={130} />
                ))}
            </div>
            <div className="flex  flex-row items-center sm:justify-start   gap-3  sm:mt-9  sm:ml-[38%]">
              {Array(2)
                .fill()
                .map((_, i) => (
                  <Skeleton key={i} height={380} width={370} />
                ))}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col items-start justify-start">
            <div className="pt-5 md:mt-28  md:pe-20 md:ml-[25%] xl:ml-[18%] sm:ml-[38%]  md:mb-8 md-9 sm-0 mx-6 md:mx-0 mt-9 sm:mt-28">
              <p className="font-semibold font-DMsans pb-5 text-[22px]">
                Your Activity Summary
              </p>
              <span className="flex flex-wrap items-center justify-around sm:justify-start font-DMsans md:justify-start">
                {userdata.map((user, index) => (
                  <Link
                    to={links[index]}
                    key={index}
                    className="md:w-40 md:h-full md:py-9 sm:py-0 py-0 h-[20vh] sm:h-[10rem] sm:w-32 w-36 shadow sm:mx-3 rounded-lg flex flex-col justify-center items-center mb-9 md:mb-9"
                  >
                    <h1
                      className={`font-semibold ${
                        user.name === "Last Logged In"
                          ? "text-[18px]"
                          : "text-[30px]"
                      }`}
                    >
                      {user?.quantity}
                    </h1>
                    <p className="pt-2 font-semibold text-[18px] text-center px-8">
                      {user?.name}
                    </p>
                  </Link>
                ))}
              </span>
            </div>
          </div>
          <div className="md:ml-[26%] xl:ml-[18%] sm:ml-[39%] ml-6 mb-36">
            <span className="flex items-center justify-between pb-4">
              <p className="font-semibold font-DMsans text-[21px]">
                Recently Joined
              </p>
              <Link to="/new-join">
                <p className="font-normal font-DMsans text-black underline px-6 cursor-pointer">
                  See All
                </p>
              </Link>
            </span>
            <div className="flex flex-row gap-7 overflow-x-scroll py-3 px-1 scrollbar-hide mb-9">
              <Suspense
                fallback={<Skeleton height={150} width={150} count={5} />}
              >
                {matchData?.map((profileDetails, index) => (
                  <AllMatchesCard
                    key={profileDetails?._id}
                    profileDetails={profileDetails}
                    setPage={setPage}
                    setIsBlockedUser={setIsBlockedUser}
                  />
                ))}
              </Suspense>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ActivityCard;
