import { Box, Container, Grid, GridItem, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ALERT_STATUS } from "../ultis/constant";
import TableVoice from "../components/TableVoice";
import { useApp } from "../context";
import Tool from "../components/Tool";
import { CheckIcon } from "@chakra-ui/icons";
import APIForm from "../components/APIForm";

const App = () => {
  const [voices, setVoices] = useState([]);
  const navigate = useNavigate();
  const { sendAlert } = useApp();
  const user = localStorage.getItem("user-tool");
  const [voice, setVoice] = useState("");
  const [apiKey, setApiKey] = useState("");

  const getListVoice = async () => {
    await axios
      .get("https://api.elevenlabs.io/v1/voices", {
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": apiKey || "e9a7ae8f235b8fe220318954f1c906be",
        },
      })
      .then((res) => setVoices(res.data.voices))
      .catch((e) => {
        sendAlert("Get Voice", e.message, ALERT_STATUS["error"]);
      });
  };

  useEffect(() => {
    if (!user) {
      navigate("/");
    } else if (JSON.parse(user).username !== "admin" || JSON.parse(user).password !== "123456") {
      navigate("/");
    } else {
      getListVoice();
      window.addEventListener("beforeunload", () => {
        localStorage.removeItem("user-tool");
      });
    }
  }, [user]);

  return (
    <Grid p={{ base: "30px 0", sm: "60px 0", md: "80px 0", lg: "100px 0" }} templateColumns={"repeat(12, 1fr)"} background={"bisque"}>
      <GridItem colSpan={{ base: 0, sm: 0, md: 1, lg: 2 }}></GridItem>
      <GridItem colSpan={{ base: 12, sm: 12, md: 10, lg: 8 }}>
        <Tabs variant="soft-rounded" isFitted background={"azure"} borderRadius={"5px"} boxShadow={"dark-lg"} padding={"4"}>
          <TabList>
            <Tab>1. API KEY&nbsp;&nbsp;&nbsp; {apiKey && <CheckIcon />}</Tab>
            <Tab>
              {`2. Giọng nói`}&nbsp;&nbsp;&nbsp;
              {voice && <CheckIcon />}
            </Tab>
            <Tab>3. Chuyển text thành giọng nói</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <APIForm onChooseKey={(key) => setApiKey(key)} />
            </TabPanel>
            <TabPanel>
              <TableVoice voices={voices} onChooseVoice={(id) => setVoice(id)} />
            </TabPanel>
            <TabPanel>
              <Tool voice={voice} apiKey={apiKey} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </GridItem>
      <GridItem colSpan={{ base: 0, sm: 0, md: 1, lg: 2 }}></GridItem>
    </Grid>
  );
};

export default App;
