import React from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, ModalFooter, Button, Box } from '@chakra-ui/react';

const ModalCustom = ({ title, isOpen, onClose, children = <></>, onConfirm, noFooter = false }) => {
	return (
		<Modal isOpen={isOpen} onClose={() => onClose && onClose()}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>{title}</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<Box padding={'8px 0 24px'}>{children}</Box>
				</ModalBody>
				{!noFooter && (
					<ModalFooter>
						<Button colorScheme='blue' mr={3} onClick={() => onClose && onClose()}>
							Cancel
						</Button>
						<Button colorScheme='green' onClick={() => onConfirm && onConfirm()}>
							Confirm
						</Button>
					</ModalFooter>
				)}
			</ModalContent>
		</Modal>
	);
};

export default ModalCustom;
