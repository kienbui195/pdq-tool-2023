import { AddIcon, ChevronDownIcon } from "@chakra-ui/icons";
import {
  Menu,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Flex,
  Text,
  Box,
  Grid,
  GridItem,
  Input,
  ModalFooter,
  Tooltip,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useApp } from "../../context";
import { ALERT_STATUS } from "../../ultis/constant";

const APIForm = ({ onChooseKey }) => {
  const [listKey, setListKey] = useState(() => {
    const data = localStorage.getItem("api-key");
    if (data) {
      return JSON.parse(data);
    } else {
      return [];
    }
  });
  const [modal, setModal] = useState(false);
  const [key, setKey] = useState("");
  const [chooseKey, setChooseKey] = useState("");
  const { sendAlert, isMd } = useApp();

  const handleSaveKey = () => {
    let idx = Array.from(listKey).findIndex((_i) => _i === key);
    if (idx !== -1) {
      setModal(false);
      sendAlert("Thêm key", "Key đã tồn tại! Hãy thêm key khác!", ALERT_STATUS["warning"]);
    } else {
      listKey.push(key);
      localStorage.setItem("api-key", JSON.stringify(listKey));
      sendAlert("Thêm key", "Thêm thành công!", ALERT_STATUS["success"]);
      setModal(false);
    }
  };

  useEffect(() => {
    if (listKey.length < 1) {
      setChooseKey && setChooseKey("");
      setKey("");
    }
  }, [listKey]);

  return (
    <Box>
      <Flex flexDirection={"column"}>
        <Flex justifyContent={"space-between"}>
          <Box maxW={{ base: "160px", sm: "190px", md: "220px", lg: "260px" }}>
            <Text fontSize={{ base: "20px", sm: "22px", md: "26px", lg: "32px" }} fontWeight={"bold"} color={"tomato"}>
              Cấu hình API KEY
            </Text>
            <Text fontSize={{ base: "10px", sm: "14px", md: "16px", lg: "18px" }} mb={"10"}>
              Bấm chọn 1 key ở bên dưới hoặc thêm key mới
            </Text>
          </Box>
          <Box>
            <Button onClick={() => setModal(true)} colorScheme="twitter">
              {!isMd ? (
                <Tooltip label="Thêm key mới">
                  <AddIcon />
                </Tooltip>
              ) : (
                "Thêm key mới"
              )}
            </Button>
          </Box>
        </Flex>
        <Grid>
          <GridItem colSpan={4}>
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                {chooseKey || "Chọn key"}
              </MenuButton>
              <MenuList maxW={"400px"}>
                {listKey &&
                  listKey.map((_i, idx) => {
                    return (
                      <MenuItem
                        key={idx}
                        onClick={() => {
                          setChooseKey(_i);
                          onChooseKey && onChooseKey(_i);
                        }}
                      >
                        <Flex alignItems={"center"} justifyContent={"space-between"} gap={2}>
                          <Text>{_i}</Text>

                          <Button
                            isDisabled={_i === "e9a7ae8f235b8fe220318954f1c906be"}
                            colorScheme="orange"
                            onClick={() => {
                              if (window.confirm("Bạn chắc chắn muốn xóa key này? Lưu ý hành động sẽ không quay lại được!")) {
                                const updateList = [...listKey];
                                updateList.splice(idx, 1);
                                setListKey(updateList);
                                localStorage.setItem("api-key", JSON.stringify(updateList));
                              }
                            }}
                          >
                            Xóa key
                          </Button>
                        </Flex>
                      </MenuItem>
                    );
                  })}
              </MenuList>
            </Menu>
          </GridItem>
        </Grid>
      </Flex>

      <Modal maxW={{ base: "375px", sm: "375px", md: "400px", lg: "fit-content" }} isOpen={modal} onClose={() => setModal(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Text variant={"h2"}>Thêm key</Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box padding={"8px 0 24px"}>
              <Input value={key} onChange={(ev) => setKey(ev.target.value)} />
            </Box>
          </ModalBody>
          <ModalFooter>
            <Flex gap={4}>
              <Button
                colorScheme="red"
                onClick={() => {
                  setKey("");
                  setModal(false);
                }}
              >
                Hủy bỏ
              </Button>
              <Button onClick={handleSaveKey} colorScheme="green">
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
