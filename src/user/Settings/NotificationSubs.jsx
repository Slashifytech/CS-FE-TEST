import React, { useEffect, useState } from 'react';
import SideBar from '../Dashboard/SideBar';
import { BackArrow } from '../../components/DataNotFound';
import Header from "../../components/Header";
import apiurl from '../../util';
import OneSignal from 'react-onesignal';
import { FaRegBell, FaRegBellSlash } from 'react-icons/fa';

const NotificationSubs = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);  
  const [loading, setLoading] = useState(true); 

  // Check subscription status
  useEffect(() => {
    const checkSubscriptionStatus = async () => {
      try {
        // Check if the user is opted-in for push notifications
        const isOptedIn = OneSignal.User.PushSubscription.optedIn;
        setIsSubscribed(isOptedIn); // Update the subscription status
      } catch (error) {
        console.error('Error checking subscription status:', error);
      } finally {
        setLoading(false); // Stop loading once check is complete
      }
    };

    checkSubscriptionStatus();
  }, []);

  // Function to subscribe to notifications (without showing OneSignal prompt)
  const subscribeToNotifications = async () => {
    try {
      await OneSignal.User.PushSubscription.optIn();  // Automatically opt-in the user
      const isOptedIn = OneSignal.User.PushSubscription.optedIn; // Check if the user is opted-in

      if (isOptedIn) {
        // Get OneSignal Player ID (user subscription ID)
        const oneSignalUserId = await OneSignal.User.PushSubscription.id;

        // Make an API call to store the subscription in your backend
        if (oneSignalUserId) {
          await apiurl
            .put('/update-subscription-browser-id', { browserId: oneSignalUserId })
            .then((response) => {
              console.log('Subscription saved successfully:', response.data);
              setIsSubscribed(true); // Update subscription status to true
            })
            .catch((error) => {
              console.error('Error saving subscription:', error);
            });
        }
      }
    } catch (error) {
      console.error('Subscription failed:', error);
    }
  };

  // Function to unsubscribe
  const unsubscribeFromNotifications = async () => {
    try {
      await OneSignal.User.PushSubscription.optOut(); // Unsubscribe the user from push notifications
      setIsSubscribed(false); // Update the subscription status
    } catch (error) {
      console.error('Failed to unsubscribe:', error);
    }
  };

  // Toggle subscription
  const toggleSubscription = () => {
    if (isSubscribed) {
      unsubscribeFromNotifications();
    } else {
      subscribeToNotifications();
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading state while checking subscription status
  }

  return (
    <>
      <Header />
      <div className="md:block hidden sm:block">
        <SideBar />
      </div>
      <BackArrow className="sm:hidden md:hidden block" />
      <div className="shadow md:px-9 py-3 px-6 mb-36 md:mb-5 md:mx-28 my-5 rounded-md md:ml-96 sm:ml-72 sm:mt-36 sm:mb-9 md:mt-40 mt-7 mx-6">
        <span>
          <p className="font-semibold font-montserrat mt-5 text-[22px]">Notification Settings</p>
          <p className="pt-3">
            Push Notifications <span className="text-primary">(You will get all notifications).</span>
          </p>
          <div className=" mt-3 mb-3">

            <button onClick={toggleSubscription} className="px-4 py-2 bg-primary text-white rounded-md ">
              {isSubscribed ? <span className='flex items-center gap-3'><span><FaRegBellSlash /></span><span>Unsubscribe</span></span> : <span className='flex items-center gap-3'><span><FaRegBell /></span><span>Subscribe</span></span>}
            </button>
            
          </div>
        </span>
      </div>
    </>
  );
};

export default NotificationSubs;
