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
  const { sendAlert } = useApp();

  const handleSubmit = () => {
    if (JSON.stringify(form) === JSON.stringify(ACCOUNT)) {
      sendAlert("Login", "Thành công!", ALERT_STATUS["success"]);
      localStorage.setItem("user-tool", JSON.stringify({ username: "admin", password: "123456" }));
      const data = localStorage.getItem("user-tool");
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
    <Flex justifyContent={"center"} alignItems={"center"} padding={"120px"}>
      <Flex boxShadow={"dark-lg"} flexDirection={"column"} justifyContent={"center"} padding={"8"}>
        <form style={{display: 'flex', flexDirection: "column", alignItems: 'stretch'}}>
          <Text fontSize={"32"} fontWeight={"bold"} marginBottom={"8"}>
            Đăng nhập
          </Text>
          <Input marginBottom={"4"} placeholder="Username" value={form.username} onChange={(ev) => setForm({ ...form, username: ev.target.value })} />
          <Input marginBottom={"4"} placeholder="Password" value={form.password} onChange={(ev) => setForm({ ...form, password: ev.target.value })} />
          <Button background={"green.200"} isDisabled={disabled} onClick={handleSubmit}>
            Submit
          </Button>
        </form>
      </Flex>
    </Flex>
  );
};

export default Login;
