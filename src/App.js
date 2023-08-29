import { Box, Tab, TabList, TabPanel, TabPanels, Tabs, Table, Thead, Tbody, Tr, Th, Td, TableContainer, useToast, Button, Text, Divider, Grid, GridItem, Textarea, Input, Link } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ALERT_STATUS = {
	success: 'success',
	error: 'error',
	info: 'info',
	loading: 'loading',
	warning: 'warning',
};

const App = () => {
	const [form, setForm] = useState('');
	const [voices, setVoices] = useState([]);
	const toast = useToast();
	const [voice, setVoice] = useState('');
	const [disabled, setDisabled] = useState(false);
	const [loading, setLoading] = useState(false);
	const [disabledTab, setDisabledTab] = useState(true);
	const [audio, setAudio] = useState(null);

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

	const handleGenerateFile = file => {
		const blob = new Blob([file], { type: 'audio/mpeg' });
		const url = URL.createObjectURL(blob);
		setAudio(url);
	};

	const getListVoice = async () => {
		await axios
			.get('https://api.elevenlabs.io/v1/voices', {
				headers: {
					'Content-Type': 'application/json',
					'xi-api-key': process.env.REACT_APP_API_KEY || 'e9a7ae8f235b8fe220318954f1c906be',
				},
			})
			.then(res => setVoices(res.data.voices))
			.catch(e => {
				sendAlert('Get Voice', e.message, ALERT_STATUS['error']);
			});
	};

	const handleChangeTextToSpeech = () => {
		if (voice.trim() === '' || form.trim() === '') {
			sendAlert('Change Voice', 'Kiểm tra lại đã chọn voice, thêm đủ nội dung hay chưa!', ALERT_STATUS['warning']);
		} else {
			setLoading(true);
			axios
				.request({
					url: `https://api.elevenlabs.io/v1/text-to-speech/${voice}`,
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Accept: 'audio/mpeg',
						'xi-api-key': process.env.REACT_APP_API_KEY || 'e9a7ae8f235b8fe220318954f1c906be',
					},
					data: JSON.stringify({
						text: form,
					}),
				})
				.then(res => {
					handleGenerateFile(res.data);
					setForm('');
					setLoading(false);
				})
				.catch(e => {
					sendAlert('Create file', e.message, ALERT_STATUS['error']);
					setLoading(false);
				});
		}
	};

	useEffect(() => {
		getListVoice();
	}, []);

	useEffect(() => {
		if (form.trim() === '') {
			setDisabled(true);
		} else {
			setDisabled(false);
		}

		if (voice !== '') {
			setDisabledTab(false);
		} else {
			setDisabledTab(true);
		}
	}, [form, voice]);

	return (
		<Box padding='32'>
			<Tabs variant='enclosed' isFitted>
				<TabList>
					<Tab>1. Giọng nói</Tab>
					<Tab isDisabled={disabledTab}>2. Chuyển text thành giọng nói</Tab>
				</TabList>

				<TabPanels>
					<TabPanel>
						<Text fontSize={'30px'} color={'tomato'} fontWeight={'bold'}>
							Danh sách giọng đọc
						</Text>
						<Text>Copy ID của một giọng nói mà bạn muốn rồi chuyển sang tab tiếp theo</Text>
						<Divider marginBottom={'8px'} marginTop={'16px'} />
						<Box>
							<TableContainer>
								<Table variant='simple'>
									<Thead>
										<Tr>
											<Th>ID</Th>
											<Th>Tên</Th>
											<Th>Quốc gia</Th>
											<Th>Độ tuổi</Th>
											<Th>Mô tả</Th>
											<Th>Giới tính</Th>
											<Th>Hành động</Th>
										</Tr>
									</Thead>
									<Tbody maxHeight={'28'} overflowY={'hidden'}>
										{voices.map((_i, _idx) => {
											const { voice_id, labels, name, preview_url } = _i;
											const { accent, age, description, gender } = labels;

											return (
												<Tr key={_idx}>
													<Td>{voice_id}</Td>
													<Td>{name}</Td>
													<Td>{accent}</Td>
													<Td>{age}</Td>
													<Td>{description}</Td>
													<Td>{gender}</Td>
													<Td>
														<Button background={'skyblue'} color={'ButtonText'} onClick={() => window.open(preview_url, '_blank')}>
															Nghe thử
														</Button>
														<Button
															marginLeft={'1.5'}
															background={'tomato'}
															onClick={() => {
																setVoice(voice_id);
																sendAlert('Copy id', 'Thành công!', ALERT_STATUS['success']);
															}}>
															Chọn voice này
														</Button>
													</Td>
												</Tr>
											);
										})}
									</Tbody>
								</Table>
							</TableContainer>
						</Box>
					</TabPanel>
					<TabPanel>
						<Text fontSize={'30px'} color={'tomato'} fontWeight={'bold'}>
							Tool
						</Text>
						<Text fontStyle={'italic'}>{`ID: ${voice !== '' ? voice : 'Chưa voice nào được chọn!'}`}</Text>
						<Divider marginBottom={'8px'} marginTop={'16px'} />
						<Grid templateColumns={'repeat(12, 1fr)'} gap={4}>
							<GridItem colSpan={10}>
								<Textarea placeholder='Nội dung' value={form} onChange={ev => setForm(ev.target.value)} />
							</GridItem>
							<GridItem>
								<Button background={'green.400'} isDisabled={disabled} isLoading={loading} onClick={handleChangeTextToSpeech}>
									Tạo File Giọng Nói
								</Button>
							</GridItem>
						</Grid>
					</TabPanel>
				</TabPanels>
			</Tabs>
			{audio && (
				<Box>
					<audio controls autoPlay>
						<source src={audio} type='audio/mpeg' />
					</audio>
					<Link download isExternal>
						Download
					</Link>
				</Box>
			)}
		</Box>
	);
};

export default App;
