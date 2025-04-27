import { useEffect, useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegCircleUser } from "react-icons/fa6";
import { IoCropSharp } from "react-icons/io5";

const UploadModal = ({latestImages, handleCropProfileImage, handleDeleteImage, handleDeleteUserImage, handleChooseProfileImage, formFive}) => {
  return (
    <>
    <div className="flex flex-wrap gap-5 mt-9">
            {latestImages.length > 0 && (
              <div>
                <p className="mb-3 font-medium font-DMsans">
                  Select one image as profile:
                </p>
                <div className="flex flex-wrap gap-3">
                  {latestImages.map((image, index) => (
                    <div key={index}>
                      <span className="relative">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Uploaded ${index + 1}`}
                          className={`w-[9rem] h-[20vh] rounded-xl 
                          ${
                            formFive.profilePictureIndex ===
                            index + formFive.userPhotosUrls?.length
                              ? "border-2 border-primary"
                              : ""
                          }`}
                          loading="lazy"
                        />
                        <span
                          onClick={() =>
                            handleCropProfileImage(
                              URL.createObjectURL(image),
                              index,
                              "latest"
                            )
                          }
                          className="absolute  top-2 right-2 p-1 bg-slate-200 text-primary border border-primary rounded-full  text-[20px] cursor-pointer"
                        >
                          <IoCropSharp />
                        </span>
                      </span>
                      <div className="flex gap-3 mt-2 mb-3">
                        <button
                          onClick={() => {
                            handleDeleteImage(index, "latestImages");
                          }}
                          className="px-6 text-[20px] py-1 border cursor-pointer border-primary hover:bg-primary hover:text-white rounded-xl text-primary"
                        >
                          {" "}
                          <RiDeleteBin6Line />
                        </button>
                        <button
                          onClick={() =>
                            handleChooseProfileImage(index, "latestImages")
                          }
                          className={`p-6 py-1 border cursor-pointer text-[20px] border-primary hover:bg-primary hover:text-white rounded-xl text-primary ${
                            formFive.profilePictureIndex ===
                            index + formFive.userPhotosUrls?.length
                              ? "bg-primary text-white"
                              : ""
                          }`}
                        >
                          <FaRegCircleUser />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className=" gap-5  ">
            {formFive?.userPhotosUrls?.length > 0 && (
              <div>
                <p className=" font-DMsans font-medium">Your Uploaded Images</p>
                <div className="flex flex-wrap gap-5 mt-3">
                  {formFive?.userPhotosUrls?.map((image, index) => (
                    <div key={index}>
                      <span className="relative">
                      <img
                        src={image}
                        alt={`Uploaded ${index + 1}`}
                        className={`w-[22vh] h-[22vh] rounded-xl  ${
                          formFive.profilePictureIndex === index
                            ? "border-2 border-primary p-1"
                            : ""
                        }`}
                      />
                        <span
                          onClick={() =>
                            handleCropProfileImage(
                              image,
                              index,
                              "urls"
                            )
                          }
                          className="absolute  top-2 right-2 p-1 bg-slate-200 text-primary border border-primary rounded-full  text-[20px] cursor-pointer"
                        >
                          <IoCropSharp />
                        </span>
                      </span>
                      <div className="flex gap-2 items-center mt-2">
                        <button
                          onClick={() => {
                            handleDeleteUserImage(
                              formFive.userPhotos[index],
                              index
                            );
                          }}
                          className="px-6   text-[20px] py-1 border cursor-pointer border-primary hover:bg-primary hover:text-white rounded-xl text-primary"
                        >
                          {" "}
                          <RiDeleteBin6Line />
                        </button>
                        <button
                          onClick={() =>
                            handleChooseProfileImage(index, "userPhotosUrls")
                          }
                          className={`px-6 py-1 border cursor-pointer text-[20px] border-primary hover:bg-primary hover:text-white rounded-xl text-primary ${
                            formFive.profilePictureIndex === index
                              ? "bg-primary text-white"
                              : ""
                          }`}
                        >
                          <FaRegCircleUser />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
    </>
  )
}

export default UploadModal