import React, { useEffect, useState, useCallback } from "react";
import io from "socket.io-client";
import { userDataStore } from "../../Stores/slices/AuthSlice";
import {
  notificationStore,
  isNotification,
  isNotNotification,
} from "../../Stores/slices/notificationslice";
import { useSelector, useDispatch } from "react-redux";
import apiurl from "../../util";
import { Link } from "react-router-dom";
import { BackArrow } from "../../components/DataNotFound";
import Header from "../../components/Header";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Loading from "../../components/Loading";
import { defaultImage } from "../../assets";


const NotificationLink = ({ notification, userId }) => {
 

  function getFirstAndLastName(fullName) {
    const nameParts = fullName?.split(' ');
    if (nameParts?.length > 2) {
      return `${nameParts[0]} ${nameParts[nameParts?.length - 1]}`;
    }
    return fullName;
  }
  const routeString = localStorage.getItem('enString')

  const getLink = () => {
    const baseRoute = {
      profilesent: "/inbox/profiles",
      profileaccepted: "/inbox/profiles",
      interestsent: "/inbox/interests",
      interestaccepted: "/inbox/interests",
    };

    let action;
    if (notification.notificationType === "profileaccepted" || notification.notificationType === "interestaccepted") {
      action = "accepted";
    } else {
      action = userId === notification.notificationBy._id ? "sent" : "recieved";
    }

    return `${baseRoute[notification.notificationType]}/${action}`;
  };

  function formatDate(isoString) {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }
  const renderNotificationText = (notification, userId) => {
    const sender = userId === notification?.notificationBy?._id
      ? "You"
      : getFirstAndLastName(notification?.notificationBy?.basicDetails);

    const receiver = userId === notification?.notificationTo?._id
      ? "You"
      : getFirstAndLastName(notification?.notificationTo?.basicDetails);

    let action = "";

    if (notification?.notificationBy?._id === userId) {
      switch (notification.notificationType) {
        case 'interestsent':
          action = `sent  interest request to ${receiver}`;
          break;
        case 'profilesent':
          action = `sent a profile request to ${receiver}`;
          break;
        case 'profileaccepted':
          action = `accepted ${receiver} profile request, view their profile`;
          break;
        case 'interestaccepted':
          action = `accepted ${receiver}'s  interest request. `;
          break;
        default:
          action = notification.notificationText?.split("/")[1];
          break;
      }
    } else if (notification?.notificationTo?._id === userId) {
      switch (notification?.notificationType) {
        case 'interestsent':
          action = `${sender} sent you an interest request. Accept to see their contact details & start chatting 
`;
          break;
        case 'profilesent':
          action = `${sender} sent you a profile request. Accept & view their full profile.`;
          break;
        case 'profileaccepted':
          action = `Your profile request to ${sender} has been accepted, view their full profile`;
          break;
        case 'interestaccepted':
          action = `Your interest request to ${sender} has been accepted. 
`;
          break;
        default:
          action = notification?.notificationText?.split("/")[1];
          break;
      }
    } else {
      action = notification?.notificationText?.split("/")[1];
    }

    return notification?.notificationTo?._id === userId
      ? `${action}  ${formatDate(notification.createdAt)}`
      : `${sender} ${action}  ${formatDate(notification.createdAt)}`;
  };
  const renderChatInitiatedText = (notification, userId) => {
    const sender = userId === notification?.notificationBy?._id
      ? "You"
      : getFirstAndLastName(notification?.notificationBy?.basicDetails);
  
    const receiver = userId === notification?.notificationTo?._id
      ? "You"
      : getFirstAndLastName(notification?.notificationTo?.basicDetails);
  
    let action = "";
  
    if (notification?.notificationBy?._id === userId) {
      switch (notification.notificationType) {
        case 'interestaccepted':
          action = `You can now initiate a chat with ${receiver}.`;
          break;
        default:
          action = notification.notificationText?.split("/")[1];
          break;
      }
    } else if (notification?.notificationTo?._id === userId) {
      switch (notification.notificationType) {
        case 'interestaccepted':
          action = `You can now start chatting with ${sender}. `;
          break;
        default:
          action = notification?.notificationText?.split("/")[1];
          break;
      }
    } else {
      action = notification?.notificationText?.split("/")[1];
    }
  
    return notification?.notificationTo?._id === userId
      ? `${action} ${formatDate(notification.createdAt)}`
      : `${action} ${formatDate(notification.createdAt)}`;
  };
  
  return (
    <>
        {(notification.notificationType === "interestaccepted") && (
        <Link to={'/chat'}>
          <span className="flex items-center  py-3 pt-6 w-full">
            <img
              src={
                notification?.notificationBy?._id === userId
                  ? notification?.notificationTo?.selfDetails
                      ?.profilePictureUrl || defaultImage
                  : notification?.notificationBy?.selfDetails
                      ?.profilePictureUrl || defaultImage
              }
              alt=""
              loading="lazy"
              onError={(e) => (e.target.src = defaultImage)}
              className="w-10 h-10 rounded-full border border-primary"
            />
            <p className={`font-DMsans text-[15px] text-black w-full pl-3`}>
              {renderChatInitiatedText(notification, userId)}
            </p>
          </span>
          <hr className="border border-[#e9e9e9]" />
        </Link>
      )}
      <Link to={getLink()}>
        <span className="flex items-center  py-3 pt-6 w-full">
          <img
            src={
              notification?.notificationBy?._id === userId
                ? notification?.notificationTo?.selfDetails?.profilePictureUrl || defaultImage
                : notification?.notificationBy?.selfDetails?.profilePictureUrl || defaultImage
            }
            alt=""
            loading="lazy"
            onError={(e) => (e.target.src = defaultImage)}
            className="w-10 h-10 rounded-full border border-primary"
          />
          <p className={`font-DMsans text-[15px] text-black w-full pl-3`}>
            {renderNotificationText(notification, userId)}
          </p>
        </span>
        <hr className="border border-[#e9e9e9]" />
      </Link>
    </>
  );
};

const NotificationReceiver = () => {
  const { userId } = useSelector(userDataStore);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [page, setPage] = useState(1);
  const [isFetching, setIsFetching] = useState(false);
  const routeString = localStorage.getItem('enString')

  const dispatch = useDispatch();
  dispatch(isNotNotification());

  const getNotifications = useCallback(async (page = 1) => {
    try {
      const response = await apiurl.get(`/user-notification-data/${userId}`, {
        params: { page, limit: 40 },
      });
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        ...response.data.notifications,
      ]);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    getNotifications(page);
  }, [page, getNotifications]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight ||
        isFetching
      )
        return;
      setIsFetching(true);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isFetching]);

  useEffect(() => {
    if (!isFetching) return;
    setPage((prevPage) => prevPage + 1);
  }, [isFetching]);

  useEffect(() => {
    if (!isFetching) return;
    setIsFetching(false);
  }, [notifications]);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_APP_DEV_BASE_URL);

    const handleNotification = (notification) => {
      dispatch(isNotification());
      setNotifications((prevNotifications) => [notification, ...prevNotifications]);
    };

    socket.on(`NOTIFICATION/${userId}`, handleNotification);

    return () => {
      socket.off(`NOTIFICATION/${userId}`, handleNotification);
      dispatch(isNotNotification());
      socket.disconnect();
    };
  }, [userId]);

  return (
    <>
      <Header />
      <BackArrow
        LinkData={`/user-dashboard/${routeString}`}
        className="absolute md:ml-24 md:mt-28 sm:mt-28 w-full md:w-52 overflow-hidden"
      />
      <div className="shadow md:px-9 py-3 pb-20 px-6 mb-36 md:mb-16 md:mx-60 my-5 rounded-lg sm:mt-48 sm:mb-9 md:mt-44 mt-32 mx-6">
        <h2 className="text-primary font-semibold font-montserrat py-7 text-[22px]">
          Notifications
        </h2>
        {loading  ? (
          <>
            <div className="mx-3 mt-9">
              <Skeleton height={50} />
            </div>
            <div className="mx-3 mt-9">
              <Skeleton height={50} />
            </div>
            <div className="mx-3 mt-9">
              <Skeleton height={50} />
            </div>
            <div className="mx-3 mt-9">
              <Skeleton height={50} />
            </div>
            <div className="mx-3 mt-9">
              <Skeleton height={50} />
            </div>
            <div className="mx-52 mt-20">
              <Loading customText={"loading"} />
            </div>
          </>
        ) : (
          <div className="flex flex-col">
            {notifications?.map((notification, index) => (
              <NotificationLink
                notification={notification}
                userId={userId}
                index={index}
                key={notification._id}
              />
            ))}
          </div>
        )}
       
      </div>
    </>
  );
};

export default NotificationReceiver;
