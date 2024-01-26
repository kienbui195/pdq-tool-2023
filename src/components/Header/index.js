import * as React from "react";
import { Box, Breadcrumb, BreadcrumbItem } from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";

const NAVIGATION = [
  {
    label: "1. API KEY",
    route: "api",
  },
  {
    label: "2. Giọng nói",
    route: "voices",
  },
  {
    label: "3. Chuyển text thành giọng nói",
    route: "tool",
  },
];

const Header = () => {
  const pathname = useLocation().pathname;

  return (
    <Box
      position={"fixed"}
      top={0}
      left={0}
      right={0}
      height={70}
      background={"white"}
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      fontWeight={"bold"}
      zIndex={2024}
      boxShadow={'2xl'}
    >
      <Breadcrumb spacing={"8px"} separator={<div>{">"}</div>}>
        {NAVIGATION.map(({ label, route }, idx) => {
          let isCurrentPage = pathname.includes(route);

          return (
            <BreadcrumbItem
              isCurrentPage={isCurrentPage}
              _hover={{
                textDecoration: "underline",
              }}
              key={idx}
            >
              <Link
                to={`/${route}`}
                style={
                  isCurrentPage
                    ? {
                        color: "blue",
                      }
                    : {}
                }
              >
                {label}
              </Link>
            </BreadcrumbItem>
          );
        })}
      </Breadcrumb>
    </Box>
  );
};

export default Header;
