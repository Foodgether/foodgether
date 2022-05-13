import React, { useEffect } from 'react'
import {BACKEND_URL, BASE_PATH} from './config';
import Navbar from './Navbar';
import Menu from './Menu/Menu';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import Home from './Home'
import { atom, useAtom } from 'jotai'

export const userAtom = atom(null)
export const tokenAtom = atom('')


const Index = () => {
  const [_, setToken] = useAtom(tokenAtom)
  const [__, setUser] = useAtom(userAtom)

  useEffect(() => {
    fetch(`${BACKEND_URL}/user/me`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    })
    .then(result => result.json())
    .then(result => {
        if (!result.ok) {
          if (window.location.pathname !== (BASE_PATH ? `${BASE_PATH}/` : '/')) {
            window.location.replace(BASE_PATH ? BASE_PATH : '/');
          }
        }
        setToken(result.token);
        setUser(result.user);
    })
  }, [])
  return <React.StrictMode>
      <BrowserRouter>
          <Navbar/>
          <Routes>
            <Route path={BASE_PATH}>
              <Route index element={<Home />} />
              <Route path="menu" element={<Menu />} />
            </Route>
          </Routes>
      </BrowserRouter>

  </React.StrictMode>
}

export default Index
