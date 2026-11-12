import React, { useState } from "react";
import "./Login.css";
import axios from "axios";
import { toast } from "react-toastify";

const url = import.meta.env.VITE_BACKEND_URL;

const Login = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(url + "/api/admin/login", {
        email,
        password,
      });
      if (response.data.success) {
        setToken(response.data.token);
        toast.success("Login successful");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Server error, try again");
    }
  };

  return (
    <div className="admin-login">
      <div className="admin-login-box">
        <h1>Admin Panel</h1>
        <form onSubmit={onSubmitHandler}>
          <div className="admin-login-field">
            <p>Email Address</p>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder="admin@example.com"
              required
            />
          </div>
          <div className="admin-login-field">
            <p>Password</p>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;