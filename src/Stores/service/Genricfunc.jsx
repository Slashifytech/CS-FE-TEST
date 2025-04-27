
import { convertToFeetInches } from "../../common/common";
import apiurl from "../../util";


export const getFormData = async (userId, page) =>
{
  if (!userId)
  {
    throw new Error("User ID is required.");
  }

  try
  {
    const response = await apiurl.get(`/user-data/${ userId }?page=${ page }`);
    const formData = response.data?.pageData;
    console.log({ formData })
    return formData;
  } catch (err)
  {
    console.error("Error fetching form data:", err);
    throw err; // Rethrow the error to handle it elsewhere if needed
  }
};

export const getUser = async (userId) => {
  try {
    const response = await apiurl.get(`/auth/get-user-data-view/${userId}`);
    const data = response.data;
    
    if (data.user.additionalDetails && data.user.additionalDetails.height) {
         data.user.additionalDetails.height = convertToFeetInches(data.user.additionalDetails.height);
       }
       
       if (data.user.partnerPreference && data.user.partnerPreference.length > 0) {
         const partnerPref = data.user.partnerPreference[0]; // fixed: it's an array
       
         if (partnerPref.heightRangeStart) {
           partnerPref.heightRangeStart = convertToFeetInches(partnerPref.heightRangeStart);
         }
       
         if (partnerPref.heightRangeEnd) {
           partnerPref.heightRangeEnd = convertToFeetInches(partnerPref.heightRangeEnd);
         }
       }
   

    console.log(data, "datacheck");
    return data;
  } catch (err) {
    console.log(err);
  }
};
 