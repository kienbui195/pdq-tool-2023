import {
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  GridItem,
  Text,
  Textarea,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Tooltip,
  Image,
  ModalFooter,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useApp } from "../../context";
import axios from "axios";
import { ALERT_STATUS, UNSPLASH_ACCESS_KEY, UNSPLASH_API_URL } from "../../ultis/constant";
import moment from "moment/moment";
import qs from "qs";
import { AddIcon, ChevronDownIcon, DeleteIcon, PlusSquareIcon, RepeatIcon, ViewIcon } from "@chakra-ui/icons";

const Tool = () => {
  const [loading, setLoading] = useState(false);
  const [loadingButton, setLoadingButton] = useState(false);
  const [form, setForm] = useState([]);
  const { isXl, isLg, sendAlert, state, setState } = useApp();
  const [modal, setModal] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [modalImg, setModalImg] = useState({
    open: false,
    isViewing: [],
    page: 1,
    idx: "",
    lang: "en",
  });

  const handleGenerateFile = (file, id) => {
    let blob = new Blob([file], { type: "audio/mpeg" });
    let url = URL.createObjectURL(blob);
    setForm((prevForm) => prevForm.map((item) => (item.id === id ? { ...item, url: url } : item)));
  };

  const handleChangeText = (ev, idx) => {
    const value = ev.target.value;
    setForm((prevForm) => prevForm.map((item, i) => (i === idx ? { ...item, text: value } : item)));
  };

  const checkFormEmpty = () => {
    return form.filter((item) => item.text.trim() !== "");
  };

  const postAPI = async (text) => {
    try {
      const response = await axios.request({
        url: `https://api.elevenlabs.io/v1/text-to-speech/${state.voice}`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "audio/mpeg",
          "xi-api-key": state.apiKey || "e9a7ae8f235b8fe220318954f1c906be",
        },
        data: JSON.stringify({
          text,
        }),
        responseType: "arraybuffer",
      });
      return response.data;
    } catch (error) {
      sendAlert("Create file", error.message, ALERT_STATUS["error"]);
    }
  };

  const getImageByText = async (idx) => {
    try {
      if (idx !== "") {
        setLoadingButton(true);
        await axios
          .request({
            url: `${UNSPLASH_API_URL}/search/photos?${qs.stringify({
              query: form[idx].text,
              page: modalImg.page,
              lang: modalImg.lang,
            })}`,
            method: "GET",
            headers: {
              Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
            },
          })
          .then((res) => {
            if (res.data.results.length > 0) {
              const image = res.data.results;
              setModalImg({
                ...modalImg,
                open: true,
                isViewing: image,
                idx,
              });
            }
            setLoadingButton(false);
          });
      }
    } catch (error) {
      setLoadingButton(false);
      sendAlert("Create image", error.message, ALERT_STATUS["error"]);
    }
  };

  const handleChangeTextToSpeech = async () => {
    setLoading(true);
    const data = checkFormEmpty();

    if (data.length > 0) {
      try {
        await Promise.all(
          data.map(async (item) => {
            try {
              const audioData = await postAPI(item.text);
              handleGenerateFile(audioData, item.id);
              sendAlert("Create File", "Success!", ALERT_STATUS.success);
            } catch (error) {
              sendAlert("Create file", error.message, ALERT_STATUS.error);
            }
          })
        );
        setButtonDisabled(false);
        setLoading(false);
      } catch (error) {
        sendAlert("Create file", error.message, ALERT_STATUS.error);
        setLoading(false);
      }
    } else {
      setLoading(false);
      sendAlert("Create file", "Chưa có nội dung hoặc chưa có state.voice id! Kiểm tra lại!", ALERT_STATUS.error);
    }
  };

  useEffect(() => {
    if (modalImg.open) {
      getImageByText(modalImg.idx);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalImg.page, modalImg.idx, modalImg.open]);

  return (
    <>
      <Text fontSize={{ base: "18px", sm: "24px", md: "26px", lg: "32px" }} color={"tomato"} fontWeight={"bold"}>
        Tool
      </Text>
      <Text fontSize={{ base: "12px", sm: "14px", md: "16px", lg: "18px" }} fontStyle={"italic"}>{`ID: ${state.voice !== "" ? state.voice : "Chưa state.voice nào được chọn!"}`}</Text>
      <Divider mb={"8px"} mt={"16px"} />
      <Grid templateColumns={"repeat(12, 1fr)"} gap={4}>
        <GridItem colSpan={12}>
          <Flex mb={"8"} alignItems={"center"} justifyContent={"space-between"}>
            <Grid gap={1} templateColumns={isLg ? "repeat(4, 1fr)" : "repeat(2, 1fr)"}>
              <GridItem>
                <Button
                  width={"100%"}
                  isDisabled={!state.voice}
                  colorScheme="blackAlpha"
                  onClick={() => {
                    setButtonDisabled(true);
                    const today = new Date();
                    let newForm = {
                      id: moment(today).format("YYMMDDhhmmssSS"),
                      text: "",
                      url: "",
                    };
                    setForm([...form, newForm]);
                  }}
                >
                  {isXl ? (
                    "Thêm ô text"
                  ) : (
                    <Tooltip label="Thêm ô text">
                      <AddIcon />
                    </Tooltip>
                  )}
                </Button>
              </GridItem>
              <GridItem>
                <Button colorScheme="purple" width={"100%"} isDisabled={!state.voice || form.length < 1} isLoading={loading} onClick={handleChangeTextToSpeech}>
                  {isXl ? (
                    " Tạo File Giọng Nói"
                  ) : (
                    <Tooltip label=" Tạo File Giọng Nói">
                      <RepeatIcon />
                    </Tooltip>
                  )}
                </Button>
              </GridItem>
              <GridItem>
                <Button
                  width={"100%"}
                  isDisabled={form.length < 1}
                  colorScheme="cyan"
                  onClick={() => {
                    setForm([]);
                  }}
                >
                  {isXl ? (
                    "Xóa dữ liệu"
                  ) : (
                    <Tooltip label="Xóa dữ liệu">
                      <DeleteIcon />
                    </Tooltip>
                  )}
                </Button>
              </GridItem>
              <GridItem>
                <Button width={"100%"} colorScheme="messenger" isDisabled={buttonDisabled || form.length < 1} onClick={() => setModal({ ...modal, open: true })}>
                  {isXl ? (
                    "Danh sách audio"
                  ) : (
                    <Tooltip label="Danh sách audio">
                      <ViewIcon />
                    </Tooltip>
                  )}
                </Button>
              </GridItem>
            </Grid>
            <Flex alignItems={"center"}>
              <Text>Ngôn ngữ</Text>
              <Menu>
                <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                  {modalImg.lang}
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={() => setModalImg({ ...modalImg, lang: "en" })}>en</MenuItem>
                  <MenuItem onClick={() => setModalImg({ ...modalImg, lang: "vi" })}>vi</MenuItem>
                </MenuList>
              </Menu>
            </Flex>
          </Flex>
          {form.length > 0 &&
            form.map((_i, idx) => {
              return (
                <Box key={idx}>
                  <Grid mb={"2"} gap={2} templateColumns={"repeat(12, 3fr)"}>
                    <GridItem colSpan={2}>
                      <Text>{_i.id}</Text>
                    </GridItem>
                    <GridItem colSpan={8}>
                      <Textarea placeholder="Nội dung" value={form[idx].text} onChange={(ev) => handleChangeText(ev, idx)} />
                    </GridItem>
                    <GridItem colSpan={2}>
                      <Flex flexDirection={"column"}>
                        <Button
                          colorScheme="red"
                          onClick={() => {
                            const updateForm = [...form];
                            let idx = updateForm.findIndex((_it) => _it.id === _i.id);
                            updateForm.splice(idx, 1);
                            setForm(updateForm);
                          }}
                        >
                          {isLg ? (
                            "Xóa ô"
                          ) : (
                            <Tooltip label="Xóa ô">
                              <DeleteIcon />
                            </Tooltip>
                          )}
                        </Button>
                        <Button isDisabled={form[idx].text.trim() === ""} mt="2" colorScheme="yellow" onClick={() => getImageByText(idx)}>
                          {isLg ? (
                            "Tạo ảnh"
                          ) : (
                            <Tooltip label="Tạo ảnh">
                              <PlusSquareIcon />
                            </Tooltip>
                          )}
                        </Button>
                      </Flex>
                    </GridItem>
                  </Grid>
                  <Divider mb={"6"} mt={"6"} />
                </Box>
              );
            })}
        </GridItem>
      </Grid>
      {/* list audio */}
      <Modal isOpen={modal} onClose={() => setModal(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Text variant={"h2"}>Danh sách audio</Text>
            <Text fontSize={"12px"} fontWeight={"normal"}>
              Ấn vào dấu 3 chấm để tải về
            </Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box padding={"8px 0 24px"}>
              {form
                .filter((_i) => _i.url !== "")
                .map((item, idx) => {
                  const { id, url } = item;

                  return (
                    <Grid templateColumns={"repeat(12, 1fr)"} gap={1} key={idx} mb={"8px"}>
                      <GridItem colSpan={12}>
                        <Text textOverflow={"ellipsis"}>{id}</Text>
                      </GridItem>
                      <GridItem colSpan={12}>
                        <audio controls>
                          <source src={url} type="audio/mpeg" />
                        </audio>
                      </GridItem>
                    </Grid>
                  );
                })}
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* list image */}

      <Modal isOpen={modalImg.open} onClose={() => setModalImg({ ...modalImg, open: false, page: 1 })}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Text variant={"h2"}>Danh sách ảnh</Text>
            <Text fontSize={"12px"} fontWeight={"normal"}>
              click vào ảnh để xem kích thước đầy đủ
            </Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box maxH={"300px"} overflowX={"hidden"} overflowY={"auto"} padding={"8px 0 24px"}>
              <Grid gap={2} templateColumns={`repeat(12, 1fr)`}>
                {modalImg.isViewing.map((_i, idx) => {
                  const { urls, alt_description } = _i;
                  const { full, raw } = urls;
                  return (
                    <GridItem colSpan={3} key={idx}>
                      <Box cursor={"pointer"} onClick={() => window.open(full, "_blank")}>
                        <Tooltip label={alt_description} placement={"auto"}>
                          <Image src={raw} alt={alt_description} />
                        </Tooltip>
                      </Box>
                    </GridItem>
                  );
                })}
              </Grid>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button
              isLoading={loadingButton}
              onClick={() => {
                setModalImg({ ...modalImg, open: true, page: modalImg.page + 1 });
              }}
            >
              Thêm...
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Tool;
