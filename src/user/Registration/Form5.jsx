import { useEffect, useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaFileUpload } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { setUser, userDataStore } from "../../Stores/slices/AuthSlice";
import { setStep, selectStepper } from "../../Stores/slices/Regslice";
import apiurl from "../../util";
import { Link, useNavigate } from "react-router-dom";
import { fetchImageAsBuffer, getLabel } from "../../common/commonFunction.js";
import { FaRegCircleUser } from "react-icons/fa6";
import { toast } from "react-toastify";
import { Button, Select } from "antd";
import {
  setUserAddedbyAdminId,
  setUserDataAddedbyAdmin,
} from "../../Stores/slices/Admin.jsx";
import Loading from "../../components/Loading.jsx";
import CropModal from "../../components/ImageCropper.jsx";
import { IoCropSharp } from "react-icons/io5";
import UploadModal from "./UploadModal.jsx";

const Form5 = ({}) => {
  const { interest, fitness, other, funActivity } = useSelector(
    (state) => state.masterData
  );
  const dispatch = useDispatch();
  const { currentStep, formData } = useSelector(selectStepper);
  const { admin, userAddedbyAdminId } = useSelector((state) => state.admin);
  const { userId } = useSelector(userDataStore);
  const [formFive, setFormFive] = useState({
    aboutYourself: "",
    userPhotos: [],
    userPhotosUrls: [],
    profilePictureIndex: -1,
    fun: [],
    fitness: [],
    other: [],
    interests: [],
    keysToDelete: [],
  });
  const page = 5;

  const [latestImages, setLatestImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openCropModal, setCropModal] = useState(false);
  const [src, setSrc] = useState({
    srcImage: null,
    fromUrl: false,
  });
  const [croppedImageIndex, setCroppedImageIndex] = useState(null);
  const navigate = useNavigate();
  const passPage = "passPage";

  let userIdData;
  if (admin === "new") {
    userIdData = userId;
  } else {
    userIdData = userAddedbyAdminId.userAddedbyAdminId;
  }

  // *********************Crop Image code*****************

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const imgUrls = formFive.userPhotosUrls;

        const imagesMap = await getUserImagesInBase64(imgUrls);
      } catch (err) {
        console.error("Error fetching images:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [formFive.userPhotosUrls]);
  // console.log("base64", imagesBase64Map.images)

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

    setFormFive((prev) => {
      return {
        ...prev,
        profilePictureIndex:
          croppedImageIndex === prev.profilePictureIndex
            ? croppedImageIndex
            : prev.profilePictureIndex,
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
      const updatedImagesUrl = [...formFive.userPhotosUrls].filter(
        (image, ind) => ind !== croppedImageIndex
      );

      const updatedImages = [...formFive.userPhotos].filter(
        (image, ind) => ind !== croppedImageIndex
      );
      // Get the image(s) that need to be deleted
      const imagesToDelete = [...formFive.userPhotos].filter(
        (image, ind) => ind === croppedImageIndex
      );

      setFormFive((prev) => {
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
          userPhotosUrls: updatedImagesUrl,
          userPhotos: updatedImages,
          profilePictureIndex: newProfilePictureIndex,
          keysToDelete: [...prev.keysToDelete, ...imagesToDelete],
        };
      });
    }
  };

  const handleCropProfileImage = async (imageSrc, index, value) => {
    let file = imageSrc;
    if (value === "urls") {
      file = await fetchImageAsBuffer(imageSrc);
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

  // *********************form validations*****************

  const [formErrors, setFormErrors] = useState({
    aboutYourself: "",
    profilePictureIndex: -1,
    fun: [],
    fitness: [],
    other: [],
    interests: [],
  });
  const validateForm = () => {
    const errors = {};
    let hasErrors = false;

    if (!formFive.aboutYourself) {
      errors.aboutYourself = "About is required";

      hasErrors = true;
    }
    if (
      formFive.profilePictureIndex === -1 ||
      formFive.profilePictureIndex === null
    ) {
      errors.profilePictureIndex = "Profile picture is required";
      hasErrors = true;
    }
    if (formFive.interests === "NA") {
      errors.interests = "Profile Picture is required";
      hasErrors = true;
    }
    if (formFive.fun === "NA") {
      errors.interests = "Profile Picture is required";
      hasErrors = true;
    }
    if (formFive.fitness === "NA") {
      errors.interests = "Profile Picture is required";
      hasErrors = true;
    }
    if (formFive.other === "NA") {
      errors.other = "Profile Picture is required";
      hasErrors = true;
    }

    setFormErrors(errors);
    return !hasErrors;
  };

  // *********************Form submission *****************

  const handleSubmitForm5 = async () => {
    // Prevent multiple form submissions
    if (isSubmitting) return;
    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    let loadingTimer;

    const startLoading = () => {
      loadingTimer = setTimeout(() => {
        setLoading(true);
      }, 3000);
    };

    const stopLoading = () => {
      clearTimeout(loadingTimer);
      setLoading(false);
    };
    try {
      setIsSubmitting(true);
      if (
        formFive.userPhotos?.length + latestImages?.length >= 1 &&
        formFive.userPhotos?.length + latestImages?.length <= 5
      ) {
        if (userIdData) {
          startLoading();
          const formData = new FormData();
          formData.append("userId", userId);
          formData.append("page", page);
          const convertToString = (field) => {
            if (Array.isArray(field)) {
              return field.length === 0 ? "NA" : field.join(",");
            } else {
              return field === "" ? "" : field;
            }
          };

          const interestsString = convertToString(formFive?.interests);
          const funString = convertToString(formFive?.fun);
          const fitnessString = convertToString(formFive?.fitness);
          const otherString = convertToString(formFive?.other);

          let selfDetaillsData = { ...formFive };
          selfDetaillsData.fitness = fitnessString;
          selfDetaillsData.fun = funString;
          selfDetaillsData.other = otherString;
          selfDetaillsData.interests = interestsString;
          formData.append("selfDetails", JSON.stringify(selfDetaillsData));
          formData.append("profilePictureIndex", formFive?.profilePictureIndex);
          formFive.userPhotos.forEach((photo) => {
            formData.append("userPhotos", photo);
          });
          latestImages.forEach((photo) => {
            formData.append("userPhotos", photo);
          });
          const response = await apiurl.post(
            `/user-data/${userIdData}?page=5`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          setLatestImages([]);
          await getFormData();
          toast.success(response.data.message);
          if (admin === "new") {
            dispatch(setUser({ userData: { ...response.data.user } }));
          } else if (admin === "adminAction") {
            dispatch(setUserDataAddedbyAdmin(response.data.user));
            dispatch(
              setUserAddedbyAdminId({
                userAddedbyAdminId: response?.data?.user?._id,
              })
            );
          }
          // Call the delete API after uploading the images
          // Handle deletion of images
          const successfulDeletions = [];
          if (formFive.keysToDelete.length > 0) {
            for (const key of formFive.keysToDelete) {
              try {
                const deleteResponse = await apiurl.put(
                  `/user-image-delete/${userIdData}`,
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
            setFormFive((prev) => ({
              ...prev,
              keysToDelete: prev.keysToDelete.filter(
                (key) => !successfulDeletions.includes(key)
              ),
            }));
          }
          return response;
        } else {
          toast.error("User ID not found");
        }
      } else {
        toast.error(
          "At least upload one image and select it as your profile picture"
        );
      }
      return;
    } catch (err) {
      const errorMessage =
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : "An unexpected error occurred";
      toast.error(errorMessage);
      console.error(err);
    } finally {
      stopLoading();
      setIsSubmitting(false);
    }
  };
  // *********************Moving to Next form*****************

  const handleNext = async () => {
    const responseStatus = await handleSubmitForm5();

    if (responseStatus.status === 200) {
      navigate(`/registration-form/6`, { state: passPage });
      window.scrollTo(0, 0);
    } else {
      toast.error("Form submission failed. Please try again.");
    }
  };

  // *********************Get all data*****************

  const getFormData = async () => {
    if (userId) {
      try {
        const response = await apiurl.get(`/user-data/${userIdData}?page=5`);
        const formData = response.data?.pageData;

        const profilePictureIndexInUserPhotos =
          formData.selfDetails.userPhotosUrl.findIndex(
            (url) => url === formData.selfDetails.profilePictureUrl
          );

        const profilePictureIndex =
          profilePictureIndexInUserPhotos !== -1
            ? profilePictureIndexInUserPhotos
            : latestImages.findIndex(
                (image) =>
                  URL.createObjectURL(image) ===
                  formData.selfDetails.profilePictureUrl
              ) +
              (profilePictureIndexInUserPhotos !== -1
                ? 0
                : formFive.userPhotos.length);

        const parseField = (field) => {
          if (field === "NA") return "NA";
          if (field === "" || field === "Select All") return "Select All";
          return field.split(",").map((item) => parseInt(item.trim()));
        };

        setFormFive((prevState) => ({
          ...prevState,
          aboutYourself: formData.selfDetails?.aboutYourself || "",
          userPhotos: formData.selfDetails?.userPhotos || [],
          userPhotosUrls: formData.selfDetails?.userPhotosUrl || [],
          profilePictureIndex:
            profilePictureIndex !== -1 ? profilePictureIndex : null,
          interests: parseField(formData.selfDetails?.interests),
          fun: parseField(formData.selfDetails?.fun),
          fitness: parseField(formData.selfDetails?.fitness),
          other: parseField(formData.selfDetails?.other),
        }));
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    }
  };

  // *********************Input images*****************

  const handleinput = (e) => {
    const { name, value, files } = e.target;

    if (name === "userPhotos") {
      const selectedFiles = Array.from(files);
      setFormFive((prevForm) => ({
        ...prevForm,
        [name]: [...prevForm[name], ...selectedFiles],
      }));
    } else {
      setFormFive((prevForm) => ({
        ...prevForm,
        [name]: value,
      }));
    }
  };

  // *********************Image validations*****************

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const currentImagesCount = formFive.userPhotosUrls?.length;
    const newImagesCount = selectedFiles?.length;

    if (currentImagesCount + newImagesCount < 1) {
      toast.error("You must upload at least 1 image.");
      return;
    }

    if (currentImagesCount + newImagesCount > 5) {
      toast.error("You can upload a maximum of 5 images.");
      return;
    }

    const imagesExceedingSizeLimit = selectedFiles.some(
      (file) => file.size > 15 * 1024 * 1024
    ); // 15MB in bytes

    if (imagesExceedingSizeLimit) {
      toast.error("Each image should be less than 15MB.");
      return;
    }

    const uniqueNewImages = selectedFiles.filter(
      (file) =>
        !formFive.userPhotos.some(
          (photo) => photo.name === file.name && photo.size === file.size
        )
    );

    const remainingSlots = 5 - currentImagesCount;
    const newImagesToAdd = uniqueNewImages.slice(
      0,
      Math.min(remainingSlots, uniqueNewImages.length)
    );
    setLatestImages((prev) => [...prev, ...newImagesToAdd]);
  };

  // *********************Delete images*****************

  const handleDeleteUserImage = async (key, index) => {
    try {
      await apiurl.put(`/user-image-delete/${userIdData}`, { imageKey: key });
      handleDeleteImage(index, "userPhotosUrls");
    } catch (err) {
      console.log(err);
    }
  };
  const handleDeleteImage = (index, arrayType) => {
    if (arrayType === "latestImages") {
      const updatedImages = [...latestImages].filter(
        (image, ind) => ind !== index
      );
      setLatestImages(updatedImages);
      setFormFive((prev) => ({
        ...prev,
        userPhotos: updatedImages,
      }));

      setFormFive((prev) => {
        const newProfilePictureIndex =
          prev.profilePictureIndex >= index
            ? prev.profilePictureIndex - 1
            : prev.profilePictureIndex;
        return {
          ...prev,
          profilePictureIndex: newProfilePictureIndex,
        };
      });
    } else {
      // Handle deletion from userPhotosUrl and userPhotos
      const updatedImagesUrl = [...formFive.userPhotosUrls].filter(
        (image, ind) => ind !== index
      );

      const updatedImages = [...formFive.userPhotos].filter(
        (image, ind) => ind !== index
      );

      setFormFive((prev) => {
        // Determine the new profilePictureIndex
        let newProfilePictureIndex = prev.profilePictureIndex;

        if (prev.profilePictureIndex === index) {
          // If the profile picture is being deleted, set it to the first available image
          newProfilePictureIndex = updatedImages.length > 0 ? 0 : null;
        } else if (prev.profilePictureIndex > index) {
          // Adjust profilePictureIndex if it was greater than the deleted index
          newProfilePictureIndex = prev.profilePictureIndex - 1;
        }

        return {
          ...prev,
          userPhotosUrls: updatedImagesUrl,
          userPhotos: updatedImages,
          profilePictureIndex: newProfilePictureIndex,
        };
      });
    }
  };

  // *********************Select profile images*****************

  const handleChooseProfileImage = (index, arrayType) => {
    const isLatestImages = arrayType === "latestImages";

    setFormFive((prev) => ({
      ...prev,
      profilePictureIndex: isLatestImages
        ? formFive.userPhotosUrls.length + index
        : index,
    }));
  };

  const prevForm = () => {
    dispatch(setStep(currentStep - 1));
  };

  useEffect(() => {
    dispatch(setStep(page));
  }, []);

  useEffect(() => {
    getFormData();
  }, [userIdData]);

  // *********************dropdown code****************

  const onChange = (key, value) => {
    const arrayValue = Array.isArray(value) ? value : [value];
    const allSelected = arrayValue.length === interest.length;

    setFormFive((prevState) => ({
      ...prevState,
      [key]: arrayValue.length === 0 ? "NA" : allSelected ? "" : arrayValue,
    }));
  };

  const onSearch = (value) => {
    // console.log("search:", value);
  };

  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  const handleSelectAll = (key, dataSource, dataKey) => {
    const allValues = dataSource.map((item) => item[dataKey]);
    setFormFive((prevState) => ({
      ...prevState,
      [key]: allValues ? "" : arrayValue,
    }));
  };
  const dropdownRender = (key, dataSource, dataKey) => (menu) =>
    (
      <div>
        <div
          style={{
            padding: "4px 8px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Button
            type="link"
            size="small"
            onClick={() => handleSelectAll(key, dataSource, dataKey)}
            style={{ color: " #A92525" }}
          >
            Select all
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              setFormFive((prevState) => ({
                ...prevState,
                [key]: [],
              }));
            }}
            style={{ color: " #A92525" }}
          >
            Clear All
          </Button>
        </div>
        {menu}
      </div>
    );

  return (
    <>
      <div className="bg-[#FCFCFC] sm:mx-12 md:mx-0 md:px-9 sm:px-6 px-5 py-12 rounded-xl shadow ">
        <div className="flex flex-col mb-2">
          <label htmlFor="name" className="font-semibold mb-1">
            {getLabel() === "My" ? "About Me" : getLabel() + " " + "About"}{" "}
            <span className="text-primary">*</span>
          </label>
          <textarea
            value={formFive?.aboutYourself}
            onChange={(e) => handleinput(e)}
            className="p-2  bg-[#F0F0F0] mt-1 outline-0 h-[30vh] border focus:border-[#CC2E2E]  rounded-md mb-3"
            type="text"
            name="aboutYourself"
            placeholder="Write about yourself...."
            id="about"
          />

          <label htmlFor="name" className="font-semibold mt-2 mb-9  ">
            {getLabel()} Photos <span className="text-primary">*</span>
          </label>
          <div className=" w-60  ">
            <label
              htmlFor="images"
              className="drop-container items-center border border-[#CC2E2E]  "
              id="dropcontainer"
            >
              <span className="drop-title">Upload a Photo</span>
              <span className="flex items-center justify-start">
                <FaFileUpload color="#CC2E2E" size={50} />
              </span>
              <input
                type="file"
                id="images"
                accept=".jpeg,.jpg,.png"
                onChange={handleImageChange}
                multiple
                required
              />
            </label>
          </div>
          <UploadModal
            latestImages={latestImages}
            handleCropProfileImage={handleCropProfileImage}
            handleDeleteImage={handleDeleteImage}
            handleDeleteUserImage={handleDeleteUserImage}
            handleChooseProfileImage={handleChooseProfileImage}
            formFive={formFive}
          />
          <p className=" text-[13px] pt-2 text-primary">
            1. Upload 1-5 high-quality photos (max. 15MB each) <br />
            2. Recommended image size: 720 * 1080 px or 2:3 <br />
            3. Set your profile picture by clicking the profile icon <br />
            4. Use the crop tool to focus on key areas of your images <br />{" "}
            Note: Your profile picture will be visible to all users. We
            recommend a clear, face-focused image for best results. Other photos
            will only be shown after you approve connection requests.
          </p>
        </div>
        <div className=" mb-2 mt-9">
          <label className="font-semibold    ">
            {" "}
            {getLabel()} Interests <span className="text-primary">*</span>
          </label>
          <div className="mt-3">
            <Select
              name="interest"
              showSearch
              value={
                formFive.interests === "NA"
                  ? []
                  : formFive.interests === ""
                  ? ["Select all"]
                  : formFive.interests
              }
              placeholder="Interests"
              optionFilterProp="children"
              onChange={(value) => {
                if (value.includes("Select all")) {
                  onChange("interests", ["Select all"]);
                } else {
                  onChange("interests", value);
                }
              }}
              onSearch={onSearch}
              filterOption={filterOption}
              mode="multiple"
              dropdownRender={dropdownRender(
                "interests",
                interest,
                "interest_id"
              )}
              options={interest.map((interest) => ({
                value: interest.intrest_id,
                label: interest.intrest_name,
              }))}
              className="w-full custom-select font-DMsans text-[15px]"
            />
          </div>
        </div>
        <div className=" mb-2 mt-5">
          <label className="font-semibold    ">
            {" "}
            {getLabel()} Fun Activities <span className="text-primary">*</span>
          </label>

          <div className="mt-3">
            <Select
              name="fun"
              showSearch
              value={
                formFive.fun === "NA"
                  ? []
                  : formFive.fun === ""
                  ? ["Select all"]
                  : formFive.fun
              }
              placeholder="Fun Activities"
              optionFilterProp="children"
              onChange={(value) => {
                if (value.includes("Select all")) {
                  onChange("fun", ["Select all"]);
                } else {
                  onChange("fun", value);
                }
              }}
              onSearch={onSearch}
              filterOption={filterOption}
              mode="multiple"
              dropdownRender={dropdownRender(
                "fun",
                funActivity,
                "funActivity_id"
              )}
              options={funActivity.map((fun) => ({
                value: fun.funActivity_id,
                label: fun.funActivity_name,
              }))}
              className="w-full custom-select  font-DMsans text-[15px] "
            />
          </div>
        </div>

        <div className=" mb-2 mt-5">
          <label className="font-semibold mt-2 mb-9">
            {" "}
            {getLabel()} Fitness <span className="text-primary">*</span>
          </label>
          <div className="mt-3">
            {" "}
            <Select
              name="interest"
              showSearch
              value={
                formFive.fitness === "NA"
                  ? []
                  : formFive.fitness === ""
                  ? ["Select all"]
                  : formFive.fitness
              }
              placeholder="Fitness"
              optionFilterProp="children"
              onChange={(value) => {
                if (value.includes("Select all")) {
                  onChange("fitness", ["Select all"]);
                } else {
                  onChange("fitness", value);
                }
              }}
              onSearch={onSearch}
              filterOption={filterOption}
              mode="multiple"
              dropdownRender={dropdownRender("fitness", fitness, "fitness_id")}
              options={fitness.map((fit) => ({
                value: fit.fitness_id,
                label: fit.fitness_name,
              }))}
              className="w-full custom-select  font-DMsans text-[15px]"
            />
          </div>
        </div>

        <div className=" mb-2 mt-5">
          <label className="font-semibold mt-2 mb-9">
            {" "}
            {getLabel()} Other Interests <span className="text-primary">*</span>
          </label>
          <div className="mt-3">
            <Select
              name="other"
              showSearch
              value={
                formFive.other === "NA"
                  ? []
                  : formFive.other === ""
                  ? ["Select all"]
                  : formFive.other
              }
              placeholder="Other"
              optionFilterProp="children"
              onChange={(value) => {
                if (value.includes("Select all")) {
                  onChange("other", ["Select all"]);
                } else {
                  onChange("other", value);
                }
              }}
              onSearch={onSearch}
              filterOption={filterOption}
              mode="multiple"
              dropdownRender={dropdownRender("other", other, "other_id")}
              options={other.map((other) => ({
                value: other.other_id,
                label: other.other_name,
              }))}
              className="w-full custom-select  font-DMsans text-[15px] "
            />
          </div>
        </div>
        <span className="mt-9 flex justify-center  items-center md:gap-16 gap-3 px-12">
          <Link
            to={`/registration-form/4`}
            state={passPage}
            onClick={prevForm}
            className="px-3 py-2 text-lg rounded-md w-full text-white text-center background"
          >
            Previous
          </Link>
          {loading ? (
            <div className=" md:ml-52 ml-6">
              <Loading customText={"Uploading Images"} />
            </div>
          ) : (
            <>
              <button
                onClick={handleSubmitForm5}
                className="px-3 py-2 text-lg rounded-md w-full text-white text-center background"
              >
                Save
              </button>
              <button
                onClick={handleNext}
                className="px-3 py-2 text-lg rounded-md w-full text-white text-center background"
              >
                Next
              </button>
            </>
          )}
        </span>
      </div>
      <CropModal
        src={src.srcImage}
        setCropModal={setCropModal}
        openCropModal={openCropModal}
        onCropComplete={onCropComplete}
      />
    </>
  );
};

export default Form5;
