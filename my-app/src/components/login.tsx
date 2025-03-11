import '../styles/login.css'
import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux"; //import
import { setUsername,setPassword, setLogin } from '../store/accountslice'
import { AppDispatch } from '../store/store'
import '../store/store'
const Login = () =>{

    const [username, SetUsername] = useState('')
    const [password, SetPassword] = useState('')
    const history = useNavigate();
    const dispatch = useDispatch();


    const SubmitForm = async(e: React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        try{
            await axios.post ("http://localhost:8000/login", {username, password})
            .then (res=>{
                if(res.data==="success")
                {
                    localStorage.setItem('logged', 'ya');
                    dispatch(setUsername(username))
                    dispatch(setPassword(password))
                    dispatch(setLogin("ya"))
                    // alert("Login Successful")
                    history(`/home/${username}`)
                }
                else if (res.data ==="no user")
                {
                    alert("Incorrect username or password, try again.")
                }
                else if (res.data==="oh no")
                {
                    alert("An error occured, login unsuccessful")
                }
            })
        }
        catch(e)
        {
            console.log("error", e)
            alert("Unable to signup, try again.")
        }
    }

    return (
        <div className='body'>
            <div className='container-login'>
            <form className='login-form-login' onSubmit={SubmitForm}>
                <h2 className='login-form h2-login'>Login </h2>
                <div className='form-group-login'>
                    <label className='label-login'>Username</label>
                    <input className='input' type='text'
                    placeholder='Enter Username'
                    value={username}
                    onChange ={(e)=>SetUsername(e.target.value)}
                    required/>
                </div>
                <div className='form-group-login'>
                    <label className='label-login'>Password</label>
                    <input className='input' type='password'
                    placeholder='Enter Password'
                    value={password}
                    onChange ={(e)=>SetPassword(e.target.value)}
                    required/>
                </div>
                <button className='button'>Login</button>
                <div>
                < a href='/' className='form-group .signup-link'>Don't have an account? Signup</a>
                </div>
            </form>
            </div>
        </div>

    );

}

export default Login