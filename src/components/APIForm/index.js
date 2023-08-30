import { ChevronDownIcon } from '@chakra-ui/icons';
import { Menu, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, MenuButton, MenuList, MenuItem, Button, Flex, Text, Box, Grid, GridItem, Input, ModalFooter } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useApp } from '../../context';
import { ALERT_STATUS } from '../../ultis/constant';

const APIForm = ({ onChooseKey }) => {
	const [listKey, setListKey] = useState(() => {
		const data = localStorage.getItem('api-key');
		if (data) {
			return JSON.parse(data);
		} else {
			return [];
		}
	});
	const [modal, setModal] = useState(false);
	const [key, setKey] = useState('');
	const [chooseKey, setChooseKey] = useState('');

	const { sendAlert } = useApp();

	const handleSaveKey = () => {
		let idx = Array.from(listKey).findIndex(_i => _i === key);
		if (idx !== -1) {
			setModal(false);
			sendAlert('Thêm key', 'Key đã tồn tại! Hãy thêm key khác!', ALERT_STATUS['warning']);
		} else {
			listKey.push(key);
			localStorage.setItem('api-key', JSON.stringify(listKey));
			sendAlert('Thêm key', 'Thêm thành công!', ALERT_STATUS['success']);
			setModal(false);
		}
	};

	return (
		<Box>
			<Flex flexDirection={'column'}>
				<Flex justifyContent={'space-between'}>
					<Box>
						<Text fontSize={'24px'} fontWeight={'bold'} color={'tomato'}>
							Cấu hình API KEY
						</Text>
						<Text mb={'10'}>Bấm chọn 1 key ở bên dưới hoặc thêm key mới</Text>
					</Box>
					<Box>
						<Button onClick={() => setModal(true)} colorScheme='twitter'>
							Thêm key mới
						</Button>
					</Box>
				</Flex>
				<Grid>
					<GridItem colSpan={6}>
						<Menu>
							<MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
								{chooseKey || 'Chọn key'}
							</MenuButton>
							<MenuList>
								{listKey &&
									listKey.map((_i, idx) => {
										return (
											<MenuItem
												key={idx}
												onClick={() => {
													setChooseKey(_i);
													onChooseKey && onChooseKey(_i);
												}}>
												<Grid templateColumns={`repeat(12, 1fr)`} gap={2}>
													<GridItem colSpan={10}>
														<Text>{_i}</Text>
													</GridItem>
													<GridItem colSpan={2}>
														<Button
															isDisabled={_i === 'e9a7ae8f235b8fe220318954f1c906be'}
															colorScheme='orange'
															onClick={() => {
																if (window.confirm('Bạn chắc chắn muốn xóa key này? Lưu ý hành động sẽ không quay lại được!')) {
																	const updateList = [...listKey];
																	updateList.splice(idx, 1);
																	setListKey(updateList);
																	localStorage.setItem('api-key', JSON.stringify(updateList));
																}
															}}>
															Xóa key
														</Button>
													</GridItem>
												</Grid>
											</MenuItem>
										);
									})}
							</MenuList>
						</Menu>
					</GridItem>
				</Grid>
			</Flex>

			<Modal isOpen={modal} onClose={() => setModal(false)}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>
						<Text variant={'h2'}>Thêm key</Text>
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Box padding={'8px 0 24px'}>
							<Input value={key} onChange={ev => setKey(ev.target.value)} />
						</Box>
					</ModalBody>
					<ModalFooter>
						<Flex gap={4}>
							<Button
								colorScheme='red'
								onClick={() => {
									setKey('');
									setModal(false);
								}}>
								Hủy bỏ
							</Button>
							<Button onClick={handleSaveKey} colorScheme='green'>
								Lưu key
							</Button>
						</Flex>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</Box>
	);
};

export default APIForm;
