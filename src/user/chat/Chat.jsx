import React, { useState, useEffect, useRef, useCallback } from "react";
import { MdBlock, MdSend } from "react-icons/md";
import Header from "../../components/Header";
import ChatSidebar from "./ChatSidebar";
import { ChatDataNotFound, ChatNotFound } from "../../components/DataNotFound";
import DeleteChatPopup from "./DeleteChatPopUp";
import ReportPopup from "./ReportPopUp";
import { IoMdThumbsDown } from "react-icons/io";
import { userDataStore } from "../../Stores/slices/AuthSlice";
import {
  fetchMessages,
  setConversations,
  setCurrentMessageStatus,
  setIsScrollTrack,
  setMessages,
  setUpdateCurrPage,
} from "../../Stores/slices/chatSlice";
import { useDispatch, useSelector } from "react-redux";
import apiurl, { capitalizeWord } from "../../util";
import { RiCheckDoubleLine } from "react-icons/ri";
import { FaAngleDown } from "react-icons/fa";
import { ChatHeader } from "../../components/ChatHeader";
import { IoArrowBackOutline } from "react-icons/io5";
import { Link, useLocation } from "react-router-dom";
import { defaultImage, dnf, nochat } from "../../assets";
import { toast } from "react-toastify";
import ChatBlockCon from "./../PopUps/ChatBlockCon";
import ChatBlockWarn from "../PopUps/ChatBlockWarn";

const Chat = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [recieverVisible, setRecieverVisible] = useState(false);
  const menuRef = useRef(null);
  const recRef = useRef(null);
  const [page, setPage] = useState(1);
  const chatContainerRef = useRef(null);
  const { userId, channelId } = useSelector(userDataStore);
  const {
    messages,
    currentConversation,
    currentMessageStatus,
    chatUsers,
    hasMore,
    scrollTrack,
    status,
    currentPage,
  } = useSelector((state) => state.chat);
  const [newMessage, setNewMessage] = useState("");
  const [editMessage, setEditMessage] = useState("");
  const dispatch = useDispatch();
  const currentConversationIdRef = useRef(currentConversation?._id);
  const [isDeleteChatOpen, setIsDeleteChatOpen] = useState(false);
  const [isDeleteReportOpen, setIsDeleteReportOpen] = useState(false);
  const [lastSenderMessageIndex, setLastSenderMessageIndex] = useState(-1);
  const [lastReceiverMessageIndex, setLastReceiverMessageIndex] = useState(-1);
  const [isPageIncremented, setIsPageIncremented] = useState(false);
  const [visibleOptions, setVisibleOptions] = useState({});
  const [isUserType, setIsUserType] = useState("");
  const [ischatData, setIsChatData] = useState({});
  const [isLastMessage, setislastMessage] = useState();
  const [openChatBlockPop, setIsOpenChatBlockPop] = useState(false);
  const [isOpenBlockWarn, setIsOpenBlockWarn] = useState(false);

 
  useEffect(() => {
    dispatch(
      fetchMessages({
        page: currentPage,
        limit: 20,
        chatInitiatedBy: userId,
        chatInitiatedTo: currentConversation?._id,
      })
    );
  }, [dispatch, currentPage, userId, currentConversation]);

  useEffect(() => {
    dispatch({ type: "ON_CHAT_PAGE" });
  }, [messages]);

  const handleToggleOptions = (messageIndex) => {
    setVisibleOptions((prevState) => ({
      ...prevState,
      [messageIndex]: !prevState[messageIndex],
    }));
  };

  // ******************************** popups starts ******************************** //
  const openBlockPop = () => {
    setIsOpenChatBlockPop(true);
  };
  const openBlockWarnPop = () => {
    setIsOpenBlockWarn(true);
  };
  const chatBlockClose = () => {
    setIsOpenChatBlockPop(false);
  };
  const closeBlockPopWarn = () => {
    setIsOpenBlockWarn(false);
  };
  const openDeleteReportPopup = () => {
    setIsDeleteReportOpen(true);
  };

  const closeDeleteReport = () => {
    setIsDeleteReportOpen(false);
    setTimeout(() => {
      openBlockWarnPop();
    }, 2000);
  };
  const closeDeleteReportbutton = () => {
    setIsDeleteReportOpen(false);
  };
  const openDeleteChatPopup = (textData, isLastSenderMessage) => {
    setIsDeleteChatOpen(true);
    let userType;
    if (userId === textData.sender) {
      userType = "sender";
    } else {
      userType = "receiver";
    }
    setIsUserType(userType);
    setIsChatData(textData);
    setislastMessage(isLastSenderMessage);
  };

  const closeDeleteChat = () => {
    setIsDeleteChatOpen(false);
  };
  // ******************************** popups ends ******************************** //

  // ******************************** message menu starts ******************************** //
  const handleClickOutside = (event) => {
    event.preventDefault();
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setMenuVisible(false);
    }
    if (recRef.current && !recRef.current.contains(event.target)) {
      setRecieverVisible(false);
    }
    // Hide options menu if click outside
    if (event.target.closest(".edit-button")) {
      setTimeout(() => {
        setVisibleOptions({});
      }, 300);
    }
    if (event.target.closest(".delete-button")) {
      setTimeout(() => {
        setVisibleOptions({});
      }, 300);
    }
    if (
      !event.target.closest(".options-menu") &&
      !event.target.closest(".edit-button") &&
      !event.target.closest(".delete-button")
    ) {
      setVisibleOptions({});
    }
  };

  useEffect(() => {
    if (
      menuVisible ||
      recieverVisible ||
      Object.values(visibleOptions).some((visible) => visible)
    ) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuVisible, recieverVisible, visibleOptions]);

  // ******************************** message menu ends ******************************** //

  useEffect(() => {
    checkMessages();
    const handleVisibilityChange = () => {
      checkMessages();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [dispatch, messages, userId]);

  // ******************************** chat events starts ******************************** //

  const handleSubmit = (e, conversation) => {
    e.preventDefault();
    if (newMessage.trim() !== "") {
      if (currentMessageStatus === "edit") {
        let message = { ...editMessage };
        dispatch({
          type: "EDIT_MESSAGE",
          payload: {
            messageId: message?._id,
            senderId: userId,
            receiverId: message.receiver,
            editedMessage: newMessage,
          },
        });
        setEditMessage("");
      } else {
        dispatch({
          type: "SEND_MESSAGE",
          payload: {
            senderId: userId,
            recieverId: conversation?._id,
            newMessage,
            channelId: channelId,
          },
        });
      }
    }
    setNewMessage("");
  };

  const handleEditMessage = (messageData) => {
    dispatch(setCurrentMessageStatus("edit"));
    setEditMessage(messageData);
    setNewMessage(messageData.text);
  };

  const handleDeleteMessage = (textData, userType) => {
    let senderId;
    let receiverId;
    if (userType === "sender") {
      senderId = textData.sender;
      receiverId = textData.receiver;
    } else {
      senderId = textData.receiver;
      receiverId = textData.sender;
    }
    dispatch({
      type: "DELETE_MESSAGE",
      payload: {
        userType,
        messageId: textData?._id,
        receiverId,
        senderId,
      },
    });
  };

  const checkMessages = () => {
    if (document.visibilityState === "visible") {
      // Log messages to debug

      if (Array.isArray(messages)) {
        messages.forEach((message) => {
          if (!message.seen && message.receiver === userId) {
            dispatch({
              type: "ON_MESSAGE_SEEN",
              payload: {
                receiverId: userId,
                messageId: message._id,
                senderId: message.sender,
              },
            });
          }
        });
      } else {
        console.warn("Messages is not an array:", messages);
      }
    }
  };

  // ******************************** chat events ends ************************** //

  // ************************** timimg format methods starts ************************** //

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (timestamp) => {
    const today = new Date();
    const messageDate = new Date(timestamp);

    // Normalize dates to remove time component
    const todayDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const messageDateOnly = new Date(
      messageDate.getFullYear(),
      messageDate.getMonth(),
      messageDate.getDate()
    );

    // Calculate the difference in days
    const diffDays = Math.floor(
      (todayDate - messageDateOnly) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      // Show weekday name for dates within the last week
      return messageDateOnly.toLocaleDateString(undefined, { weekday: "long" });
    } else {
      // Show full date for dates older than a week
      const formattedDate = `${messageDateOnly.getDate()} ${messageDateOnly.toLocaleString(
        "default",
        { month: "long" }
      )} ${messageDateOnly.getFullYear()}`;
      return formattedDate;
    }
  };

  // ************************** timimg format methods ends ************************** //

  useEffect(() => {
    // Update last message indices when messages change
    if (messages?.length > 0) {
      let lastSenderIndex = -1;
      let lastReceiverIndex = -1;

      for (let i = messages.length - 1; i >= 0; i--) {
        if (lastSenderIndex === -1 && messages[i].sender === userId) {
          lastSenderIndex = i;
        }
        if (
          lastReceiverIndex === -1 &&
          messages[i].sender === currentConversation?._id
        ) {
          lastReceiverIndex = i;
        }
        if (lastSenderIndex !== -1 && lastReceiverIndex !== -1) {
          break;
        }
      }

      setLastSenderMessageIndex(lastSenderIndex);
      setLastReceiverMessageIndex(lastReceiverIndex);
    }
  }, [messages, userId, currentConversation]);

  // ************************** scroll related section starts ************************** //

  const handleScroll = () => {
    if (!chatContainerRef.current) return;
    const { scrollTop } = chatContainerRef.current;

    if (scrollTop === 0 && hasMore && !isPageIncremented && !scrollTrack) {
      setIsPageIncremented(true);
      dispatch(setUpdateCurrPage(currentPage + 1));
    }
  };

  const scrollToTwentiethMessage = () => {
    const chatContainerChildren = chatContainerRef.current.children;
    console.log(chatContainerChildren);

    if (chatContainerChildren.length >= 0) {
      const secondObject = chatContainerChildren[0].children; // Accessing the second object
      let targetIndex = 20;
      // console.log(targetIndex, "targetIndex");

      if (secondObject.length > targetIndex) {
        const targetChild = secondObject[targetIndex]; // Accessing the child at the target index
        // console.log(targetChild);

        if (targetChild) {
          chatContainerRef.current.scrollTo({
            top: targetChild.offsetTop,
            behavior: "auto", // Smooth for a better user experience
          });

          // Disable further scrolling by adding an event listener
          const disableScroll = (e) => {
            e.preventDefault();
            e.stopPropagation();
            return false;
          };

          chatContainerRef.current.addEventListener("scroll", disableScroll, {
            passive: false,
          });

          // Re-enable scrolling after a delay
          setTimeout(() => {
            chatContainerRef.current.removeEventListener(
              "scroll",
              disableScroll
            );
          }, 2000); // Adjust the delay as needed
        }
      } else {
        console.error("The second object does not have enough children.");
      }
    } else {
      console.error("The chat container does not have 2 children.");
    }
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  // scroll listener to handle infinite scrolling as soon as we reach the top of the scrollable area
  useEffect(() => {
    const scrollContainer = chatContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, [hasMore, scrollTrack, currentPage, status, isPageIncremented]);

  //scroll to bottom whenever a conversation is selected
  useEffect(() => {
    if (currentConversation?._id === currentConversationIdRef.current) {
      scrollToBottom();
    } else if (messages.length <= 20) {
      scrollToBottom();
    }
  }, [currentConversation, messages]);

  // call the scroll to 20th message when messages are added and page incremented accordingly
  // this prevent simultaneously calling of APIS for pages
  useEffect(() => {
    if (status === "succeeded" && isPageIncremented) {
      scrollToTwentiethMessage();
      setIsPageIncremented(false); // Reset after scrolling
    }
  }, [status, isPageIncremented]);

  // ************************** scroll related section ends ************************** //

  const isMessageSeenByReceiver = (message) => {
    return message.seen && message.sender === userId;
  };

  const handleReportUser = async (senderId, reviewText, receiverId) => {
    try {
      const response = await apiurl.post("/report-users", {
        reportedBy: senderId,
        reportedOne: receiverId,
        description: reviewText,
      });

      toast.success("User reported successfully");
      return;
    } catch (err) {
      toast.error("Something went wrong");
      console.log(err);
    }
  };

  const handleBlockUser = async (blockUserId) => {
    try {
      const response = await apiurl.post("/block-user", {
        blockUserId: blockUserId,
      });
      dispatch({ type: "ON_CHAT_PAGE" });
      dispatch(setConversations(null));
      toast.success("User blocked successfully");
      return;
    } catch (err) {
      toast.error("Something went wrong");
      console.log(err);
    }
  };
  return (
    <>
      <span className="hidden ">
        <ChatHeader />
      </span>
      {chatUsers?.length === 0 ? (
        <span className="md:block hidden">
          <span className="flex">
            <Header />
          </span>

          <div className="flex justify-center items-center md:mt-48 mt-20 w-full sm:mt-60 md:bloc">
            <ChatNotFound
              custimg={dnf}
              className={"flex flex-col  justify-center items-center"}
              linkText={"Explore Your Matches"}
              linkDestination={"/all-matches"}
              message={
                "Opps! No Chat Found, Send or Accept Interest Request to Start Chatting "
              }
            />
          </div>
        </span>
      ) : (
        <>
          <div className="  ">
            <span className="fixed  overflow-y-scroll h-[90%] scrollbar-hide md:block hidden">
              <ChatSidebar />
            </span>
            <div className="bg-white flex flex-col md:ml-[35%] mr-6  ">
              <div>
                {currentConversation ? (
                  <>
                    <div className="bg-primary fixed    z-10 items-center font-DMsans w-full  md:w-[63%]  md:rounded-t-2xl rounded-b-2xl px-3 md:px-9 sm:px-9 py-3 md:mt-32">
                      <span className="flex items-center">
                        <Link
                          to="/chat-list-interest-accepted"
                          className="text-white pr-2 text-[22px] md:hidden"
                        >
                          <IoArrowBackOutline />
                        </Link>
                        <span className="relative">
                          <Link
                            to="/profile"
                            state={{
                              userId: currentConversation?._id,
                              location: location.pathname,
                            }}
                          >
                            <img
                              src={currentConversation?.profilePictureUrl}
                              onError={(e) => (e.target.src = defaultImage)}
                              alt=""
                              className="rounded-full w-12 h-12 "
                            />
                          </Link>
                        </span>
                        {currentConversation.isOnline && (
                          <span className="absolute bottom-5 md:left-[75px] left-[80px] sm:left-[105px] w-3 h-3 bg-green-500 rounded-full "></span>
                        )}
                        <span className="flex flex-col mx-3 text-white">
                          <p className="truncate-data">
                            {capitalizeWord(currentConversation?.userName)}
                          </p>

                          {currentConversation.isOnline ? (
                            <p className="font-extralight text-[12px]">
                              Active Now
                            </p>
                          ) : (
                            <p className="font-extralight text-[12px]">
                              Offline
                            </p>
                          )}
                        </span>

                        <span
                          className="text-white text-[23px] cursor-pointer absolute right-16"
                          onClick={openDeleteReportPopup}
                        >
                          <IoMdThumbsDown />
                        </span>
                        <span
                          onClick={openBlockPop}
                          className="text-white text-[23px] cursor-pointer absolute right-6"
                        >
                          <MdBlock />
                        </span>
                      </span>
                    </div>

                    <div
                      ref={chatContainerRef}
                      className="chat-container overflow-y-scroll  bg-white  md:h-[60vh] xl:h-[66vh] sm:h-[88vh] h-[78vh] mt-20 md:mt-[200px] sm:mt-20"
                    >
                      <div className="text-white mt-20 mb-32 ">
                        {messages?.length > 0 &&
                          messages?.map((textData, index) => {
                            const isLastSenderMessage =
                              index === lastSenderMessageIndex;
                            const messageDateString = formatDate(
                              textData.createdAt
                            );
                            const isSender = textData.sender === userId;
                            const optionsVisible = visibleOptions[index];
                            const isFirstMessage = index === 0;

                            return (
                              ((userId === textData.sender &&
                                textData.senderVisible === true) ||
                                (userId === textData.receiver &&
                                  textData.receiverVisible === true)) && (
                                <>
                                  <div key={index}>
                                    {(index === 0 ||
                                      formatDate(
                                        messages[index - 1].createdAt
                                      ) !== messageDateString) && (
                                      <div className="text-center py-1 text-black font-semibold pt-6">
                                        {messageDateString}
                                      </div>
                                    )}

                                    <div
                                      className={`flex flex-row justify-${
                                        isSender ? "end" : "start"
                                      } mt-4 md:mx-3  mx-6`}
                                    >
                                      <div
                                        className={`flex items-start ${
                                          isSender
                                            ? " border border-primary"
                                            : "bg-[#ffdcdc]"
                                        } rounded-md relative`}
                                      >
                                        <div className="flex  items-end pr-2 pb-1">
                                          <p
                                            className={`p-2 ${
                                              isSender
                                                ? "text-black"
                                                : "text-black"
                                            } overflow-hidden md:max-w-96 max-w-52 min-h-9`}
                                          >
                                            {textData.text}
                                          </p>

                                          <span
                                            className={`${
                                              isSender
                                                ? "text-black"
                                                : "text-black"
                                            } ml-1 text-[10px] min-w-12`}
                                          >
                                            {formatTime(textData.createdAt)}
                                          </span>

                                          <p
                                            className={`message-status text-[18px] px-1 ${
                                              isMessageSeenByReceiver(textData)
                                                ? "seen"
                                                : "unseen"
                                            } ${isSender ? "block" : "hidden"}`}
                                          >
                                            {isMessageSeenByReceiver(
                                              textData
                                            ) ? (
                                              <span className="text-blue-500">
                                                <RiCheckDoubleLine />
                                              </span>
                                            ) : (
                                              <span className="text-[#696868]">
                                                <RiCheckDoubleLine />
                                              </span>
                                            )}
                                          </p>
                                        </div>

                                        <span
                                          className={`cursor-pointer ${
                                            isSender
                                              ? "text-black"
                                              : "text-black"
                                          } text-[15px] absolute right-2 top-1`}
                                          onClick={() =>
                                            handleToggleOptions(index)
                                          }
                                        >
                                          <FaAngleDown />
                                        </span>

                                        {optionsVisible && (
                                          <div
                                            className={`absolute top-4 right-0 mt-2 py-1 bg-white rounded-md z-10 shadow-lg ${
                                              isSender
                                                ? "bg-primary"
                                                : "bg-[#fcf6f6]"
                                            }`}
                                          >
                                            {isLastSenderMessage && (
                                              <button
                                                onClick={() =>
                                                  handleEditMessage(textData)
                                                }
                                                className="edit-button block px-4 py-2 text-sm text-black w-full text-left"
                                              >
                                                Edit
                                              </button>
                                            )}
                                            {(isSender ||
                                              textData.sender ===
                                                currentConversation?._id) && (
                                              <button
                                                className="delete-button block px-4 py-2 text-sm text-black w-full text-left "
                                                onClick={() =>
                                                  openDeleteChatPopup(
                                                    textData,
                                                    isLastSenderMessage
                                                  )
                                                }
                                              >
                                                {isSender && isLastSenderMessage
                                                  ? "Delete for everyone"
                                                  : "Delete for me"}
                                              </button>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                    {/* <div ref={chatContainerRef}></div> */}
                                  </div>
                                </>
                              )
                            );
                          })}
                      </div>
                    </div>
                    <div className="fixed bottom-0 md:pl-[32%] right-0     w-full pb-6 rounded-2xl">
                      <form
                        className="flex items-center justify-between py-4 px-8"
                        onSubmit={(e) => handleSubmit(e, currentConversation)}
                      >
                        <input
                          type="text"
                          className="flex-grow bg-gray-100 border border-gray-300 rounded-l-md p-3 "
                          placeholder="Write your message"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                        />
                        <button
                          type="submit"
                          className="bg-primary text-white p-3 rounded-r-md flex items-center justify-center"
                        >
                          <MdSend className="text-2xl" />
                        </button>
                      </form>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-center items-center md:mt-48 mt-20 w-full sm:mt-60 ">
                    <ChatDataNotFound
                      custimg={nochat}
                      className={"flex flex-col  justify-center items-center"}
                      linkText={"Start Chat Now "}
                      linkDestination={"/chat-list-interest-accepted"}
                      message={
                        "Connecting Soulmate Takes Care of Your Privacy & Security"
                      }
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
      <DeleteChatPopup
        isDeleteChatOpen={isDeleteChatOpen}
        closeDeleteChat={closeDeleteChat}
        isUserType={isUserType}
        ischatData={ischatData}
        handleDeleteMessage={handleDeleteMessage}
        isLastMessage={isLastMessage}
      />
      <ReportPopup
        isDeleteReportOpen={isDeleteReportOpen}
        closeDeleteReport={closeDeleteReport}
        handleReportUser={handleReportUser}
        userId={userId}
        closeDeleteReportbutton={closeDeleteReportbutton}

      />
      <ChatBlockCon
        handleBlockUser={handleBlockUser}
        openChatBlockPop={openChatBlockPop}
        chatBlockClose={chatBlockClose}
        currentConversation={currentConversation}
      />
      <ChatBlockWarn
        closeBlockPopWarn={closeBlockPopWarn}
        isOpenBlockWarn={isOpenBlockWarn}
      />
    </>
  );
};

export default Chat;
