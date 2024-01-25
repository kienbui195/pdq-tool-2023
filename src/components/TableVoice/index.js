import { Button, Divider, Flex, Table, TableContainer, Tag, TagLabel, Tbody, Td, Text, Th, Thead, Tr, Box } from "@chakra-ui/react";
import React, { useCallback, useEffect, useState } from "react";
import { ALERT_STATUS } from "../../ultis/constant";
import { useApp } from "../../context";
import axios from "axios";

const TableVoice = () => {
  const { sendAlert, state, setState } = useApp();
  const [voices, setVoices] = useState([]);

  const getListVoice = useCallback(async () => {
    await axios.get("https://api.elevenlabs.io/v1/voices", {
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": state.apiKey || "e9a7ae8f235b8fe220318954f1c906be",
      },
    })
      .then((res) => setVoices(res.data.voices))
      .catch((e) => {
        sendAlert("Get Voice", e.message, ALERT_STATUS["error"]);
      });
  }, [sendAlert, state.apiKey]);

  useEffect(() => {
    getListVoice();
  }, [getListVoice]);

  return (
    <Box bg={'white'}>
      <Text fontSize={{ base: "18px", sm: "24px", md: "26px", lg: "32px" }} color={"tomato"} fontWeight={"bold"}>
        Danh sách giọng đọc
      </Text>
      <Text fontSize={{ base: "12px", sm: "14px", md: "16px", lg: "18px" }}>Copy ID của một giọng nói mà bạn muốn rồi chuyển sang tab tiếp theo</Text>
      <Divider marginBottom={"8px"} marginTop={"16px"} />
      <TableContainer>
        <Table variant="simple">
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
              const { voice_id, labels, preview_url, name } = _i;
              const { accent, age, description, gender } = labels;

              return (
                <Tr key={_idx}>
                  <Td maxW={"120px"} overflow={"hidden"} textOverflow={"ellipsis"}>
                    {name}
                  </Td>
                  <Td maxW={"80px"} overflow={"hidden"} textOverflow={"ellipsis"}>
                    {accent}
                  </Td>
                  <Td maxW={"80px"} overflow={"hidden"} textOverflow={"ellipsis"}>
                    {age}
                  </Td>
                  <Td>{description}</Td>
                  <Td>
                    {gender === "male" ? (
                      <Tag borderRadius={"full"} variant={"solid"} colorScheme="blue">
                        <TagLabel>Nam</TagLabel>
                      </Tag>
                    ) : (
                      <Tag borderRadius={"full"} variant={"solid"} colorScheme="pink">
                        <TagLabel>Nữ</TagLabel>
                      </Tag>
                    )}
                  </Td>
                  <Td>
                    <Flex>
                      <Button colorScheme="teal" onClick={() => window.open(preview_url, "_blank")}>
                        Nghe
                      </Button>
                      <Button
                        marginLeft={"1.5"}
                        colorScheme="red"
                        onClick={() => {
                          setState({ ...state, voice: voice_id });
                          sendAlert("Copy id", "Thành công!", ALERT_STATUS["success"]);
                        }}
                      >
                        "Chọn"
                      </Button>
                    </Flex>
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TableVoice;
