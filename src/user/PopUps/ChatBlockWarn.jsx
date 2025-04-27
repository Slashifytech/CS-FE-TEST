    import React from "react";
import { MdBlock } from "react-icons/md";



    const ChatBlockWarn = ({  isOpenBlockWarn, closeBlockPopWarn}) => {
    

    return (
        <>
        {isOpenBlockWarn && (
            <div
            className={`fixed inset-0 flex items-center justify-center popup-backdrop z-50  sm:px-52  px-6 ${
                isOpenBlockWarn ? "block" : "hidden"
            }`}
            >
            <div className="bg-white pb-9  rounded-lg md:w-[50%] w-full  relative p-9 app-open-animation ">
            
                <p className="text-start font-DMsans text-black font-semibold text-[16px] items-center ">
                Thank you, we have received your report & the admin will look into it. <br />

If you want to completely stop any communication from the reported profile, you can also BLOCK them by clicking <span className=" inline-flex  text-primary"><MdBlock/></span> from chat itself.
                </p>
                
            
                <div className="flex justify-center items-center font-DMsans gap-5 mt-5">
              
                <span
                    onClick={() => {
                    //   handleReportUser( userId, reviewText, receiverId);
                    //   handleReset();
                    closeBlockPopWarn();
                    
                    }}
                    className="px-8 py-2 cursor-pointer rounded-lg text-white bg-primary"
                >
                    Okay
                </span>
                </div>
            </div>
            </div>
        )}
        </>
    );
    };

    export default ChatBlockWarn;
