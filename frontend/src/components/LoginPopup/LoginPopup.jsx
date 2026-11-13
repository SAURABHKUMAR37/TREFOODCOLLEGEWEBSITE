import React, { useState } from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/assets'
const url = import.meta.env.VITE_BACKEND_URL;
import axios from "axios"
import { useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';


const LoginPopup = ({setShowLogin}) => {
    const {setToken}=useContext(StoreContext);

    const[currState,setCurrState]=useState("Login")
    const[data,setData]=useState({
        name:"",
        email:"",
        password:""
    });

    const onchangeHandler=(e)=>{
        const name=e.target.name;
        const value=e.target.value;
        setData(data=>({...data,[name]:value}))
    }

    const onLogin = async (e) => {
    e.preventDefault();
    let newUrl = url;
    if (currState === "Login") {
        newUrl += "/api/user/login";
    } else {
        newUrl += "/api/user/register";
    }

    try {
        const response = await axios.post(newUrl, data);
        if (response.data.success) {
            setToken(response.data.token);
            localStorage.setItem("token", response.data.token);
            setShowLogin(false);
        } else {
            alert(response.data.message);
        }
    } catch (error) {
        if (error.response) {
            alert(error.response.data.message || "Something went wrong");
        } else {
            alert("Cannot connect to server. Check that the backend is running.");
        }
    }
};

  return (
    <div className='login-popup'>
        <form  onSubmit={onLogin} className="login-popup-container">
            <div className="login-popup-title">
                <h2>{currState}</h2>
                <img  onClick={()=>setShowLogin(false)} src={assets.cross_icon} alt=''/>
            </div>
            <div className="login-popup-inputs">
               {currState==='Login'?'':<input name='name' onChange={onchangeHandler} value={data.name} type="text" placeholder='Your name' required/>} 
                <input name='email' onChange={onchangeHandler} value={data.email} type="email" placeholder='Your email'  required/>
                <input  name='password' onChange={onchangeHandler} value={data.password} type="password" placeholder='Your password' required/>

            </div>
            <button type='submit'>{currState==='Sign Up'?"Create account":"Login"}</button>
            <div className="login-popup-condition">
                <input type='checkbox' required/>
                <p>By continuing, i agree to the terms of use & privacy policy.</p>
            </div>
            {
                currState==='Login'
                ?<p>Create a new account?<span onClick={()=>setCurrState('Sign Up')}> Click here</span></p>
                : <p>Already have a an account?<span onClick={()=>setCurrState('Login')}>Login here</span></p>

            }
        </form>
    
    </div>
  )
}

export default LoginPopup
