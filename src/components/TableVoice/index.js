import { Button, Divider, Flex, Table, TableContainer, Tag, TagLabel, Tbody, Td, Text, Th, Thead, Tooltip, Tr } from "@chakra-ui/react";
import React from "react";
import { ALERT_STATUS } from "../../ultis/constant";
import { useApp } from "../../context";
import { CheckIcon, PhoneIcon } from "@chakra-ui/icons";

const TableVoice = ({ voices, onChooseVoice }) => {
  const { sendAlert, isMd } = useApp();

  return (
    <>
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
                    <Tooltip label={name} placement="right">
                      {name}
                    </Tooltip>
                  </Td>
                  <Td maxW={"80px"} overflow={"hidden"} textOverflow={"ellipsis"}>
                    <Tooltip label={accent} placement="top">
                      {accent}
                    </Tooltip>
                  </Td>
                  <Td maxW={"80px"} overflow={"hidden"} textOverflow={"ellipsis"}>
                    <Tooltip label={age} placement="top">
                      {age}
                    </Tooltip>
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
                        {isMd ? (
                          "Nghe"
                        ) : (
                          <Tooltip label="Nghe">
                            <PhoneIcon />
                          </Tooltip>
                        )}
                      </Button>
                      <Button
                        marginLeft={"1.5"}
                        colorScheme="red"
                        onClick={() => {
                          onChooseVoice && onChooseVoice(voice_id);
                          sendAlert("Copy id", "Thành công!", ALERT_STATUS["success"]);
                        }}
                      >
                        {isMd ? (
                          "Chọn"
                        ) : (
                          <Tooltip label="Chọn">
                            <CheckIcon />
                          </Tooltip>
                        )}
                      </Button>
                    </Flex>
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

export default TableVoice;
