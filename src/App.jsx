import { Route, Routes, useNavigate } from "react-router-dom";
import Home from "./user/Home";
import Signup from "./user/Signup/Signup";
import LoginPopup from "./user/Login/LoginPopup";
import NumberChangeAlert from "./user/Settings/components/NumberChangeAlert";
import DeleteAlert from "./user/Settings/components/DeleteAlert";
import Consent from "./user/Signup/Consent";
import { RegistrationFile } from "./user/Registration";
import BasicSearch from "./user/search/BasicSearch";
import IdSearch from "./user/search/IdSearch";
import { AllMatch, NewJoin, SearchResult, Shortlisted } from "./user/matches"
import ProfileReq from "./user/Inbox/ProfileReq";
import ActivityCard from "./user/Dashboard/UserDashboard";
import Thankyou from "./user/Registration/Thankyou";
import ErrorPage from "./components/ErrorPage";
import Profile from "./user/Dashboard/Profile";
import ImageEdit from "./user/Dashboard/ImageEdit";
import PartnerEdit from "./user/Dashboard/PartnerEdit";
import InterestReq from "./user/Inbox/IntrestReq";
import Dashboard from "./Admin/Dashboard";
import User from "./Admin/User";
import ContactUpdate from "./user/Settings/ContactUpdate";
import BlockProfile from "./user/Settings/BlockProfile";
import WhatSappSetting from "./user/Settings/WhatSappSetting";
import DelAccount from "./user/Settings/DelAccount";
import RegNumber from "./user/Settings/RegNumber";
import SubsEmail from "./user/Settings/SubsEmail";
import Approval from "./Admin/Approval";
import ReportList from "./Admin/ReportList";
import { useEffect, useRef, useState } from "react";
import NumberChangePop from "./user/PopUps/NumberChangePop";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import PdfData from "./Admin/comps/PdfData";
import Chat from "./user/chat/Chat";
import ReApprove from "./user/Settings/components/ReapproveReq";
import Dummy from "./components/dummy";
import Currency from "./Admin/Currency";
import NotificationReceiver from "./user/notification/UserNotification";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Terms from "./components/Terms";
import Privacy from "./components/Privacy";
import Notifications from "./Admin/Notifications";
import BeforeApprovalPage from "./user/Registration/BeforeApprovalpage";
import VerifyLinkReq from "./user/Registration/VerifyLinkReq";
import AllFemaleUser from "./Admin/comps/AllFemaleUser";
import AllMaleUser from "./Admin/comps/AllMaleUser";
import DeletedUsers from "./Admin/comps/DeletedUsers";
import MarriedUsers from "./Admin/comps/MarriedUser";
import CategoryAUser from "./Admin/comps/CategoryAUser";
import CategoryBUser from "./Admin/comps/CategoryBUser";
import CategoryCUser from "./Admin/comps/CategoryCUser";
import ReviewAlert from "./Stores/slices/ReviewAlert";
import CategoryUnUser from "./Admin/comps/UnCategorisedUser";
import ActiveUser from "./Admin/comps/TotalActiveUser";
import WaitingOrRejected from "./user/Settings/components/WaitingOrRejected";
import {
  isAdminNotifications,
  isNotification,
  notificationStore,
} from "./Stores/slices/notificationslice";
import VerifyNumber from "./user/verification/VerifyNumber";
import { setIsToggle } from "./Stores/slices/UpdateSlice";
import apiurl from "./util";
import {
  decodeCookieAndFetchUserData,
  userDataStore,
} from "./Stores/slices/AuthSlice";
import ChatSidebar from "./user/chat/ChatSidebar";
import { setChatUsers, setMessages } from "./Stores/slices/chatSlice";
import BannedUserData from "./Admin/comps/BannedUserData";
import BannedUser from "./user/PopUps/BannedUser";
import AdminNotificationForUser from "./Admin/comps/AdminNotificationData";
import RejectedUsers from "./Admin/comps/RejectedUsers";
import { initGA, logPageView } from "./analyticsFile/Ganalytics";
import { fetchMasterData } from "./Stores/slices/MasterSlice";
import OneSignal from "react-onesignal";
import NotificationSubs from "./user/Settings/NotificationSubs";
import NotificationSubscribe from "./Admin/comps/NotificationSubscribe";
import { getToken } from "./Stores/service/getToken";
import ContactUs from "./components/ContactUs";
import UserReport from "./Admin/UserReport";
import { stringForRoute } from "./Stores/service/Genricfunc";
import { storeRouteString } from "./Stores/slices/RouteEncryptSlice";
import VerificationLoader from "./user/verification/VerificationLoader";
import Maintanance from "./user/verification/Maintanance";

const socket = io(import.meta.env.VITE_APP_DEV_BASE_URL);

const DeletedUserRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    {/* <Route path="/link-verification" element={<VerifyLinkReq />} /> */}
    <Route path="/waiting" element={<BeforeApprovalPage />} />
    <Route path="/form-submitted" element={<Thankyou />} />
    <Route path="/inreview" element={<ReviewAlert />} />
    <Route path="/maintainance" element={<Maintanance />} />

    <Route path="/signup" element={<Signup />} />
    <Route path="/verify-email" element={<VerifyNumber />} />
    <Route path="/reapprove" element={<ReApprove />} />
    <Route path="/deleted-account" element={<DeleteAlert />} />
    <Route path="/banned" element={<BannedUser />} />

    <Route path="/registration-form/:page" element={<RegistrationFile />} />
    <Route path="*" element={<Home />} />
  </Routes>
);

const DefaultRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/maintainance" element={<Maintanance />} />

    <Route path="/verifying/user/auth" element={<VerificationLoader />} />

    <Route path="/signup" element={<Signup />} />
    <Route path="/login/:number" element={<LoginPopup />} />
    <Route path="/verify-email" element={<VerifyNumber />} />
    <Route path="/form-submitted" element={<Thankyou />} />
    <Route path="/consent-form" element={<Consent />} />
    <Route path="/registration-form/:page" element={<RegistrationFile />} />
    <Route path="/link-verification" element={<VerifyLinkReq />} />
    <Route path="/waiting" element={<BeforeApprovalPage />} />
    <Route path="/dummy" element={<Dummy />} />
    <Route path="/terms" element={<Terms />} />
    <Route path="/privacy" element={<Privacy />} />
    <Route path="/contact" element={<ContactUs />} />
    <Route path="/banned" element={<BannedUser />} />
    <Route path="*" element={<Home LinkPage={"/"} />} />
  </Routes>
);

const AdminRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/maintainance" element={<Maintanance />} />

    <Route path="admin/dashboard" element={<Dashboard />} />
    <Route path="admin/user" element={<User />} />
    {/* <Route path="/link-verification" element={<VerifyLinkReq />} /> */}
    <Route path="admin/banned-users" element={<BannedUserData />} />
    <Route path="admin/approval-lists" element={<Approval />} />
    <Route path="admin/report-lists" element={<ReportList />} />
    <Route path="admin/user-reports" element={<UserReport/>} />

    <Route path="/admin/notification-subscribe" element={<NotificationSubscribe/>} />

    <Route path="admin/currency-value" element={<Currency />} />
    <Route path="/admin/usersnotification" element={<Notifications />} />
    <Route path="admin/notifications" element={<AdminNotificationForUser />} />
    <Route path="/admin/dashboard" element={<Dashboard />} />
    <Route path="/profile" element={<Profile />} />
    <Route path="/pdf" element={<PdfData />} />
    <Route path="/admin/rejected-users" element={<RejectedUsers />} />
    <Route path="/admin/successfull-married" element={<MarriedUsers />} />
    <Route path="/admin/categoryA-users" element={<CategoryAUser />} />
    <Route path="/admin/categoryB-users" element={<CategoryBUser />} />
    <Route path="/admin/categoryC-users" element={<CategoryCUser />} />
    <Route path="/admin/uncategorised-users" element={<CategoryUnUser />} />
    <Route path="/admin/deleted-users" element={<DeletedUsers />} />
    <Route path="/admin/active-users" element={<ActiveUser />} />
    <Route path="/admin/female-users" element={<AllFemaleUser />} />
    <Route path="/admin/notification-subscribe" element={<NotificationSubscribe />} />
    <Route path="/admin/male-users" element={<AllMaleUser />} />
    <Route path="/form-submitted" element={<Thankyou />} />
    <Route path="/waiting" element={<BeforeApprovalPage />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/signup-newUser" element={<Signup />} />
    <Route path="/verify-email" element={<VerifyNumber />} />
    <Route path="/registration-form/:page" element={<RegistrationFile />} />
    <Route path="/image-edit" element={<ImageEdit />} />
    <Route path="*" element={<ErrorPage LinkPage={"/admin/dashboard"} />} />
  </Routes>
);

const SubadminRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/admin/user" element={<ActivityCard />} />
    <Route path="/link-verification" element={<VerifyLinkReq />} />
    <Route path="/waiting" element={<BeforeApprovalPage />} />
    <Route path="*" element={<ErrorPage />} />
  </Routes>
);

const UserRoutes = ({routeString}) => (
  <Routes>
    <Route path="/"  element={<Home />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/verify-email" element={<VerifyNumber />} />
    <Route path="/consent-form" element={<Consent />} />
    <Route
      path="/change-register-email/:token"
      element={<NumberChangePop />}
    />
    <Route path="/inreview" element={<ReviewAlert />} />
    <Route path="/verifying/user/auth" element={<VerificationLoader />} />

    <Route path="/maintainance" element={<Maintanance />} />

    <Route path={`/user-dashboard/${routeString}`} element={<ActivityCard />} />
    <Route path="/basic-search" element={<BasicSearch />} />
    <Route path="/searchbyid" element={<IdSearch />} />
    <Route path="/form-submitted" element={<Thankyou />} />
    <Route path="/chat" element={<Chat />} />
    <Route path="/user-notification" element={<NotificationReceiver />} />
    <Route path="/all-matches" element={<AllMatch />} />
    <Route path="/new-join" element={<NewJoin />} />
    <Route path="/shortlisted" element={<Shortlisted />} />
    <Route path="/search-results" element={<SearchResult />} />
    <Route path="/inbox/profiles/:option" element={<ProfileReq />} />
    <Route path="/inbox/interests/:option" element={<InterestReq />} />
    <Route path="/profile" element={<Profile />} />
    <Route path="/partner-edit" element={<PartnerEdit />} />
    <Route path="/image-edit" element={<ImageEdit />} />
    <Route path="/settings/contact-info" element={<ContactUpdate />} />
    <Route path="/settings/block-profile" element={<BlockProfile />} />
    <Route path="/settings/whatsapp" element={<WhatSappSetting />} />
    <Route path="/settings/delete-profile" element={<DelAccount />} />
    <Route path="/settings/phonenumber" element={<RegNumber />} />
    <Route path="/settings/email" element={<SubsEmail />} />
    <Route path="/settings/notification-sub" element={<NotificationSubs />} />

    <Route path="/waiting-or-rejected" element={<WaitingOrRejected />} />
    <Route path="/consent-form" element={<Consent />} />
    <Route path="/form-submitted" element={<Thankyou />} />

    <Route path="/link-verification" element={<VerifyLinkReq />} />
    <Route path="/updated-registered-number" element={<NumberChangeAlert />} />
    <Route path="/deleted-account" element={<DeleteAlert />} />
    {/* <Route path="/reapprove" element={<ReApprove />} /> */}
    <Route path="/waiting" element={<BeforeApprovalPage />} />
    <Route path="/terms" element={<Terms />} />
    <Route path="/privacy" element={<Privacy />} />
    <Route path="/contact" element={<ContactUs />} />
    
    <Route path="/banned" element={<BannedUser />} />
    <Route path="/waiting" element={<BeforeApprovalPage />} />
    <Route path="/chat-list-interest-accepted" element={<ChatSidebar />} />
    <Route path="/*" element={<ErrorPage LinkPage={"/"} />} />
  </Routes>
);

function App() {
  const dispatch = useDispatch();

  const { isThere, isAdminThere } = useSelector(notificationStore);
  const routeString = localStorage.getItem('enString')
  const authToken = localStorage.getItem('authToken')
  const { userData, userId } = useSelector(userDataStore);
  const [accessType, setAccessType] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = getToken();

  const masterDataTypes = [
    "country",
    "state",
    "religion",
    "profession",
    "other",
    "interest",
    "fitness",
    "education",
    "diet",
    "community",
    "funActivity",
  ];
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      await dispatch(decodeCookieAndFetchUserData());
      setLoading(false);
    };

    fetchData();
  }, [dispatch]);

  const masterData = useSelector((state) => state.masterData);

  const fetchedDataTypes = useRef(new Set());

  useEffect(() => {
    masterDataTypes.forEach((type) => {
      if (
        !fetchedDataTypes.current.has(type) &&
        masterData[type].length === 0
      ) {
        dispatch(fetchMasterData(type));
        fetchedDataTypes.current.add(type);
      }
    });
    const intervalId = setInterval(() => {
      masterDataTypes.forEach((type) => {
        // console.log(fetchedDataTypes.current.has(type), masterData[type].length, type, "data")
        if (masterData[type].length === 0) {
          // console.log("check2");
          dispatch(fetchMasterData(type));
          fetchedDataTypes.current.add(type);
        }
      });
    }, 5000);

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, [dispatch, masterData, masterDataTypes]);

  useEffect(() => {
    if (userData) {
      setAccessType(userData);
    } else {
      setAccessType(null);
    }
  }, [userData]);

  useEffect(() => {
    socket.on(`NOTIFICATION/${userId}`, (data) => {
      dispatch(isNotification());
      dispatch(setIsToggle(true));
    });
    return () => {
      socket.off(`NOTIFICATION/${userId}`);
    };
  }, [socket, userId]);

  useEffect(() => {
    socket.on(`ADMIN_NOTIFICATION/${userId}`, () => {
      dispatch(isAdminNotifications());
    });
    return () => {
      socket.off(`ADMIN_NOTIFICATION/${userId}`);
    };
  }, [socket, userId]);

  useEffect(() => {
    socket.on(`CHAT_LIST/${userId}`, (data) => {
      dispatch(setChatUsers(data));
    });

    return () => {
      socket.off(`CHAT_LIST/${userId}`);
    };
  }, [socket, userId]);

  const subscribeNotification = async (newValue) => {
    if (userId) {
      try {
        const value = newValue;

        await apiurl.put(`/notification-status`, {
          userId,
          isValue: value,
        });
      } catch (err) {
        console.error("Error subscribing to email:", err);
        // Handle error
      }
    }
  };
  const subscribeAdminNotification = async (newValue) => {
    if (userId) {
      try {
        const value = newValue;

        await apiurl.put(`/notification-status-admin`, {
          userId,
          isValue: value,
        });
      } catch (err) {
        console.error("Error subscribing to email:", err);
        // Handle error
      }
    }
  };

  useEffect(() => {
    subscribeAdminNotification(isAdminThere);
  }, [isAdminThere]);

  useEffect(() => {
    subscribeNotification(isThere);
  }, [isThere]);

  //encrypted string
  useEffect(() => {
    stringForRoute();
  }, [authToken]);

  useEffect(() => {
    socket.on(`DELETE_TOKEN_FOR_USER/${userId}`, (data) => {
      // console.log(data);
      localStorage.removeItem("authToken");
      navigate("/");
    });
  }, [socket, userId]);

  useEffect(() => {
    dispatch({ type: "SOCKET_CONNECT" });
    return () => {
      dispatch({ type: "SOCKET_DISCONNECT" });
    };
  }, [dispatch, userId]);
  useEffect(() => {
    socket.on(`INITIATE_CHAT_WITH_USER/${userId}`, (data) => {
      // console.log(data, "INITIATE_CHAT_WITH_USER");
      if (userId === data.notificationBy._id) {
        toast.info(`You can now chat with ${data.notificationTo.basicDetails}`);
      } else {
        toast.info(`You can now chat with ${data.notificationBy.basicDetails}`);
      }
      dispatch(setIsToggle(true));
    });
    return () => {
      socket.off(`INITIATE_CHAT_WITH_USER/${userId}`);
    };
  }, [socket, userId]);
  useEffect(() => {
    // Initialize Google Analytics
    initGA();
    // Log initial pageview
    logPageView();
  }, []);

  // const excludedRoutes = [
  //   "/",
  //   "/register-form",
  //   "/registration-form/:page",
  //   "/verify-email",
  //   "/consent-form",
  //   "/change-register-number/:token",
  //   "/form-submitted",
  //   "/link-verification",
  //   "/updated-registered-number",
  //   "/waiting",
  //   "/terms",
  //   "/privacy",
  //   "/banned",
  //   "/*", 
  // ];

    // useEffect(() => {
    //   // Initialize OneSignal
    //   const shouldInitializeOneSignal = !excludedRoutes.some((route) =>
    //     location.pathname.match(new RegExp(`^${route.replace(/:\w+/g, "\\w+")}$`))
    //   );

    //   if (!shouldInitializeOneSignal) {
    //     return;
    //   }
    //   OneSignal.init({
    //     appId: import.meta.env.VITE_APP_ONESIGNAL_APPID,
    //     safari_web_id: import.meta.env.VITE_APP_ONESIGNAL_SFARI_ID,
    //     notifyButton: {
    //       enable: false, 
    //     },
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

    //           await apiurl
    //             .put("/update-subscription-browser-id", {
    //               browserId: oneSignalUserId
    //             })
    //             .then((response) => {
    //               console.log("Subscription saved successfully:", response.data);
    //             })
    //             .catch((error) => {
    //               console.error("Error saving subscription:", error);
    //             });
    //         }
    //       } else {
    //         console.error("Push notifications are not supported");
    //       }
    //     })
    //     .catch((error) => {
    //       console.error("OneSignal initialization failed", error);
    //     });
    // }, [location.pathname]);


  //   OneSignal.init({
  //     appId: import.meta.env.VITE_APP_ONESIGNAL_APPID,
  //     safari_web_id: import.meta.env.VITE_APP_ONESIGNAL_SFARI_ID,
  //     notifyButton: {
  //       enable: false,  
  //     },
  //     allowLocalhostAsSecureOrigin: true,
  //     promptOptions: {
  //       slidedown: {
  //           enabled: true,
  //       }
  //   }

  //   })
  //     .then(() => {
  //       console.log("OneSignal initialized");
  //     })
  //     .catch((error) => {
  //       console.error("OneSignal initialization failed", error);
  //     });
  // }, [location.pathname]);
  useEffect(() => {
    const data = {
      token: token,
      userId: userId,
    };

  function postMessage() {
    window.Pay?.postMessage(JSON.stringify(data));
  }
  // console.log(token);
  postMessage();
}, [token]);
useEffect(() => {
  dispatch(storeRouteString());
}, [dispatch]);


  if (loading) {
    return;
  }
 
  return (
    <>
      <ToastContainer position="top-center" autoClose={5000} hideProgressBar />
      <div className="overflow-hidden">
        {accessType?.accessType === "2" ? (
          accessType?.isDeleted === true ||
          accessType?.registrationPhase === "notapproved" ||
          accessType?.registrationPhase === "rejected" ||
          accessType?.registrationPhase === "registering" ? (
            <DeletedUserRoutes />
          ) : (
            <UserRoutes routeString={routeString} />
          )
        ) : null}
        {accessType?.accessType === "1" && <SubadminRoutes />}
        {accessType?.accessType === "0" && <AdminRoutes />}
        {!accessType?.accessType && <DefaultRoutes />}
      </div>
    </>
  );
}

export default App;
