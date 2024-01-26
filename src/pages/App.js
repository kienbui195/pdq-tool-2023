import React, { useEffect } from "react";
import Header from "../components/Header";
import { useNavigate, Outlet } from "react-router-dom";
import { Box } from "@chakra-ui/react";

const App = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/api");
  }, []);

  return (
    <div style={{ background: "wheat", height: "100%", display: "flex", flexDirection: "column", width: "100%", alignItems: "stretch", minHeight: 'calc(100vh + 30px)' }}>
      <Header />
      <div
        style={{
          marginTop: "75px",
        }}
      >
        <Box mx={20} bg={"white"} p={8} mt={"100px"}>
          <Outlet />
        </Box>
      </div>
    </div>
  );
};

export default App;
