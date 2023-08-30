import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ALERT_STATUS } from '../ultis/constant';
import TableVoice from '../components/TableVoice';
import { useApp } from '../context';
import Tool from '../components/Tool';
import { CheckIcon } from '@chakra-ui/icons';

const App = () => {
	const [voices, setVoices] = useState([]);
	const navigate = useNavigate();
	const { sendAlert } = useApp();
	const user = localStorage.getItem('user');
	const [voice, setVoice] = useState('');

	if (!user) {
		navigate('/');
	} else {
		if (JSON.parse(user).username !== 'admin' || JSON.parse(user).password !== '123456') {
			navigate('/');
		}
	}

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

	useEffect(() => {
		getListVoice();
	}, []);

	return (
		<Box padding='32' background={'bisque'}>
			<Tabs variant='soft-rounded' isFitted background={'azure'} borderRadius={'5px'} boxShadow={'dark-lg'} padding={'4'}>
				<TabList>
					<Tab>
						{`1. Giọng nói`}&nbsp;&nbsp;&nbsp;
						{voice && <CheckIcon />}
					</Tab>
					<Tab>2. Chuyển text thành giọng nói</Tab>
				</TabList>

				<TabPanels>
					<TabPanel>
						<TableVoice voices={voices} onChooseVoice={id => setVoice(id)} />
					</TabPanel>
					<TabPanel>
						<Tool voice={voice} />
					</TabPanel>
				</TabPanels>
			</Tabs>
		</Box>
	);
};

export default App;
