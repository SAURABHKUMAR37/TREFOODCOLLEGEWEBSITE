import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import Login from './components/Login/Login'
import {Route, Routes, Navigate} from 'react-router-dom';
import Add from './pages/Add/Add';
import List from './pages/List/List';
import Orders from './pages/Orders/Orders';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  return (
    <div>
      <ToastContainer />
      {token === ""
        ? <Login setToken={setToken} />
        : <>
            <Navbar setToken={setToken} />
            <hr/>
            <div className="app-content">
              <Sidebar/>
              <Routes>
                <Route path="/" element={<Navigate to="/add" />} />
                <Route path="/add" element={<Add token={token} setToken={setToken} />}/>
                <Route path="/list" element={<List token={token} setToken={setToken} />}/>
                <Route path="/orders" element={<Orders token={token} setToken={setToken} />}/>
              </Routes>
            </div>
          </>
      }
    </div>
  )
}

export default App