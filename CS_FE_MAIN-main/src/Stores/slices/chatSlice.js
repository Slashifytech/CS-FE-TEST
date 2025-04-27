  // slices/ChatSlice.js
  import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
  import apiurl from "../../util";
  
  export const fetchMessages = createAsyncThunk(
  "chat/fetchMessages",
  async ({ page, limit, chatInitiatedBy, chatInitiatedTo }, { getState }) => {
    const response = await apiurl.get("/get-all-messages", {
      params: { page, limit, chatInitiatedBy, chatInitiatedTo },
    });
    return response.data;
  }
);

  const chatSlice = createSlice({
    name: "chat",
    initialState: {
      messages: [],
      chatUsers: [],   // matching with coming id and put in currentConversation?._id for vchat redirections
      currentConversation: null,
      currentMessageStatus: "new",
      unseenMessages: 0,
      currentPage: 1,
      hasMore: true,
      status: "idle",
      scrollTrack: false,
      chatRedirectionId: null,
    },

    reducers: {

      setUpdateCurrPage: (state, action) =>{
        if(state.currentPage !== action.payload){
          state.currentPage = action.payload
        }
      
      },

      setMessages: (state, action) => {

        state.messages = []
      },
      setChatUsers: (state, action) => {
        state.chatUsers = action.payload;
      },
      addMessage: (state, action) => {
        const existingMessage = state.messages.find(
          (message) => message._id === action.payload._id
        );
        if (!existingMessage) {
          state.messages.push(action.payload);
        }
      },
      editMessage: (state, action) => {
        const messageIndex = state.messages.findIndex(
          (message) => message._id === action.payload._id
        );
        if (messageIndex !== -1) {
          state.messages[messageIndex].text = action.payload.text;
        }
      },
      setMessageStatus: (state, action) => {
        action.payload.forEach((updatedMessage) => {
          const messageIndex = state.messages.findIndex(
            (message) => message._id === updatedMessage._id
          );
          if (messageIndex !== -1) {
            state.messages[messageIndex] = updatedMessage;
          }
        });
      },
      setCurrentMessageStatus: (state, action) => {
        state.currentMessageStatus = action.payload;
        
      },
      deleteMessage: (state, action) => {
        // console.log(action.payload);
        const { isToBeDeleted } = action.payload;
        const messageIndex = state.messages.findIndex(
          (message) => message._id === action.payload._id
        );
        if (messageIndex !== -1) {
          if (isToBeDeleted) {
            // Remove the message entirely from state
            state.messages.splice(messageIndex, 1);
          } else {
            state.messages[messageIndex] = action.payload;

            // Optionally remove the message from the state entirely if both visibility flags are false
            if (
              !state.messages[messageIndex].senderVisible &&
              !state.messages[messageIndex].receiverVisible
            ) {
              state.messages.splice(messageIndex, 1);
            }
          }
        }
      },
      setConversations: (state, action) => {
       if(!action.payload){
        state.currentConversation = null;
        state.messages = [];
        state.currentPage =1;
       }
        if (
          !state.currentConversation ||
          state.currentConversation._id !== action.payload._id
        ) {
          state.currentConversation = action.payload;
          state.messages = [];
          state.currentPage = 1;
        
        } else {
          state.currentConversation = action.payload;
        }
  
      },
      removeBlockConversation: (state, action) => {
      
         if (
           state.currentConversation ||
           state.currentConversation?._id === action.payload
         ) {
           state.currentConversation = null;
           state.messages = [];
           state.currentPage = 1;
         } 
       },
      setUnseenMessageStatus: (state, action) => {
        state.unseenMessages = action.payload;
      },

      markMessageAsRead(state, action) {
        const { messageId } = action.payload;
        const message = state.messages.find((msg) => msg._id === messageId);
        if (message) {
          message.seen = true; // Assuming you have a status field in your message object
        }
      },
      setIsScrollTrack(state, action){
        state.scrollTrack = action.payload
        
      },
      setChatRedirection(state, action){
        state.chatRedirectionId = action.payload;
      }
      // other reducers
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchMessages.pending, (state) => {
          state.status = "loading";
          state.scrollTrack = true;
        })
        .addCase(fetchMessages.fulfilled, (state, action) => {
          const newMessages = action.payload;
          newMessages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
          const existingMessageIds = new Set(state.messages.map((msg) => msg._id));
          const uniqueNewMessages = newMessages.filter(
            (msg) => !existingMessageIds.has(msg._id)
          );
          state.messages = [...uniqueNewMessages, ...state.messages];
          state.status = "succeeded";
          state.hasMore = action.payload.length > 0;
          state.scrollTrack = false;
        })
        .addCase(fetchMessages.rejected, (state) => {
          state.status = "failed";
          state.scrollTrack = false;
        });
    }
    
  });
  export const {
    setMessages,
    setChatUsers,
    addMessage,
    editMessage,
    markMessageAsRead,
    deleteMessage,
    setUnseenMessageStatus,
    setConversations,
    setMessageStatus,
    setIsScrollTrack,
    setCurrentMessageStatus,
    removeBlockConversation,
    setUpdateCurrPage,
    setChatRedirection
  } = chatSlice.actions;
  export default chatSlice.reducer;
