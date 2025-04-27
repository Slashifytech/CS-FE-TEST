import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setChannelId, userDataStore } from "../../Stores/slices/AuthSlice";
import {
  setChatRedirection,
  setConversations,
} from "../../Stores/slices/chatSlice";
import { useNavigate, useSearchParams } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { ChatBottomNav } from "../../components/ChatHeader";
import { ChatDataNotFound } from "../../components/DataNotFound";
import { defaultImage, dnf, nochat } from "../../assets";
import Header from "../../components/Header";
import { RiCheckDoubleLine } from "react-icons/ri";
import { capitalizeWord } from "../../util";

const ChatSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userId } = useSelector(userDataStore);
  const { chatUsers, currentConversation, messages } = useSelector(
    (state) => state.chat
  );
  const redirectionUserId = useSelector(
    (state) => state.chat.chatRedirectionId
  );
  const [searchParams] = useSearchParams();
  const senderId = searchParams.get("senderId");
  const [loading, setLoading] = useState(true);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 768);
  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 768); // Same breakpoint
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const chatUserData = chatUsers.find((user) => user._id === redirectionUserId);

  useEffect(() => {
    dispatch(setConversations(chatUserData));
    dispatch(setChatRedirection(""));
    if(chatUserData){
      navigate("/chat");
    }
  }, [chatUserData]);

  useEffect(() => {
    if (chatUsers) {
      setLoading(true);
      const timer = setTimeout(() => {
        setLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);
  useEffect(() => {
    dispatch({ type: "ON_CHAT_PAGE" });
  }, [messages]);
  useEffect(() => {
    dispatch(setChatRedirection(senderId));
  }, [senderId]);

  const handleUserClick = (user) => {
    dispatch(setChannelId(user?.channelId));
    dispatch(setConversations(user));
    navigate("/chat");
  };

  const formatDate = (timestamp) => {
    const today = new Date();
    const messageDate = new Date(timestamp);

    if (isNaN(messageDate.getTime())) {
      return "";
    }

    const diffMilliseconds = today - messageDate;
    const diffHours = Math.floor(diffMilliseconds / (1000 * 60 * 60));

    let formattedDate;
    if (diffHours < 24) {
      formattedDate = messageDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } else {
      formattedDate = `${messageDate.getDate()} ${messageDate.toLocaleString(
        "default",
        { month: "long" }
      )} ${messageDate.getFullYear()}`;
    }

    return formattedDate;
  };

  useEffect(() => {
    if (currentConversation && chatUsers) {
      const updatedConversation = chatUsers.find(
        (user) => user._id === currentConversation._id
      );
      if (updatedConversation) {
        dispatch(setConversations(updatedConversation));
      }
    }
  }, [chatUsers, currentConversation, dispatch]);
  useEffect(() => {
    if (currentConversation && chatUsers) {
      const updatedConversation = chatUsers.find(
        (user) => user._id === currentConversation._id
      );
      if (updatedConversation) {
        dispatch(setConversations(updatedConversation));
      }
    }
  }, [chatUsers, currentConversation, dispatch]);
  const truncateName = (name) => {
    return name?.length > 14
      ? `${name?.replace("undefined", "")?.slice(0, 10)}..`
      : name;
  };

  const sortedChatUsers = [...chatUsers].sort((a, b) => {
    const aDate = a.lastMessage?.createdAt
      ? new Date(a.lastMessage.createdAt).getTime()
      : 0;
    const bDate = b.lastMessage?.createdAt
      ? new Date(b.lastMessage.createdAt).getTime()
      : 0;
    return bDate - aDate; // Sort in descending order
  });
  return (
    <>
      <span className="">
        <Header />
      </span>
      <span className="md:hidden sm:hidden">
        <ChatBottomNav />
      </span>
      <div className="md:mx-6 w-full md:w-96 md:mt-20 mt-2 sm:mt-32  ">
        <p className="font-montserrat font-semibold text-[25px] md:mt-36 md:px-0 px-6  ">
          Start Conversation
        </p>

        {loading ? (
          <>
            <div className="mt-5 mx-7">
              <Skeleton height={80} />
            </div>
            <div className="mt-5 mx-7">
              <Skeleton height={80} />
            </div>
            <div className="mt-5 mx-7">
              <Skeleton height={80} />
            </div>
            <div className="mt-5 mx-7">
              <Skeleton height={80} />
            </div>
          </>
        ) : sortedChatUsers.length === 0 ? (
          <>
            <div className="flex items-center justify-center mt-28 md:mt-12 md:absolute left-[50%]">
              <ChatDataNotFound
                className={"flex flex-col justify-center items-center"}
                custimg={isLargeScreen ? nochat : dnf}
                linkDestination={"/all-matches"}
                linkText={!isLargeScreen ? "Find your match" : null}
                message={
                  isLargeScreen
                    ? "Connecting Soulmate Takes Care of Your Privacy & Security"
                    : "Oops! No user found. Send or Accept Interest Request to start chat"
                }
              />
            </div>

            <p className="mt-5 mr-7 md:block hidden">
              Send or Accept Interest Request to Start Chat
            </p>
          </>
        ) : (
          sortedChatUsers.map((item, index) => {
            const messageDateString = formatDate(item.lastMessage.createdAt);
            return (
              <div
                key={index}
                onClick={() => {
                  handleUserClick(item);
                }}
                className={`md:w-96 font-DMsans md:mr-7 mx-6 md:mx-0 rounded-lg py-3 md:mt-1 mt-3 relative  ${
                  currentConversation?._id === item?._id
                    ? "md:bg-[#A9252533] bg-[#FCFCFC]"
                    : "bg-[#FCFCFC]"
                } cursor-pointer`}
              >
                <span className="flex justify-start pl-3">
                  <span>
                    <img
                      src={item?.profilePictureUrl || ""}
                      alt=""
                      onError={(e) => (e.target.src = defaultImage)}
                      className="rounded-full w-16 h-16"
                    />
                    {item?.isOnline && (
                      <span className="absolute bottom-5 md:left-16 left-[62px] w-4 h-4 bg-green-500 rounded-full"></span>
                    )}
                  </span>

                  <span className="flex flex-col pr-5 w-44 pl-5">
                    <p className="text-[#2E2E2E] text-[18px] font-montserrat font-semibold">
                    {truncateName(capitalizeWord(item.userName))}

                    </p>
                    <span className="flex items-center w-56">
                      <p className="font-extralight text-[16px] text-black">
                        {item.lastMessage.text ? (
                          item.lastMessage.text.slice(0, 20)
                        ) : (
                          <span className="text-primary">Start Chat</span>
                        )}
                      </p>
                      <span className="ml-2">
                        {item.lastMessage?.sender === userId &&
                          (item?.lastMessage?.seen === true ? (
                            <span className="text-blue-500">
                              {" "}
                              <RiCheckDoubleLine />{" "}
                            </span>
                          ) : (
                            <span className="text-[#696868]">
                              <RiCheckDoubleLine />
                            </span>
                          ))}
                      </span>
                    </span>

                    {item?.lastMessage?.seen === false &&
                      (item?.lastMessage?.receiver === userId ? (
                        <span className="bg-primary rounded-full text-white text-[10px] font-light px-2 absolute md:right-[32px] right-[5px] bottom-7">
                          New
                        </span>
                      ) : (
                        ""
                      ))}
                  </span>

                  <span className="font-light text-[12px] flex justify-end md:w-24 min-w-16 pr-2 sm:w-96">
                    {messageDateString}
                  </span>
                </span>
              </div>
            );
          })
        )}
      </div>
    </>
  );
};

export default ChatSidebar;
