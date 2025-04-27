
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
      const heightInFeet = (data.user.additionalDetails.height / 12).toFixed(1); 
      data.user.additionalDetails.height = parseFloat(heightInFeet);
    }
    
    if (data.user.partnerPreference && data.user.partnerPreference.length > 0) {
      const partnerPref = data.user?.partnerPreference;
      console.log("partnerData", partnerPref)
      if (partnerPref.heightRangeStart) {
        const startFeet = (partnerPref.heightRangeStart / 12).toFixed(1);
        partnerPref.heightRangeStart = parseFloat(startFeet);
      }
      
      if (partnerPref.heightRangeEnd) {
        const endFeet = (partnerPref.heightRangeEnd / 12).toFixed(1);
        partnerPref.heightRangeEnd = parseFloat(endFeet);
      }
    }

    console.log(data, "datacheck");
    return data;
  } catch (err) {
    console.log(err);
  }
};
 