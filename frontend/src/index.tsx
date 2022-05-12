import React from 'react'
import {BASE_PATH} from './config';
import Navbar from './Navbar';
import Menu from './Menu/Menu';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import Home from './Home'
import { atom } from 'jotai'

export const userAtom = atom(null)
export const tokenAtom = atom('')


const Index = () => {

  return <div>
      <BrowserRouter>
    

          <Navbar/>
          <Routes>
            <Route path={BASE_PATH}>
              <Route index element={<Home />} />
              <Route path="menu" element={<Menu />} />
            </Route>
          </Routes>
          
      </BrowserRouter>
    
  </div>
}

export default Index