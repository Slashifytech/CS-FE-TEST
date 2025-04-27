// middleware/socketMiddleware.js
import { io } from "socket.io-client";
import { setChannelId } from "../slices/AuthSlice";
import {
  setMessages,
  setChatUsers,
  addMessage,
  setConversations,
  editMessage,
  deleteMessage,
  setMessageStatus,
  setCurrentMessageStatus,
  setUnseenMessageStatus,
} from "../slices/chatSlice";

const socketMiddleware = (store) => {
  
  let socket = null;

  return (next) => (action) => {
    switch (action.type) {
      case "SOCKET_CONNECT":
        if (socket) {
          socket.close();
        }
        socket = io(import.meta.env.VITE_APP_DEV_BASE_URL, {
          reconnection: true,
          reconnectionAttempts: Infinity, // Maximum attempts to reconnect
          reconnectionDelay: 1000, // Initial delay before attempting reconnection
          reconnectionDelayMax: 5000, // Maximum delay before attempting reconnection
          randomizationFactor: 0.5, // Randomization factor for the delay
        });
        socket.on("connect", () => {
          console.log("WebSocket connected");
          const state = store.getState();
          const { userId } = state.auth;
          socket.emit("ONLINE", userId);
          socket.emit("ON_CHAT_PAGE", userId);
        });
        socket.on("reconnect", () => {
          console.log("WebSocket reconnected");
          const state = store.getState();
          const { userId } = state.auth;
          socket.emit("ONLINE", userId);
          socket.emit("ON_CHAT_PAGE", userId);
        });
        socket.on("disconnect", () => {
          console.log("WebSocket disconnected");
          const state = store.getState();
          const { userId } = state.auth;
          socket.emit("OFFLINE", userId); // Notify server the user is offline
        });

        socket.on("CHAT_LISTING_ON_PAGE", (data) => {
          const state = store.getState();
          const { chatUsers } = state.chat;

          const slicedUserData = chatUsers?.slice(data.page * 40, 40);
          // Compare the incoming data with the current chat users in the state
          // console.log(chatUsers, slicedUserData)

          if (JSON.stringify(slicedUserData) !== JSON.stringify(data)) {
            store.dispatch(setChatUsers(data));
          } else {
            console.log("Chat listing data is the same, not dispatching");
          }
        });

        socket.on("UNSEEN_MESSAGES", (count) => {
          store.dispatch(setUnseenMessageStatus(count));
        });
        socket.on("NEW_MESSAGE", (data) => {
          const state = store.getState();
          const { currentConversation } = state.chat;
          const { userId } = state.auth;
          if (currentConversation) {
            const isCurrentUserSender =
              currentConversation._id === data.receiver &&
              userId === data.sender;
            const isCurrentUserReceiver =
              currentConversation._id === data.sender &&
              userId === data.receiver;

            if (isCurrentUserSender || isCurrentUserReceiver) {
              store.dispatch(addMessage(data));
            }
          } else {
            console.warn(
              "Current conversation is null, cannot process new message."
            );
          }
        });
        socket.on("ON_SEEN", (data) => {
          // console.log(data, "ddd");
          store.dispatch(setMessageStatus(data));
        });
        socket.on("EDIT_MESSAGE", (data) => {
          const state = store.getState();
          const { currentConversation } = state.chat;
          const { userId } = state.auth;
          if (currentConversation) {
            const isCurrentUserSender =
              currentConversation._id === data.receiver &&
              userId === data.sender;
            const isCurrentUserReceiver =
              currentConversation._id === data.sender &&
              userId === data.receiver;

            if (isCurrentUserSender || isCurrentUserReceiver) {
              store.dispatch(editMessage(data));
            }
          } else {
            console.warn(
              "Current conversation is null, cannot process new message."
            );
          }
        });

        socket.on("DELETE_MESSAGE", (data) => {
          // console.log(data);
          const state = store.getState();
          const { currentConversation } = state.chat;
          const { userId } = state.auth;
          if (currentConversation) {
            const isCurrentUserSender =
              currentConversation._id === data.receiver &&
              userId === data.sender;
            const isCurrentUserReceiver =
              currentConversation._id === data.sender &&
              userId === data.receiver;

            if (isCurrentUserSender || isCurrentUserReceiver) {
              store.dispatch(deleteMessage(data));
            }
          } else {
            console.warn(
              "Current conversation is null, cannot process new message."
            );
          }
        });

        socket.on("USER_ONLINE", () => {
          const state = store.getState();
          const { userId } = state.auth;
          socket.emit("ON_CHAT_PAGE", userId);
        });

        socket.on("USER_OFFLINE", () => {
          const state = store.getState();
          const { userId } = state.auth;
          socket.emit("ON_CHAT_PAGE", userId);
        });
        socket.on("ON_BLOCK", (data) => {
          console.log(data)
          const state = store.getState();
          // const { userId } = state.auth;
          // socket.emit("ON_CHAT_PAGE", userId);
          const { currentConversation, chatUsers } = state.chat;
        // Extract blocked user ID from data
  const blockedByUserId = data.blockedBy;

  // Filter out the blocked user from chatUsers
  const updatedChatUsers = chatUsers.filter((user) => user._id !== blockedByUserId);

  // Dispatch the updated chat users list
  
  store. dispatch(setChatUsers(updatedChatUsers));

  // If the current conversation is with the blocked user, set it to null
  if (currentConversation?._id === blockedByUserId) {
     store.dispatch(setConversations(null));
  }

        
        });

        socket.on("disconnect", () => {
          // console.log("WebSocket disconnected");
          const state = store.getState();
          const { userId } = state.auth;

          socket.emit("OFFLINE", userId); // Notify server the user is offline
        });

        break;
      case "ON_CHAT_INITIATED":
        if (socket) {
          socket.emit("ON_CHAT_INITIATED", { ...action.payload });
        }
        break;
      case "EDIT_MESSAGE":
        if (socket) {
          const { editedMessage, messageId, senderId, receiverId } =
            action.payload;
          store.dispatch(setCurrentMessageStatus("new"));
          socket.emit("ON_EDIT_MESSAGE", {
            senderId,
            messageId,
            receiverId,
            message: editedMessage,
          });
        }
        break;

      case "DELETE_MESSAGE":
        if (socket) {
          socket.emit("ON_DELETE_MESSAGE", { ...action.payload });
        }
        break;
      case "ON_MESSAGE_SEEN":
        if (socket) {
          socket.emit("ON_MESSAGE_SEEN", { ...action.payload });
        }
        break;
      case "SOCKET_DISCONNECT":
        if (socket) {
          const state = store.getState();
          const { userId } = state.auth;
          socket.emit("OFFLINE", userId); // Notify server the user is offline
          socket.close();
          socket = null;
        }
        break;

      case "SEND_MESSAGE":
        if (socket) {
          const { senderId, recieverId, newMessage, channelId } =
            action.payload;
          socket.emit("ON_NEW_MESSAGE", {
            sender: senderId,
            receiver: recieverId,
            message: newMessage,
            channelId: channelId,
          });
        }

        break;

      case "UNSEEN_MESSAGES":
        if (socket) {
          const state = store.getState();
          const { userId } = state.auth;
          socket.emit("UNSEEN_MESSAGES", userId);
        }
        break;
      case "ON_CHAT_PAGE":
        if (socket) {
          const state = store.getState();
          const { userId } = state.auth;
          socket.emit("ON_CHAT_PAGE", userId);
        }
        break;
      default:
        return next(action);
    }
  };
};

export default socketMiddleware;
