import { convertToFeetInches } from "../../common/common";
import { decryptDataString } from "../../common/commonFunction";
import apiurl from "../../util";
import { jwtDecode } from "jwt-decode";

export const getFormData = async (userId, page) => {
  if (!userId) {
    throw new Error("User ID is required.");
  }

  try {
    const response = await apiurl.get(`/user-data/${userId}?page=${page}`);
    const formData = response.data?.pageData;
    console.log({ formData });
    return formData;
  } catch (err) {
    console.error("Error fetching form data:", err);
    throw err; // Rethrow the error to handle it elsewhere if needed
  }
};

export const getUser = async (userId) => {
  try {
    const response = await apiurl.get(`/auth/get-user-data-view/${userId}`);
    const data = response.data;

    if (data.user.additionalDetails && data.user.additionalDetails.height) {
      data.user.additionalDetails.height = convertToFeetInches(
        data.user.additionalDetails.height
      );
    }

    if (data.user.partnerPreference && data.user.partnerPreference.length > 0) {
      const partnerPref = data.user.partnerPreference[0]; // fixed: it's an array

      if (partnerPref.heightRangeStart) {
        partnerPref.heightRangeStart = convertToFeetInches(
          partnerPref.heightRangeStart
        );
      }

      if (partnerPref.heightRangeEnd) {
        partnerPref.heightRangeEnd = convertToFeetInches(
          partnerPref.heightRangeEnd
        );
      }
    }

    console.log(data, "datacheck");
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const stringForRoute = async () => {
  try {
    const token = localStorage.getItem("authToken");
   const enString = localStorage.getItem('enString')
    let tokenExpired = false;

    if (token) {
      try {
        const decodedUserData = jwtDecode(token);
        const exp = decodedUserData.exp;
        const currentTime = Math.floor(Date.now() / 1000); // in seconds

        if (exp < currentTime) {
          tokenExpired = true;
        }
      } catch (err) {
        tokenExpired = true; // invalid token format
      }
    }

    const response = await apiurl.get('/user-verification');
    const data = response.data;

    if (!data || !data.encryptedData) {
      throw new Error(data?.message || 'Verification failed');
    }

    const secretKey = import.meta.env.VITE_APP_ENCRYPTED_KEY;
    const decryptedText = decryptDataString(data.encryptedData, secretKey);

    if (!decryptedText) throw new Error("Failed to decrypt data");

    let decryptedData;
    try {
      decryptedData = JSON.parse(decryptedText);
    } catch (err) {
      throw new Error("Invalid decrypted JSON format");
    }

    // console.log("expirecheck", tokenExpired);

    if (token && !tokenExpired) {
      const decodedUserData = jwtDecode(token);
      if (decryptedData._id !== decodedUserData.id) {
        throw new Error("User ID mismatch. Unauthorized access.");
      }
    }

    // Set in localStorage only if token is expired (not missing)
    if (tokenExpired || !enString) {
      localStorage.setItem("enString", data.encryptedData);
    }

    // console.log('Verification successful:', data);
    return data.encryptedData;

  } catch (error) {
    console.error('Error verifying user:', error.message);
    return null;
  }
};
