import React, { useEffect } from "react";
import { BACKEND_URL, BASE_PATH } from "./config";
import Navbar from "./Navbar/Navbar";
import Menu from "./Menu/Menu";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home/Home";
import { useAtom } from "jotai";
import { Container, createTheme, NextUIProvider } from "@nextui-org/react";
import "./index.css";
import { tokenAtom, userAtom } from "./atoms";
import Profile from "./Profile/Profile";
import Invite from "./Invite/Invite";

const theme = createTheme({
  type: "light",
  theme: {
    colors: {
      primary: "rgb(131 24 6)",
      gradient:
        "linear-gradient(175deg, rgba(236,72,153,1) 0%, rgba(251,146,60,1) 100%);",
    },
  },
});

const Index = () => {
  const [__, setToken] = useAtom(tokenAtom);
  const [user, setUser] = useAtom(userAtom);

  useEffect(() => {
    fetch(`${BACKEND_URL}/user/me`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((result) => {
        if (!result.ok) {
          if (
            window.location.pathname !== (BASE_PATH ? `${BASE_PATH}/` : "/") &&
            !window.location.pathname.includes("invite")
          ) {
            window.location.replace(BASE_PATH ? BASE_PATH : "/");
          }
          setUser({ fetching: false, loggedIn: false });
          return;
        } else {
          return result.json();
        }
      })
      .then((result) => {
        if (!result) return;
        setToken(result.token);
        setUser({ ...result.user, fetching: false, loggedIn: true });
      });
  }, []);

  return (
    <React.StrictMode>
      <NextUIProvider theme={theme}>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path={BASE_PATH}>
              <Route index element={<Home />} />
              <Route path="menu" element={<Menu />} />
              <Route path="profile" element={<Profile />} />
              <Route path="invite/:inviteId" element={<Invite />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </NextUIProvider>
    </React.StrictMode>
  );
};

export default Index;
