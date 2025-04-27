// import React, { useState, useMemo } from "react";
// import { useSelector } from "react-redux";
// import { userDataStore } from "../../../Stores/slices/AuthSlice";
// import BlockPop from "../../PopUps/BlockPop";
// import UnblockProfilePop from "../../PopUps/UnblockProfilePop";
// import apiurl from "../../../util";
// import { toast } from "react-toastify";

// const BlockCard = ({ item, key, type, setIsBlocked }) => {
//   const { userId } = useSelector(userDataStore);
//   const [isUnblockOpen, setIsUnblockOpen] = useState(false);
//   const [isOpenPop, setIsOpenPop] = useState(false);
//   const [showProf, setShowProf] = useState(false);
//   const [showCommunity, setShowCommunity] = useState(false);

//   const handleMouseEnterComm = () => setShowCommunity(true);
//   const handleMouseLeaveComm = () => setShowCommunity(false);
//   const openUnblockPopup = () => setIsUnblockOpen(true);
//   const closeUnblock = () => setIsUnblockOpen(false);
//   const handleMouseEnterProf = () => setShowProf(true);
//   const handleMouseLeaveProf = () => setShowProf(false);
//   const closeblockPop = () => setIsOpenPop(false);

//   const unblockUser = async (blockedUserId) => {

//     if (userId) {
//       try {
//         const response = await apiurl.put(`/unblock-user`, {
//           blockedBy: userId,
//           blockedUserId: blockedUserId,
//         });
//         toast.success("User Unblocked Successfully");

//         setIsBlocked(true);
//       } catch (error) {
//         console.error("Error unblocking user:", error);
//       }
//     }
//   };

//   const blockUser = async () => {
//     try {
//       if (userId) {
//         const response = await apiurl.post("/block-user", {
//           blockBy: userId,
//           blockUserId: item?._id,
//         });
//         console.log(response,"res");

//         toast.success(response.data.message);
//         setIsBlocked(true);
//       } else {
//         console.error("Error: userId is not present");
//       }
//     } catch (error) {
//       toast.error(error.data.message);
//       console.error("Error blocking user:", error);
//     }
//   };

//   const dateOfBirth = item?.basicDetails[0]?.dateOfBirth;
//   const formattedDateOfBirth = useMemo(() => {
//     if (!dateOfBirth) return "NA";
//     const [year, month, day] = dateOfBirth.split("-");
//     return `${day}-${month}-${year}`;
//   }, [dateOfBirth]);

//   const maritalStatusMapping = {
//     single: "Single",
//     awaitingdivorce: "Awaiting Divorce",
//     divorcee: "Divorcee",
//     widoworwidower: "Widow or Widower",
//   };

//   const transformedMaritalStatus = useMemo(() => {
//     return maritalStatusMapping[item?.additionalDetails[0]?.maritalStatus] || "NA";
//   }, [item?.additionalDetails]);

//   const formattedTime = useMemo(() => {
//     const timeOfBirth = item?.basicDetails[0]?.timeOfBirth?.slice(0, 5) || "NA";
//     if (timeOfBirth === "NA") return "NA";

//     const [time, period] = timeOfBirth.split(" ");
//     const [hours, minutes] = time.split(":");

//     let hour = parseInt(hours, 10);
//     const minute = parseInt(minutes, 10);

//     if (period === "PM" && hour !== 12) hour += 12;
//     else if (period === "AM" && hour === 12) hour = 0;

//     const formattedHour = hour % 12 || 12;
//     const formattedMinutes = minute < 10 ? `0${minute}` : minute;

//     return `${formattedHour}:${formattedMinutes} ${period}`;
//   }, [item?.basicDetails]);

//   return (
//     <>
//       {isOpenPop && (
//         <span className="absolute">
//           <BlockPop
//             cardId={item?._id}
//             blockUser={blockUser}
//             closeblockPop={closeblockPop}
//           />
//         </span>
//       )}
//       <UnblockProfilePop
//         unblockUser={unblockUser}
//         id={item?._id}
//         isUnblockOpen={isUnblockOpen}
//         closeUnblock={closeUnblock}
//       />
//       <div className="grid gid-cols-2 items-center justify-center mt-9 md:mt-5 sm:mt-0 sm:pr-6 mx-6 sm:mx-0 sm:ml-9">
//         <div className="shadow flex md:flex-row flex-col sm:flex-row md:w-[37rem] justify-start md:py-2 sm:py-2 items-center px-3 rounded-2xl sm:w-[28rem] w-full mb-6">
//           <span>
//             <img
//               src={item?.selfDetails[0]?.profilePictureUrl}
//               alt=""
//               onError={(e) => (e.target.src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMo88hNln0LTch7KlXro5JEeSFWUJqBVAxgEtagyZq9g&s")}
//               loading="lazy"
//               className="md:w-60 md:h-64 sm:w-44 sm:h-44 w-44 h-44 md:rounded-lg sm:rounded-lg rounded-full mt-[12%] md:mt-0 sm:mt-0"
//             />
//           </span>
//           <span>
//             <p className="px-9 mt-3 capitalize text-[16px] font-semibold md:text-start sm:text-start text-center">
//               {item?.basicDetails[0]?.name?.replace("undefined", "")}
//             </p>
//             <p className="cursor-pointer px-9 capitalize text-[16px] font-semibold md:text-start sm:text-start text-center">
//               {item?.additionalDetails[0]?.currentStateName || "NA"},{" "}
//               {item?.additionalDetails[0]?.currentCountryName || "NA"}
//             </p>
//             <p className="px-9 capitalize text-[16px] font-semibold md:text-start sm:text-start text-center">
//               ({item?.basicDetails[0]?.userId}){" "}
//             </p>
//             <div className="flex flex-col justify-center items-center">
//               <div className="flex justify-between items-center gap-9 md:w-full w-72 pl-6 pr-6 md:pr-0 sm:pr-0 text-[16px] mt-2 md:ml-7">
//                 <span className="font-regular text-start">
//                   <p>
//                     {item?.basicDetails[0]?.age || "NA"}yrs,{" "}
//                     {item?.additionalDetails[0]?.height + "ft" || "NA"}
//                   </p>
//                   <p>{formattedDateOfBirth}</p>
//                   <p>{transformedMaritalStatus}</p>
//                 </span>
//                 <span className="font-regular text-start">
//                   <p
//                     onMouseEnter={handleMouseEnterComm}
//                     onMouseLeave={handleMouseLeaveComm}
//                     className="cursor-pointer"
//                   >
//                     {item?.familyDetails[0]?.communityName?.slice(0, 12) || "NA"}..
//                   </p>
//                   {showCommunity && (
//                     <div className="text-start absolute w-auto p-1 bg-white border rounded-lg">
//                       <p>{item?.familyDetails[0]?.communityName || "NA"}</p>
//                     </div>
//                   )}
//                   <p>{formattedTime}</p>
//                   <p
//                     onMouseEnter={handleMouseEnterProf}
//                     onMouseLeave={handleMouseLeaveProf}
//                     className="cursor-pointer"
//                   >
//                     {item?.careerDetails[0]?.professionName?.slice(0, 9) || "NA"}..
//                   </p>
//                   {showProf && (
//                     <div className="text-start absolute w-auto p-1 bg-white border rounded-lg">
//                       <p>{item?.careerDetails[0]?.professionName || "NA"}</p>
//                     </div>
//                   )}
//                 </span>
//               </div>
//               <span className="flex justify-between items-center gap-9 md:w-full pl-6 pr-6 md:pr-0 sm:pr-0 text-[16px] mt-2 md:ml-7 md:mb-0 sm:mb-0 mb-6">
//                 {type === "blockedUsers" && (
//                   <span className="font-light">
                    
//                       <span
//                         onClick={openUnblockPopup}
//                         className="border text-primary cursor-pointer border-primary rounded-lg px-8 py-[3px] mt-2 flex items-center"
//                       >
//                         Unblock
//                       </span>
                    
//                   </span>
//                 )}
//               </span>
//             </div>
//           </span>
//         </div>
//       </div>
//     </>
//   );
// };

// export default BlockCard;
