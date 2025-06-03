import { useSelector } from "react-redux";
import { userDataStore } from "../Stores/slices/AuthSlice";
import apiurl from "../util";
import CryptoJS from "crypto-js";

export const fetchData = async (endpoint, params = null) => {
  try {
    let response;
    if (params) {
      response = await apiurl.get(endpoint, { params });
    } else {
      response = await apiurl.get(endpoint);
    }
    return response.data;
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error);
    return [];
  }
};
export const getMasterData = async (type) => {
  try {
    const response = await apiurl.get(`/getMasterData/${type}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${type}:`, error);
    return null;
  }
};

// export const getMasterData = async (type) => {
//   return await fetchData(`/getMasterData/${type}`);
// };

export const getCountries = async () => {
  return await fetchData("/countries");
};

export const getStateById = async (stateId) => {
  try {
    const response = await apiurl.get(`/state?state=${stateId}`)

    return response.data;
  } catch (error) {
    console.error('Error fetching state:', error);
    throw error;
  }
};


export const getStatesByCountry = async (selectedCountry) => {
  return await fetchData(`/states`, { country: selectedCountry });
};

export const getCitiesByState = async (selectedCountry, selectedState) => {
  return await fetchData(`/cities`, {
    country: selectedCountry,
    state: selectedState,
  });
};

export const getCountryStateCityName = async (type, id) => {
  if (type && id) {
    try {
      let response = await apiurl.get(`/country-state-city?type=${type}&id=${id}`);
      return response?.data[0];
    } catch (error) {
      console.error(`Error fetching data from ${endpoint}:`, error);
      return [];
    }
  }
};


export const getLabel = () => {
  const {userData} = useSelector(userDataStore);
  const {userDataAddedByAdmin, admin} = useSelector((state)=> state.admin)
  if (!userData || !userData.createdBy || !userData.createdBy[0]) {
    return "NA";
  }
  const createdForCheck = admin === "adminAction" ? userDataAddedByAdmin?.createdBy?.[0]?.createdFor : userData.createdBy[0].createdFor;
  const genderCheck = admin === "adminAction" ? userDataAddedByAdmin?.gender : userData.gender ;
  console.log(userDataAddedByAdmin?.gender,userData.createdBy[0].createdFor, "check")
  switch (createdForCheck) {
    case "myself":
      return "My";
    case "myson":
    case "mybrother":
      return "His";
    case "mysister":
    case "mydaughter":
      return "Her";
    case "myrelative":
      return genderCheck === "M" ? "His" : "Her";
    case "myfriend":
      return genderCheck === "M" ? "His" : "Her";
    default:
      return "NA";
  }
};

export const getModifieldLabelforInput = () => {
  const {userData} = useSelector(userDataStore);
  if (!userData || !userData.createdBy || !userData.createdBy[0]) {
    return "NA";
  }

  const createdForCheck = userData.createdBy[0].createdFor;
  const genderCheck = userData.gender;

  switch (createdForCheck) {
    case "myself":
      return "I live with my family";
    case "myson":
    case "mybrother":
      return "He lives with his family";
    case "mysister":
    case "mydaughter":
      return "She lives with her family";
    case "myrelative":
      return genderCheck === "M" ? "He lives with his family" : "She lives with her family ";
    case "myfriend":
      return genderCheck === "M" ? "He lives with his family" : "She lives with her family";
    default:
      return "NA";
  }
};


const secretKey = "Connecting_Soulmate_Server"

export const encrypt = (text) => {
  return CryptoJS.AES.encrypt(text, secretKey).toString();
};

// Decryption function
export const decrypt = (ciphertext) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};

export const getUserLogoInBase64 = async (userId) => {
  try {
    const response = await apiurl.get(`/userLogo-base64/pdf/${userId}`);
 
    const {base64Image} = await response.data;
    return base64Image;
  } catch (error) {
    console.error('Error fetching user logo:', error);
    throw error;
  }
};


export const getUserImagesInBase64 = async (imageUrls) => {
  
  if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
    throw new Error("No image URLs provided.");
  }


  const response = await apiurl.post('/change-image-to-base-url',{imgUrls: imageUrls})
return response.data
};


export const fetchImageAsBuffer = async (imageUrl) => {
  try {
    // Step 1: Fetch the image data from the S3 URL with axios
    const response = await apiurl.post("/change-image-to-file",{url : imageUrl}, {
      responseType: 'arraybuffer', // Important: Ensure that the response is treated as an array buffer
    });
    console.log('Received file buffer:', response.data);

    // Convert the ArrayBuffer to a Blob
    const blob = new Blob([response.data], { type: response.headers['content-type'] });

    // Convert the Blob to a File
    const file = new File([blob], { type: response.headers['content-type'] });
    
    return URL.createObjectURL(file);
  } catch (error) {
    console.error("Error fetching image as buffer:", error);
    throw error;
  }
}




export const decryptDataString = (encryptedString, base64Key) => {
  try {
    const [ivHex, encryptedHex] = encryptedString.split(":");

    if (!ivHex || !encryptedHex) {
      throw new Error("Invalid encrypted data format");
    }

    // Decode base64 to match Buffer.from(base64, 'base64') in Node.js
    const key = CryptoJS.enc.Base64.parse(base64Key);
    const iv = CryptoJS.enc.Hex.parse(ivHex);
    const encrypted = CryptoJS.enc.Hex.parse(encryptedHex);

    const decrypted = CryptoJS.AES.decrypt(
      { ciphertext: encrypted },
      key,
      {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    );

    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (err) {
    console.error("Decryption error:", err.message);
    return null;
  }
};
