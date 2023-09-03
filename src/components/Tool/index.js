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
import { ChevronDownIcon } from "@chakra-ui/icons";

const Tool = ({ voice, apiKey }) => {
  const [loading, setLoading] = useState(false);
  const [loadingButton, setLoadingButton] = useState(false);
  const [form, setForm] = useState([]);
  const { sendAlert } = useApp();
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
        url: `https://api.elevenlabs.io/v1/text-to-speech/${voice}`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "audio/mpeg",
          "xi-api-key": apiKey || "e9a7ae8f235b8fe220318954f1c906be",
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
            } catch (error) {
              sendAlert("Create file", error.message, ALERT_STATUS.error);
            }
          })
        );
        setButtonDisabled(false);
        setLoading(false);
        sendAlert("Create File", "Success!", ALERT_STATUS.success);
      } catch (error) {
        sendAlert("Create file", error.message, ALERT_STATUS.error);
        setLoading(false);
      }
    } else {
      setLoading(false);
      sendAlert("Create file", "Chưa có nội dung hoặc chưa có voice id! Kiểm tra lại!", ALERT_STATUS.error);
    }
  };

  useEffect(() => {
    if (modalImg.open) {
      getImageByText(modalImg.idx);
    }
  }, [modalImg.page, modalImg.idx, modalImg.open]);

  return (
    <>
      <Text fontSize={"30px"} color={"tomato"} fontWeight={"bold"}>
        Tool
      </Text>
      <Text fontStyle={"italic"}>{`ID: ${voice !== "" ? voice : "Chưa voice nào được chọn!"}`}</Text>
      <Divider mb={"8px"} mt={"16px"} />
      <Grid templateColumns={"repeat(12, 1fr)"} gap={4}>
        <GridItem colSpan={12}>
          <Flex gap={4} marginBottom={"8"}>
            <Button
              isDisabled={!voice}
              background={"Highlight"}
              color={"yellow.500"}
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
              Thêm ô text
            </Button>
            <Button isDisabled={!voice || form.length < 1} background={"green.400"} isLoading={loading} onClick={handleChangeTextToSpeech}>
              Tạo File Giọng Nói
            </Button>
            <Button
              isDisabled={form.length < 1}
              colorScheme="cyan"
              onClick={() => {
                setForm([]);
              }}
            >
              Xóa dữ liệu
            </Button>
            <Button colorScheme="messenger" isDisabled={buttonDisabled || form.length < 1} onClick={() => setModal({ ...modal, open: true })}>
              {`Xem danh sách audio`}
            </Button>
            <Flex alignItems={"center"}>
              <Text>Ngôn ngữ tìm kiếm ảnh:</Text>
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
                  <Flex mb={"2"} gap={2} templateColumns={"repeat(12, 3fr)"}>
                    <Tooltip placement="top" label={_i.id} overflow={"hidden"} textOverflow={"ellipsis"}>
                      <Text>ID</Text>
                    </Tooltip>
                    <Textarea placeholder="Nội dung" value={form[idx].text} onChange={(ev) => handleChangeText(ev, idx)} />

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
                        Xóa ô
                      </Button>
                      <Button isDisabled={form[idx].text.trim() === ""} mt="2" background={"yellow.400"} onClick={() => getImageByText(idx)}>
                        Tạo ảnh từ ND text
                      </Button>
                    </Flex>
                  </Flex>
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
