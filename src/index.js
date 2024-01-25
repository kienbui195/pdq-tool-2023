import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { AppContextProvider } from "./context";
import APIForm from "./components/APIForm";
import TableVoice from "./components/TableVoice";
import Tool from "./components/Tool";
import App from "./pages/App";
import Header from "./components/Header";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ChakraProvider>
    <AppContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route path="api" element={<APIForm />} index={true} />
            <Route path="voices" element={<TableVoice />} />
            <Route path="tool" element={<Tool />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppContextProvider>
  </ChakraProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
