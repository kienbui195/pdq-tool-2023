import { Button, Flex, Input, Text, useToast } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ALERT_STATUS } from './App';

const ACCOUNT = {
	username: 'admin',
	password: '123456',
};

const Login = () => {
	const [form, setForm] = useState({
		username: '',
		password: '',
	});
	const [disabled, setDisabled] = useState(false);
	const navigate = useNavigate();
	const toast = useToast();

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

	const handleSubmit = () => {
		if (JSON.stringify(form) === JSON.stringify(ACCOUNT)) {
			sendAlert('Login', 'Thành công!', ALERT_STATUS['success']);
			navigate('/app');
		} else {
			sendAlert('Login', 'Kiểm tra lại thông tin', ALERT_STATUS['error']);
			setForm({
				username: '',
				password: '',
			});
		}
	};

	useEffect(() => {
		if (form.username.trim() === '' || form.password.trim() === '') {
			setDisabled(true);
		} else {
			setDisabled(false);
		}
	}, [form]);

	return (
		<Flex justifyContent={'center'} alignItems={'center'} padding={'80'}>
			<Flex boxShadow={'dark-lg'} flexDirection={'column'} justifyContent={'center'} padding={'8'}>
				<Text fontSize={'32'} fontWeight={'bold'} marginBottom={'8'}>
					Đăng nhập
				</Text>
				<Input marginBottom={'4'} placeholder='Username' value={form.username} onChange={ev => setForm({ ...form, username: ev.target.value })} />
				<Input marginBottom={'4'} placeholder='Password' value={form.password} onChange={ev => setForm({ ...form, password: ev.target.value })} />
				<Button background={'green.200'} isDisabled={disabled} onClick={handleSubmit}>
					Đăng nhập
				</Button>
			</Flex>
		</Flex>
	);
};

export default Login;
