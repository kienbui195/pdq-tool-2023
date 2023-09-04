import { Button, Flex, Input, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ALERT_STATUS } from "../ultis/constant";
import { useApp } from "../context";

const ACCOUNT = {
  username: "admin",
  password: "123456",
};

const Login = () => {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [disabled, setDisabled] = useState(false);
  const navigate = useNavigate();
  const { sendAlert, isMd, isLg } = useApp();

  const handleSubmit = () => {
    if (JSON.stringify(form) === JSON.stringify(ACCOUNT)) {
      sendAlert("Login", "Thành công!", ALERT_STATUS["success"]);
      localStorage.setItem("user-tool", JSON.stringify({ username: "admin", password: "123456" }));
      const data = localStorage.getItem("api-key");
      if (!data) {
        localStorage.setItem("api-key", JSON.stringify(["e9a7ae8f235b8fe220318954f1c906be"]));
      }
      navigate("/app");
    } else {
      sendAlert("Login", "Kiểm tra lại thông tin", ALERT_STATUS["error"]);
      setForm({
        username: "",
        password: "",
      });
    }
  };

  useEffect(() => {
    if (form.username.trim() === "" || form.password.trim() === "") {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [form]);

  return (
    <Flex justifyContent={"center"} alignItems={"center"} padding={{ base: "60px", sm: "80px", md: "100px", lg: "120px" }}>
      <Flex
        height={{ sm: "fit-content", md: "300px", lg: "400px" }}
        width={{ sm: "fit-content", md: "400px", lg: "600px" }}
        boxShadow={"dark-lg"}
        flexDirection={"column"}
        justifyContent={"center"}
        padding={"8"}
        alignItems={isLg ? "center" : ""}
      >
        <Text fontSize={{ base: "20px", sm: "22px", md: "26px", lg: "32px" }} fontWeight={"bold"} mb={isLg ? "48px" : "32px"}>
          Đăng nhập
        </Text>
        <Input marginBottom={"4"} placeholder="Username" value={form.username} onChange={(ev) => setForm({ ...form, username: ev.target.value })} />
        <Input marginBottom={"4"} placeholder="Password" value={form.password} onChange={(ev) => setForm({ ...form, password: ev.target.value })} />
        <Button width={"100%"} mt={isMd ? "50px" : "8px"} background={"green.200"} isDisabled={disabled} onClick={handleSubmit}>
          Submit
        </Button>
      </Flex>
    </Flex>
  );
};

export default Login;
