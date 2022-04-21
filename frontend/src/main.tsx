import React from 'react'
import ReactDOM from 'react-dom/client'
import Home from './Home'
import './index.css'
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import Navbar from './Navbar';
import Menu from './Menu/Menu';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div>
        <BrowserRouter>
          <Navbar/>
          <Routes>
            <Route path="/">
              <Route index element={<Home />} />
              <Route path="menu" element={<Menu />} />
            </Route>
          </Routes>
        </BrowserRouter>
    </div>
  </React.StrictMode>
)
