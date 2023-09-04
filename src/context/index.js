import React, { createContext, useContext, useState } from "react";
import { ALERT_STATUS } from "../ultis/constant";
import { Box, useMediaQuery, useToast } from "@chakra-ui/react";
import ModalCustom from "../components/ModalCustom";

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const toast = useToast();
  const [modal, setModal] = useState({
    open: false,
    title: "",
    children: <></>,
    onConfirm: () => {},
    noFooter: false,
  });

  const showModal = (title, children, onConfirm, noFooter) => {
    setModal({
      ...modal,
      open: true,
      title,
      onConfirm,
      children,
      noFooter,
    });
  };

  const closeModal = () => {
    setModal({
      ...modal,
      open: false,
    });
  };

  const sendAlert = (title, message, status) => {
    toast({
      position: "top-right",
      title,
      description: message,
      status: ALERT_STATUS[status],
      duration: 3000,
      isClosable: true,
    });
  };
  const [isSm] = useMediaQuery("(min-width: 480px)");
  const [isMd] = useMediaQuery("(min-width: 768px)");
  const [isLg] = useMediaQuery("(min-width: 992px)");
  const [isXl] = useMediaQuery("(min-width: 1280px)");
  const [is2xl] = useMediaQuery("(min-width: 1280px)");

  return (
    <AppContext.Provider value={{ sendAlert, showModal, closeModal, isSm, isMd, isLg, isXl, is2xl }}>
      <Box>{children}</Box>
      <ModalCustom noFooter={modal.noFooter} isOpen={modal.open} onClose={closeModal} children={modal.children} title={modal.title} onConfirm={modal.onConfirm} />
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  return context;
};
