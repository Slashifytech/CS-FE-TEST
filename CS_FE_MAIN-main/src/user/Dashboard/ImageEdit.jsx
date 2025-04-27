// import { useEffect, useState } from "react";
// import { RiDeleteBin6Line } from "react-icons/ri";
// import { FaFileUpload, FaUser } from "react-icons/fa";
// import Header from "../../components/Header";
// import { BackArrow } from "../../components/DataNotFound";
// import { useDispatch, useSelector } from "react-redux";
// import { setUser, userDataStore } from "../../Stores/slices/AuthSlice";
// import { getFormData } from "../../Stores/service/Genricfunc";
// import { FaRegCircleUser } from "react-icons/fa6";
// import apiurl from "../../util";
// import { Link, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import Skeleton from "react-loading-skeleton";
// import "react-loading-skeleton/dist/skeleton.css";

// const ImageEdit = () => {
//   const { userData, userId } = useSelector(userDataStore);

//   const [editImage, setEditImage] = useState({
//     userPhotos: [],
//     userPhotosKeys: [],
//     profilePicture: "",
//     profilePictureIndex: -1,
//     profilePictureKey: "",
//     showUrlProfile: false,
//     activeImageIndex: -1,
//   });
//   const [latestImages, setLatestImages] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const [formErrors, setFormErrors] = useState({
//     userPhotos: "",
//     profilePictureIndex: "",
//     profilePictureKey: "",
//   });
//   const validateForm = () => {
//     const errors = {};
//     let hasErrors = false;

//     // Check if at least one image is uploaded
//     if (latestImages.length === 0 && editImage.userPhotos.length === 0) {
//       errors.userPhotos = "At least one image is required";
//       hasErrors = true;
//       toast.error("At least one image is required");
//     } else if (
//       editImage.profilePictureIndex == -1 ) {
//       errors.profilePictureIndex = "Profile Picture is required";
//       hasErrors = true;
//       toast.error("Profile Picture is required");
//     }

//     setFormErrors(errors);
//     return !hasErrors;
//   };

//   const handleAddUserImage = async () => {
//     setLoading(true);

//     if (!validateForm()) {
//       setLoading(false);
//       return;
//     }

//     const formData = new FormData();
//     latestImages.forEach((photo) => {
//       formData.append("userPhotos", photo);
//     });
//     formData.append("userPhotosKeys", editImage.userPhotosKeys);
//     if (editImage.profilePictureIndex !== "") {
//       formData.append("profilePictureIndex", editImage.profilePictureIndex);
//     } else if (editImage.profilePictureKey !== "") {
//       formData.append("profilePictureKey", editImage.profilePictureKey);
//     }

//     try {
//       setLoading(true);
//       const response = await apiurl.put(
//         `/user-image-upload/${userId}`,
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );
//       toast.success("Image updated successfully");

//       navigate("/user-dashboard");
//       const responses = await apiurl.get(`/auth/getUser/${userId}`);
//       const userData = responses?.data?.user;

//       dispatch(setUser({ userId, userData }));
//     } catch (err) {
//       console.log(err);
//       toast.error("Something went wrong");
//       setLoading(false);
//     } finally {
//       setLoading(false); // Set loading state to false
//     }
//   };

//   const handleDeleteUserImage = async (key, index) => {
//     try {
//       // Delete the image from the server
//       const response = await apiurl.put(`/user-image-delete/${userId}`, {
//         imageKey: key,
//       });

//       // Only update local state if the server deletion was successful
//       if (response.status === 200) {
//         handleDeleteImage(index, "editImage");
//       }
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const FetchData = async () => {
//     try {
//       const formData = await getFormData(userId, 5);
//       const userPhotosUrl = formData.selfDetails.userPhotosUrl;
//       const profilePictureUrl = formData.selfDetails.profilePictureUrl;

//       const profilePictureIndexInUserPhotos = userPhotosUrl.findIndex(
//         (url) => url === profilePictureUrl
//       );

//       // Determine the initial profile picture state
//       let profilePicture = profilePictureUrl;
//       let profilePictureKey = formData.selfDetails.profilePicture;
//       let profilePictureIndex = profilePictureIndexInUserPhotos;
//       let showUrlProfile = profilePictureIndexInUserPhotos === -1;

//       // If the profile picture is not found in userPhotos, check latestImages
//       if (profilePictureIndexInUserPhotos === -1) {
//         const profilePictureIndexInLatestImages = latestImages.findIndex(
//           (image) => URL.createObjectURL(image) === profilePictureUrl
//         );
//         if (profilePictureIndexInLatestImages !== -1) {
//           profilePictureIndex = profilePictureIndexInLatestImages;
//           showUrlProfile = false; // Profile picture from latest images
//         }
//       }

//       setEditImage({
//         userPhotos: userPhotosUrl,
//         userPhotosKeys: formData.selfDetails.userPhotos,
//         profilePicture: profilePicture,
//         profilePictureIndex: profilePictureIndex,
//         profilePictureKey: profilePictureKey,
//         showUrlProfile: showUrlProfile,
//         activeImageIndex: profilePictureIndex,
//       });

//       console.log(formData);
//     } catch (err) {
//       console.log(err);
//       setIsLoading(false); // Ensure loading state is set to false on error
//     }
//   };

//   const handleInput = (e) => {
//     const { name, value } = e.target;
//     const selectedFiles = e.target.files;

//     if (name === "userPhotos") {
//       const currentTotalImagesCount =
//         latestImages.length + editImage.userPhotos.length;

//       // Check if adding the new images will exceed the limit of 5
//       if (currentTotalImagesCount + selectedFiles.length > 5) {
//         toast.error("You cannot upload more than 5 images.");
//         return;
//       }

//       const newImages = [];
//       let invalidFile = false;

//       for (let i = 0; i < selectedFiles.length; i++) {
//         const file = selectedFiles[i];

//         if (file.size > 15 * 1024 * 1024) {
//           // Check if the file size exceeds 15MB
//           toast.error(`File ${file.name} exceeds the 15MB size limit.`);
//           invalidFile = true;
//           continue;
//         }

//         newImages.push(file);
//       }

//       if (newImages.length === 0 && invalidFile) {
//         toast.error("Please select at least one valid image.");
//       } else if (newImages.length > 0) {
//         setLatestImages((prev) => {
//           const combinedImages = [...prev, ...newImages];
//           if (combinedImages.length > 5) {
//             toast.error("You cannot upload more than 5 images.");
//             return prev;
//           }
//           return combinedImages;
//         });
//       }
//     } else {
//       // Handle other input fields
//       setEditImage((prevForm) => ({
//         ...prevForm,
//         [name]: value,
//       }));
//     }
//   };

//   const handleDeleteImage = (index, arrayType) => {
//     const updateState = (updatedImages, updatedImagesKeys, isLatestImages) => {
//       setEditImage((prev) => {
//         const isDeletedImageProfilePicture = prev.profilePictureIndex === index;
//         let newProfilePicture = prev.profilePicture;
//         let newProfilePictureIndex = prev.profilePictureIndex;
//         let newProfilePictureKey = prev.profilePictureKey;

//         if (isDeletedImageProfilePicture) {
//           if (updatedImages.length > 0) {
//             newProfilePicture = isLatestImages
//               ? updatedImages[0].name
//               : updatedImages[0];
//             newProfilePictureIndex = 0;
//             newProfilePictureKey = isLatestImages ? "" : updatedImagesKeys[0];
//           } else {
//             newProfilePicture = "";
//             newProfilePictureIndex = -1;
//             newProfilePictureKey = "";
//           }
//         } else if (prev.profilePictureIndex > index) {
//           newProfilePictureIndex = prev.profilePictureIndex - 1;
//         }

//         return {
//           ...prev,
//           userPhotos: updatedImages,
//           userPhotosKeys: updatedImagesKeys,
//           profilePicture: newProfilePicture,
//           profilePictureIndex: newProfilePictureIndex,
//           activeImageIndex: newProfilePictureIndex,
//           profilePictureKey: newProfilePictureKey,
//         };
//       });
//     };

//     if (arrayType === "latestImages") {
//       const updatedImages = latestImages.filter((_, ind) => ind !== index);
//       setLatestImages(updatedImages);
//       setEditImage((prev) => {
//         const newProfilePictureIndex =
//           prev.profilePictureIndex == index + editImage.userPhotos?.length
//             ? 0
//             : prev.profilePictureIndex > index + editImage.userPhotos?.length
//             ? prev.profilePictureIndex - 1
//             : prev.profilePictureIndex;

//         return {
//           ...prev,
//           profilePictureIndex: newProfilePictureIndex,
//           activeImageIndex: newProfilePictureIndex,
//         };
//       });
//     } else {
//       const updatedImages = editImage.userPhotos.filter(
//         (_, ind) => ind !== index
//       );
//       const updatedImagesKeys = editImage.userPhotosKeys.filter(
//         (_, ind) => ind !== index
//       );
//       updateState(updatedImages, updatedImagesKeys, false);
//     }
//   };

//   const handleChooseProfileImage = (index, arrayType) => {
//     const isLatestImages = arrayType === "latestImages";
//     const newProfilePicture = isLatestImages
//       ? latestImages[index]
//       : editImage.userPhotos[index];
//     const newProfilePictureKey = isLatestImages
//       ? ""
//       : editImage.userPhotosKeys[index];
//     const adjustedIndex = isLatestImages
//       ? editImage.userPhotos.length + index
//       : index;

//     setEditImage((prev) => ({
//       ...prev,
//       profilePicture: newProfilePicture,
//       profilePictureKey: newProfilePictureKey,
//       profilePictureIndex: adjustedIndex,
//       activeImageIndex: adjustedIndex,
//       showUrlProfile: !isLatestImages,
//     }));
//   };

//   useEffect(() => {
//     FetchData();
//   }, [userId]);

//   return (
//     <>
//       <Header />

//       {isLoading ? (
//         <div className="md:mx-52 mx-6 mt-36">
//           <Skeleton height={600} />
//         </div>
//       ) : (
//         <>
//           <BackArrow className="absolute md:ml-24 md:mt-32 sm:mt-28 md:w-52 w-full" />
//           <div className="shadow rounded-xl md:mx-52 mx-6 py-12 my-5 font-DMsans md:mt-40 sm:mt-48 mt-36 mb-36 ">
//             <div className="md:px-16 px-6">
//               <div className="font-semibold mb-9 text-primary">My photos</div>
//               <div className="flex flex-col">
//                 <span className="">
//                   <label
//                     htmlFor="images"
//                     className="drop-container flex justify-start w-60 items-center border border-[#CC2E2E]"
//                     id="dropcontainer"
//                   >
//                     <span className="drop-title text-primary">
//                       Upload a Photo
//                     </span>
//                     <span className="flex items-center justify-center text-primary">
//                       <FaFileUpload size={50} />
//                     </span>
//                     <input
//                       type="file"
//                       id="images"
//                       accept=".jpeg,.jpg,.png"
//                       multiple
//                       name="userPhotos"
//                       onChange={(e) => handleInput(e)}
//                       required
//                     />
//                   </label>
//                 </span>
//                 <p className=" text-[13px] pt-2 text-primary">
//                   - Add minimum of 1 and maximum 5 HD quality photos (max 15MB
//                   each) <br />
//                   -Click on the profile icon to make it your profile picture
//                   <br />
//                   -Note: Your profile picture will be visible to everyone. Other
//                   images will be shown once you approve their requests.
//                 </p>
//               </div>
//               <hr className="mt-5 border border-[#e2e2e2]" />
//               <div className="flex mt-5 flex-wrap"></div>

//               <p className="mt-6">Your Photos</p>
//               <span className="flex flex-wrap items-center gap-6 mt-2">
//                 {editImage?.userPhotos?.map((selectedImage, index) => (
//                   <span key={index}>
//                     <img
//                       src={selectedImage}
//                       className={`md:w-[20vh] md:h-[20vh] w-36 h-36 rounded-xl ${
//                         editImage.activeImageIndex === index
//                           ? "border-2 border-primary p-1"
//                           : ""
//                       }`}
//                       alt={`Selected Image ${index + 1}`}
//                       loading="lazy"
//                     />
//                     <span className="flex mt-5 items-center justify-center gap-2">
//                       <div className="px-6 py-1 border cursor-pointer border-primary hover:bg-primary hover:text-white rounded-xl text-primary">
//                         <RiDeleteBin6Line
//                           onClick={() => {
//                             handleDeleteUserImage(
//                               editImage.userPhotosKeys[index],
//                               index
//                             );
//                           }}
//                           size={20}
//                         />
//                       </div>
//                       <button
//                         onClick={() =>
//                           handleChooseProfileImage(index, "editImage")
//                         }
//                         className={`px-6 py-1 border cursor-pointer text-[20px] border-primary hover:bg-primary hover:text-white rounded-xl text-primary ${
//                           editImage.activeImageIndex === index
//                             ? "bg-primary text-white"
//                             : ""
//                         }`}
//                       >
//                         <FaRegCircleUser />
//                       </button>
//                     </span>
//                   </span>
//                 ))}
//                 {latestImages.map((selectedImage, index) => (
//                   <span key={index}>
//                     <img
//                       src={URL.createObjectURL(selectedImage)}
//                       className={`w-[20vh] h-[20vh] rounded-xl border border-primary ${
//                         editImage.activeImageIndex ===
//                         index + editImage.userPhotos?.length
//                           ? "border-2 border-primary p-1"
//                           : ""
//                       }`}
//                       alt={`Selected Image ${index + 1}`}
//                       loading="lazy"
//                     />
//                     <span className="flex mt-5 gap-2 items-center justify-center">
//                       <div className="px-6 py-1 border cursor-pointer border-primary hover:bg-primary hover:text-white rounded-xl text-primary">
//                         <RiDeleteBin6Line
//                           onClick={() => {
//                             handleDeleteImage(index, "latestImages");
//                           }}
//                           size={20}
//                         />
//                       </div>
//                       <button
//                         onClick={() =>
//                           handleChooseProfileImage(index, "latestImages")
//                         }
//                         className={`px-6 py-1 border cursor-pointer text-[20px] border-primary hover:bg-primary hover:text-white rounded-xl text-primary ${
//                           editImage.activeImageIndex ===
//                           index + editImage.userPhotos?.length
//                             ? "bg-primary text-white"
//                             : ""
//                         }`}
//                       >
//                         <FaRegCircleUser />
//                       </button>
//                     </span>
//                   </span>
//                 ))}
//               </span>
//               <span className="flex justify-end items-center gap-5 mt-11">
//                 <Link to="/user-dashboard">
//                   <span className="border border-primary px-6 py-2 rounded-md text-primary cursor-pointer">
//                     Cancel
//                   </span>
//                 </Link>
//                 <span
//                   onClick={handleAddUserImage}
//                   className="px-6 py-2 rounded-md cursor-pointer bg-primary text-white"
//                 >
//                   {loading ? "Updating..." : "Update"}
//                 </span>
//               </span>
//             </div>
//           </div>
//         </>
//       )}
//     </>
//   );
// };

// export default ImageEdit;

import { useEffect, useState, useCallback } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaFileUpload } from "react-icons/fa";
import Header from "../../components/Header";
import { BackArrow } from "../../components/DataNotFound";
import { useDispatch, useSelector } from "react-redux";
import { setUser, userDataStore } from "../../Stores/slices/AuthSlice";
import { getFormData } from "../../Stores/service/Genricfunc";
import apiurl from "../../util";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import CropModal from "../../components/ImageCropper";

import UploadModal from "../Registration/UploadModal";
import { FaRegCircleUser } from "react-icons/fa6";
import { IoCropSharp } from "react-icons/io5";
import { fetchImageAsBuffer } from "../../common/commonFunction";

const ImageEdit = () => {
  const { userData, userId } = useSelector(userDataStore);
  const [editImage, setEditImage] = useState({
    keysToDelete: [],
    userPhotos: [],
    userPhotosKeys: [],
    profilePicture: "",
    profilePictureIndex: -1,
    profilePictureKey: "",
    showUrlProfile: false,
    activeImageIndex: -1,
  });

  const [latestImages, setLatestImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openCropModal, setCropModal] = useState(false);
  const [src, setSrc] = useState({
    srcImage: null,
    fromUrl: false,
  });
  const [croppedImageIndex, setCroppedImageIndex] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formErrors, setFormErrors] = useState({});

  // *********************Crop Image code*****************
  const createCroppedImage = async (imageSrc, croppedAreaPixels) => {
    try {
      const canvas = document.createElement("canvas");
      const image = new Image();
      image.src = imageSrc;

      await new Promise((resolve) => {
        image.onload = resolve;
      });

      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;
      const ctx = canvas.getContext("2d");

      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      const croppedImage = canvas.toDataURL("image/jpeg");
      return croppedImage;
    } catch (e) {
      console.error("Failed to create cropped image:", e);
    }
  };

  const onCropComplete = async (croppedArea, croppedAreaPixels) => {
    const croppedImage = await createCroppedImage(
      src.srcImage,
      croppedAreaPixels
    );
    if (croppedImageIndex !== null) {
      replaceOriginalWithCroppedImage(croppedImage);
    }
    setCropModal(false);
  };

  const replaceOriginalWithCroppedImage = (croppedImage) => {
    const file = base64ToFile(croppedImage, `cropped-image-${Date.now()}.jpg`);

    setEditImage((prev) => {
      return {
        ...prev,
        profilePicture:
          croppedImageIndex === prev.profilePictureIndex
            ? croppedImageIndex
            : prev.profilePicture,
      };
    });
    setLatestImages((prev) => {
      const updatedImages = [...prev];
      if (croppedImageIndex !== null) {
        src.fromUrl
          ? updatedImages.push(file)
          : (updatedImages[croppedImageIndex] = file);
      }
      return updatedImages;
    });
    if (src.fromUrl) {
      const updatedImagesUrl = [...editImage.userPhotos].filter(
        (image, ind) => ind !== croppedImageIndex
      );

      const updatedImages = [...editImage.userPhotosKeys].filter(
        (image, ind) => ind !== croppedImageIndex
      );
      // Get the image(s) that need to be deleted
      const imagesToDelete = [...editImage.userPhotosKeys].filter(
        (image, ind) => ind === croppedImageIndex
      );

      setEditImage((prev) => {
        // Determine the new profilePictureIndex
        let newProfilePictureIndex = prev.profilePictureIndex;

        if (prev.profilePictureIndex === croppedImageIndex) {
          // If the profile picture is being deleted, set it to the first available image
          newProfilePictureIndex = updatedImages.length > 0 ? 0 : null;
        } else if (prev.profilePictureIndex > croppedImageIndex) {
          // Adjust profilePictureIndex if it was greater than the deleted index
          newProfilePictureIndex = prev.profilePictureIndex - 1;
        }

        return {
          ...prev,
          userPhotos: updatedImagesUrl,
          userPhotosKeys: updatedImages,
          profilePictureIndex: newProfilePictureIndex,
          activeImageIndex: newProfilePictureIndex,

          keysToDelete: [...(prev.keysToDelete || []), ...imagesToDelete],
        };
      });
    }
  };

  const handleCropProfileImage = async (imageSrc, index, value) => {
    let file = imageSrc;
    if (value === "urls") {
      file = await fetchImageAsBuffer(imageSrc);
      console.log(file, index, "file");

      setSrc({ srcImage: file, fromUrl: true });
    } else {
      setSrc({ srcImage: file, fromUrl: false });
    }
    setCroppedImageIndex(index);
    setCropModal(true);
  };

  const base64ToFile = (base64, filename) => {
    const arr = base64.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  };
  // *********************Crop Image code end*****************

  // *********************Image Validation*****************

  const validateForm = () => {
    const errors = {};
    let hasErrors = false;
    if (latestImages.length === 0 && editImage.userPhotos.length === 0) {
      errors.userPhotos = "At least one image is required";
      hasErrors = true;
      toast.error("At least one image is required");
    } else if (editImage.profilePictureIndex === -1) {
      errors.profilePictureIndex = "Profile Picture is required";
      hasErrors = true;
      toast.error("Profile Picture is required");
    }

    setFormErrors(errors);
    return !hasErrors;
  };

  // *********************Updating images*****************

  const handleAddUserImage = async () => {
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    const formData = new FormData();
    latestImages.forEach((photo) => {
      formData.append("userPhotos", photo);
    });
    formData.append("userPhotosKeys", editImage.userPhotosKeys);
    if (editImage.profilePictureIndex !== "") {
      formData.append(
        "profilePictureIndex",
        editImage.keysToDelete?.length > 0
          ? editImage.profilePictureIndex + editImage.keysToDelete?.length
          : editImage.profilePictureIndex
      );
    } else if (editImage.profilePictureKey !== "") {
      formData.append("profilePictureKey", editImage.profilePictureKey);
    }

    try {
      setLoading(true);
      const response = await apiurl.put(
        `/user-image-upload/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Image updated successfully");
      const successfulDeletions = [];
      if (editImage.keysToDelete?.length > 0) {
        for (const key of editImage.keysToDelete) {
          try {
            const deleteResponse = await apiurl.put(
              `/user-image-delete/${userId}`,
              {
                imageKey: key,
              }
            );
            if (deleteResponse.status === 200) {
              successfulDeletions.push(key);
            } else {
              console.error(`Failed to delete image with key ${key}`);
            }
          } catch (err) {
            console.error(`Error deleting image with key ${key}:`, err);
          }
        }

        // Update state by removing only the successfully deleted keys
        setEditImage((prev) => ({
          ...prev,
          keysToDelete: prev.keysToDelete.filter(
            (key) => !successfulDeletions.includes(key)
          ),
        }));
      }
      navigate("/user-dashboard");
      const responses = await apiurl.get(`/auth/getUser/${userId}`);
      const userData = responses?.data?.user;

      dispatch(setUser({ userId, userData }));
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  // *********************Delete Images*****************

  const handleDeleteImage = (index, arrayType) => {
    const updateState = (updatedImages, updatedImagesKeys, isLatestImages) => {
      setEditImage((prev) => {
        const isDeletedImageProfilePicture = prev.profilePictureIndex === index;
        let newProfilePicture = prev.profilePicture;
        let newProfilePictureIndex = prev.profilePictureIndex;
        let newProfilePictureKey = prev.profilePictureKey;

        if (isDeletedImageProfilePicture) {
          if (updatedImages.length > 0) {
            newProfilePicture = isLatestImages
              ? updatedImages[0].name
              : updatedImages[0];
            newProfilePictureIndex = 0;
            newProfilePictureKey = isLatestImages ? "" : updatedImagesKeys[0];
          } else {
            newProfilePicture = "";
            newProfilePictureIndex = -1;
            newProfilePictureKey = "";
          }
        } else if (prev.profilePictureIndex > index) {
          newProfilePictureIndex = prev.profilePictureIndex - 1;
        }

        return {
          ...prev,
          userPhotos: updatedImages,
          userPhotosKeys: updatedImagesKeys,
          profilePicture: newProfilePicture,
          profilePictureIndex: newProfilePictureIndex,
          activeImageIndex: newProfilePictureIndex,
          profilePictureKey: newProfilePictureKey,
        };
      });
    };

    if (arrayType === "latestImages") {
      const updatedImages = latestImages.filter((_, ind) => ind !== index);
      setLatestImages(updatedImages);
      setEditImage((prev) => {
        const newProfilePictureIndex =
          prev.profilePictureIndex === index + editImage.userPhotos?.length
            ? 0
            : prev.profilePictureIndex > index + editImage.userPhotos?.length
            ? prev.profilePictureIndex - 1
            : prev.profilePictureIndex;

        return {
          ...prev,
          profilePictureIndex: newProfilePictureIndex,
          activeImageIndex: newProfilePictureIndex,
        };
      });
    } else {
      const updatedImages = editImage.userPhotos.filter(
        (_, ind) => ind !== index
      );
      const updatedImagesKeys = editImage.userPhotosKeys.filter(
        (_, ind) => ind !== index
      );
      updateState(updatedImages, updatedImagesKeys, false);
    }
  };

  const handleDeleteUserImage = async (key, index) => {
    try {
      const response = await apiurl.put(`/user-image-delete/${userId}`, {
        imageKey: key,
      });

      if (response.status === 200) {
        handleDeleteImage(index, "editImage");
      }
    } catch (err) {
      console.log(err);
    }
  };

  // *********************Get Uploaded Images *****************

  const FetchData = async () => {
    try {
      const formData = await getFormData(userId, 5);
      const userPhotosUrl = formData.selfDetails.userPhotosUrl;
      const profilePictureUrl = formData.selfDetails.profilePictureUrl;

      const profilePictureIndexInUserPhotos = userPhotosUrl.findIndex(
        (url) => url === profilePictureUrl
      );
      // console.log(profilePictureIndexInUserPhotos, "check");
      let profilePicture = profilePictureUrl;
      let profilePictureKey = formData.selfDetails.profilePicture;
      let profilePictureIndex = profilePictureIndexInUserPhotos;
      let showUrlProfile = profilePictureIndexInUserPhotos === -1;

      if (profilePictureIndexInUserPhotos === -1) {
        const profilePictureIndexInLatestImages = latestImages.findIndex(
          (image) => URL.createObjectURL(image) === profilePictureUrl
        );
        if (profilePictureIndexInLatestImages !== -1) {
          profilePictureIndex = profilePictureIndexInLatestImages;
          showUrlProfile = false;
        }
      }

      setEditImage({
        userPhotos: userPhotosUrl,
        userPhotosKeys: formData.selfDetails.userPhotos,
        profilePicture: profilePicture,
        profilePictureIndex: profilePictureIndex,
        profilePictureKey: profilePictureKey,
        showUrlProfile: showUrlProfile,
        activeImageIndex: profilePictureIndex,
        keysToDelete: [],
      });

      // console.log(formData);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  // *********************Image Input*****************

  const handleInput = (e) => {
    const { name, value } = e.target;
    const selectedFiles = e.target.files;

    if (name === "userPhotos") {
      const currentTotalImagesCount =
        latestImages.length + editImage.userPhotos.length;

      if (currentTotalImagesCount + selectedFiles.length > 5) {
        toast.error("You cannot upload more than 5 images.");
        return;
      }

      const newImages = [];
      let invalidFile = false;

      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];

        if (file.size > 15 * 1024 * 1024) {
          toast.error(`File ${file.name} exceeds the 15MB size limit.`);
          invalidFile = true;
          continue;
        }

        newImages.push(file);
      }

      if (newImages.length === 0 && invalidFile) {
        toast.error("Please select at least one valid image.");
      } else if (newImages.length > 0) {
        setLatestImages((prev) => {
          const combinedImages = [...prev, ...newImages];
          if (combinedImages.length > 5) {
            toast.error("You cannot upload more than 5 images.");
            return prev;
          }
          return combinedImages;
        });
      }
    } else {
      setEditImage((prevForm) => ({
        ...prevForm,
        [name]: value,
      }));
    }
  };

  // *********************Set profile picture*****************

  const handleChooseProfileImage = (index, arrayType) => {
    const isLatestImages = arrayType === "latestImages";
    const newProfilePicture = isLatestImages
      ? latestImages[index]
      : editImage.userPhotos[index];
    const newProfilePictureKey = isLatestImages
      ? ""
      : editImage.userPhotosKeys[index];
    const adjustedIndex = isLatestImages
      ? editImage.userPhotos.length + index
      : index;

    setEditImage((prev) => ({
      ...prev,
      profilePicture: newProfilePicture,
      profilePictureKey: newProfilePictureKey,
      profilePictureIndex: adjustedIndex,
      activeImageIndex: adjustedIndex,
      showUrlProfile: !isLatestImages,
    }));
  };

  useEffect(() => {
    FetchData();
  }, [userId]);

  return (
    <>
      <Header />

      {isLoading ? (
        <div className="md:mx-52 mx-6 mt-36">
          <Skeleton height={600} />
        </div>
      ) : (
        <>
          <BackArrow className="absolute md:ml-24 md:mt-32 sm:mt-28 md:w-52 w-full" />
          <div className="shadow rounded-xl md:mx-52 mx-6 py-12 my-5 font-DMsans md:mt-40 sm:mt-48 mt-36 mb-36 ">
            <div className="md:px-16 px-6">
              <div className="font-semibold mb-9 text-primary">My photos</div>
              <div className="flex flex-col">
                <span className="">
                  <label
                    htmlFor="images"
                    className="drop-container flex justify-start w-60 items-center border border-[#CC2E2E]"
                    id="dropcontainer"
                  >
                    <span className="drop-title text-primary">
                      Upload a Photo
                    </span>
                    <span className="flex items-center justify-center text-primary">
                      <FaFileUpload size={50} />
                    </span>
                    <input
                      type="file"
                      id="images"
                      accept=".jpeg,.jpg,.png"
                      multiple
                      name="userPhotos"
                      onChange={(e) => handleInput(e)}
                      required
                    />
                  </label>
                </span>
                <p className=" text-[13px] pt-2 text-primary">
                  1. Upload 1-5 high-quality photos (max. 15MB each) <br />
                  2. Recommended image size: 720 * 1080 px or 2:3 <br />
                  3. Set your profile picture by clicking the profile icon{" "}
                  <br />
                  4. Use the crop tool to focus on key areas of your images{" "}
                  <br /> Note: Your profile picture will be visible to all
                  users. We recommend a clear, face-focused image for best
                  results. Other photos will only be shown after you approve
                  connection requests.
                </p>
              </div>
              <hr className="mt-5 border border-[#e2e2e2]" />
              <div className="flex mt-5 flex-wrap"></div>
              <p className="mt-6">Your Photos</p>

              {/* <UploadModal
            latestImages={latestImages}
            handleCropProfileImage={handleCropProfileImage}
            handleDeleteImage={handleDeleteImage}
            handleDeleteUserImage={handleDeleteUserImage}
            handleChooseProfileImage={handleChooseProfileImage}
            editImage={editImage}
          /> */}

              <span className="flex flex-wrap items-center gap-6 mt-2">
                {editImage?.userPhotos?.map((selectedImage, index) => (
                  <span key={index}>
                  <div className="relative grid place-items-center">
  <img
    src={selectedImage}
    className={`md:w-[20vh] md:h-[20vh] w-36 h-36 rounded-xl ${
      editImage.activeImageIndex === index
        ? "border-2 border-primary p-1"
        : ""
    }`}
    alt={`Selected Image ${index + 1}`}
    loading="lazy"
  />
  <span
    onClick={() =>
      handleCropProfileImage(selectedImage, index, "urls")
    }
    className="absolute top-2 md:right-3 right-2 p-1 bg-slate-200 text-primary border border-primary rounded-full text-[20px] cursor-pointer"
  >
    <IoCropSharp />
  </span>
</div>

                    <span className="flex mt-5 items-center justify-center gap-2">
                      <div className="px-6 py-1 border cursor-pointer border-primary hover:bg-primary hover:text-white rounded-xl text-primary">
                        <RiDeleteBin6Line
                          onClick={() => {
                            handleDeleteUserImage(
                              editImage.userPhotosKeys[index],
                              index
                            );
                          }}
                          size={20}
                        />
                      </div>
                      <button
                        onClick={() =>
                          handleChooseProfileImage(index, "editImage")
                        }
                        className={`px-6 py-1 border cursor-pointer text-[20px] border-primary hover:bg-primary hover:text-white rounded-xl text-primary ${
                          editImage.activeImageIndex === index
                            ? "bg-primary text-white"
                            : ""
                        }`}
                      >
                        <FaRegCircleUser />
                      </button>
                    </span>
                  </span>
                ))}

                {latestImages.map((selectedImage, index) => (
                  <span key={index}>
                    <span className="relative">
                      <img
                        src={URL.createObjectURL(selectedImage)}
                        className={`w-36 h-36 rounded-xl border border-primary ${
                          editImage.activeImageIndex ===
                          index + editImage.userPhotos?.length
                            ? "border-2 border-primary p-1"
                            : ""
                        }`}
                        alt={`Selected Image ${index + 1}`}
                        loading="lazy"
                      />

                      <span
                        onClick={() =>
                          handleCropProfileImage(
                            URL.createObjectURL(selectedImage),
                            index,
                            "latest"
                          )
                        }
                        className="absolute  top-2 right-2 p-1 bg-slate-200 text-primary border border-primary rounded-full  text-[20px] cursor-pointer"
                      >
                        <IoCropSharp />
                      </span>
                    </span>
                    <span className="flex mt-5 gap-2 items-center justify-center">
                      <div className="px-6 py-1 border cursor-pointer border-primary hover:bg-primary hover:text-white rounded-xl text-primary">
                        <RiDeleteBin6Line
                          onClick={() => {
                            handleDeleteImage(index, "latestImages");
                          }}
                          size={20}
                        />
                      </div>
                      <button
                        onClick={() =>
                          // handleCropProfileImage(URL.createObjectURL(selectedImage), index)
                          handleChooseProfileImage(index, "latestImages")
                        }
                        className={`px-6 py-1 border cursor-pointer text-[20px] border-primary hover:bg-primary hover:text-white rounded-xl text-primary ${
                          editImage.activeImageIndex ===
                          index + editImage.userPhotos?.length
                            ? "bg-primary text-white"
                            : ""
                        }`}
                      >
                        <FaRegCircleUser />
                      </button>
                    </span>
                  </span>
                ))}
              </span>
              <span className="flex justify-end items-center gap-5 mt-11">
                <Link to="/user-dashboard">
                  <span className="border border-primary px-6 py-2 rounded-md text-primary cursor-pointer">
                    Cancel
                  </span>
                </Link>
                <span
                  onClick={handleAddUserImage}
                  className="px-6 py-2 rounded-md cursor-pointer bg-primary text-white"
                >
                  {loading ? "Updating..." : "Update"}
                </span>
              </span>
            </div>
          </div>
        </>
      )}
      <CropModal
        src={src.srcImage}
        setCropModal={setCropModal}
        openCropModal={openCropModal}
        onCropComplete={onCropComplete}
      />
    </>
  );
};

export default ImageEdit;
