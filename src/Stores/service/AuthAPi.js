import apiurl from "../../util";

export const VerifyOtp = async (email, otp) => {
  try {
    const response = await apiurl.post(`/auth/signup-login/verify-otp`,{
         email: email,
         otp: otp
    });
    return response;
  } catch (err) {
    console.error("Something went wrong:", err);
    throw err;
  }
};

export const VerifyEmailSignup = async (email) => {
  try {
    const response = await apiurl.post(`/auth/signup/request-otp`,{
        email: email,
        
      });
    return response;
      } catch (err) {
    console.error("Something went wrong:", err);
    throw err;
  }
};
export const VerifyEmailLogin = async (email) => {
  try {
    const response = await apiurl.post(`/auth/login/request-otp`, {
         email: email,
    });
    return response;
  } catch (err) {
    console.error("Something went wrong:", err);
    throw err;
  }
};
