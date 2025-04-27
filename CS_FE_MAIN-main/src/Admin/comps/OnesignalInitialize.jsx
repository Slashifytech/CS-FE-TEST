import { useEffect } from "react";
import OneSignal from "react-onesignal"; 
import apiurl from "../../util";

const useOneSignal = (userId) => {
  const initOneSignal = async () => {
    try {
      console.log("Initializing OneSignal...");

      // Initialize OneSignal
      await OneSignal.init({
        appId: import.meta.env.VITE_APP_ONESIGNAL_APPID,
        safari_web_id: import.meta.env.VITE_APP_ONESIGNAL_SFARI_ID,
        notifyButton: { enable: false },
        allowLocalhostAsSecureOrigin: true,
        promptOptions: { slidedown: { enabled: false } },
      });

      console.log("OneSignal initialized");

      // Get OneSignal Player ID (user subscription ID)
      const oneSignalUserId = await OneSignal.User.PushSubscription.id;
      console.log("OneSignal Player ID:", oneSignalUserId);

      if (oneSignalUserId) {
        await apiurl
          .put("/update-subscription-browser-id", {
            userId,
            browserId: oneSignalUserId,
          })
          .then((response) => {
            console.log("Subscription saved successfully:", response.data);
          })
          .catch((error) => {
            console.error("Error saving subscription:", error);
          });
      }
    } catch (error) {
      console.error("OneSignal initialization failed:", error);
    }
  };

  useEffect(() => {
    if (userId) {
      initOneSignal();
    }
  }, [userId]);
};

export default useOneSignal;