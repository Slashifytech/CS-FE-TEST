import React from 'react'

const EditImgModal = ({editImage, latestImages, handleDeleteUserImage, handleCropProfileImage, handleChooseProfileImage }) => {
  return (
     <span className="flex flex-wrap items-center gap-6 mt-2">
                  {editImage?.userPhotos?.map((selectedImage, index) => (
                    <span key={index}>
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
                              index
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
  )
}

export default EditImgModal