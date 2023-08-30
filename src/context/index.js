import React, { createContext, useContext, useState } from 'react';
import { ALERT_STATUS } from '../ultis/constant';
import { Box, useToast } from '@chakra-ui/react';
import ModalCustom from '../components/ModalCustom';

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
	const toast = useToast();
	const [modal, setModal] = useState({
		open: false,
		title: '',
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
			position: 'top-right',
			title,
			description: message,
			status: ALERT_STATUS[status],
			duration: 3000,
			isClosable: true,
		});
	};

	return (
		<AppContext.Provider value={{ sendAlert, showModal, closeModal }}>
			<Box>{children}</Box>
			<ModalCustom noFooter={modal.noFooter} isOpen={modal.open} onClose={closeModal} children={modal.children} title={modal.title} onConfirm={modal.onConfirm} />
		</AppContext.Provider>
	);
};

export const useApp = () => {
	const context = useContext(AppContext);
	return context;
};
