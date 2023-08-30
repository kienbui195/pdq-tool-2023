import { Box, Button, Divider, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import React from 'react';
import { ALERT_STATUS } from '../../ultis/constant';
import { useApp } from '../../context';

const TableVoice = ({ voices, onChooseVoice }) => {
	const { sendAlert } = useApp();

	return (
		<>
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
								<Th>Tên</Th>
								<Th>Quốc gia</Th>
								<Th>Độ tuổi</Th>
								<Th>Mô tả</Th>
								<Th>Giới tính</Th>
								<Th>Hành động</Th>
							</Tr>
						</Thead>
						<Tbody>
							{voices.map((_i, _idx) => {
								const { voice_id, labels, name, preview_url } = _i;
								const { accent, age, description, gender } = labels;

								return (
									<Tr key={_idx}>
										<Td overflow={'hidden'} maxWidth={'150px'} textOverflow={'ellipsis'}>
											{name}
										</Td>
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
													onChooseVoice && onChooseVoice(voice_id);
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
		</>
	);
};

export default TableVoice;
