import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { store } from "./Stores/Store";
import { Provider } from "react-redux";
import { StyledEngineProvider } from "@mui/material";

// const persistor = persistStore(store);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <StyledEngineProvider injectFirst>
      <BrowserRouter>
        {/* <PersistGate loading={<div className = "md:mt-80 mt-96"><Loading3/></div>} persistor={persistor}>    */}
               <App />
        {/* </PersistGate> */}
      </BrowserRouter>
    </StyledEngineProvider>
  </Provider>
);
