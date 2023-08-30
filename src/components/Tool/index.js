import { Box, Button, Divider, Flex, Grid, GridItem, Text, Textarea, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useApp } from '../../context';
import axios from 'axios';
import { ALERT_STATUS } from '../../ultis/constant';
import moment from 'moment/moment';

const Tool = ({ voice }) => {
	const [loading, setLoading] = useState(false);
	const [form, setForm] = useState([]);
	const { sendAlert } = useApp();
	const [modal, setModal] = useState(false);
	const [buttonDisabled, setButtonDisabled] = useState(true);

	const handleGenerateFile = (file, id) => {
		let blob = new Blob([file], { type: 'audio/mpeg' });
		let url = URL.createObjectURL(blob);
		setForm(prevForm => prevForm.map(item => (item.id === id ? { ...item, url: url } : item)));
	};

	const handleChangeText = (ev, idx) => {
		const value = ev.target.value;
		setForm(prevForm => prevForm.map((item, i) => (i === idx ? { ...item, text: value } : item)));
	};

	const checkFormEmpty = () => {
		return form.filter(item => item.text.trim() !== '');
	};

	const postAPI = async text => {
		try {
			const response = await axios.request({
				url: `https://api.elevenlabs.io/v1/text-to-speech/${voice}`,
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'audio/mpeg',
					'xi-api-key': process.env.REACT_APP_API_KEY || 'your-default-api-key',
				},
				data: JSON.stringify({
					text,
				}),
				responseType: 'arraybuffer',
			});
			return response.data;
		} catch (error) {
			sendAlert('Create file', error.message, ALERT_STATUS['error']);
		}
	};

	const handleChangeTextToSpeech = async () => {
		setLoading(true);
		const data = checkFormEmpty();

		if (data.length > 0) {
			try {
				await Promise.all(
					data.map(async item => {
						try {
							const audioData = await postAPI(item.text);
							handleGenerateFile(audioData, item.id);
						} catch (error) {
							sendAlert('Create file', error.message, ALERT_STATUS.error);
						}
					})
				);
				setButtonDisabled(false);
				setLoading(false);
				sendAlert('Create File', 'Success!', ALERT_STATUS.success);
			} catch (error) {
				sendAlert('Create file', error.message, ALERT_STATUS.error);
				setLoading(false);
			}
		} else {
			setLoading(false);
			sendAlert('Create file', 'Chưa có nội dung hoặc chưa có voice id! Kiểm tra lại!', ALERT_STATUS.error);
		}
	};

	return (
		<>
			<Text fontSize={'30px'} color={'tomato'} fontWeight={'bold'}>
				Tool
			</Text>
			<Text fontStyle={'italic'}>{`ID: ${voice !== '' ? voice : 'Chưa voice nào được chọn!'}`}</Text>
			<Divider mb={'8px'} mt={'16px'} />
			<Grid templateColumns={'repeat(12, 1fr)'} gap={4}>
				<GridItem colSpan={12}>
					<Flex gap={4} marginBottom={'8'}>
						<Button
							isDisabled={!voice}
							background={'Highlight'}
							color={'yellow.500'}
							onClick={() => {
								setButtonDisabled(true);
								const today = new Date();
								let newForm = {
									id: moment(today).format('YYMMDDhhmmssSS'),
									text: '',
									url: '',
								};
								setForm([...form, newForm]);
							}}>
							Thêm ô text
						</Button>
						<Button isDisabled={!voice || form.length < 1} background={'green.400'} isLoading={loading} onClick={handleChangeTextToSpeech}>
							Tạo File Giọng Nói
						</Button>
						<Button
							isDisabled={form.length < 1}
							colorScheme='cyan'
							onClick={() => {
								setForm([]);
							}}>
							Xóa dữ liệu
						</Button>
						<Button colorScheme='messenger' isDisabled={buttonDisabled || form.length < 1} onClick={() => setModal({ ...modal, open: true })}>
							{`Xem danh sách audio`}
						</Button>
					</Flex>
					{form.length > 0 &&
						form.map((_i, idx) => {
							return (
								<Box key={idx}>
									<Flex marginBottom={'2'} gap={2}>
										<Text>{_i.id}.</Text>
										<Textarea placeholder='Nội dung' value={form[idx].text} onChange={ev => handleChangeText(ev, idx)} />
										<Button
											colorScheme='red'
											onClick={() => {
												const updateForm = [...form];
												let idx = updateForm.findIndex(_it => _it.id === _i.id);
												updateForm.splice(idx, 1);
												setForm(updateForm);
											}}>
											Xóa ô
										</Button>
									</Flex>
									<Divider mb={'6'} mt={'6'} />
								</Box>
							);
						})}
				</GridItem>
			</Grid>
			<Modal isOpen={modal} onClose={() => setModal(false)}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>
						<Text variant={'h2'}>Danh sách audio</Text>
						<Text fontSize={'12px'} fontWeight={'normal'}>
							Ấn vào dấu 3 chấm để tải về
						</Text>
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Box padding={'8px 0 24px'}>
							{form
								.filter(_i => _i.url !== '')
								.map((item, idx) => {
									const { id, url } = item;

									return (
										<Grid templateColumns={'repeat(12, 1fr)'} gap={1} key={idx} mb={'8px'}>
											<GridItem colSpan={12}>
												<Text textOverflow={'ellipsis'}>{id}</Text>
											</GridItem>
											<GridItem colSpan={12}>
												<audio controls>
													<source src={url} type='audio/mpeg' />
												</audio>
											</GridItem>
										</Grid>
									);
								})}
						</Box>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
};

export default Tool;
