import '../styles/signup.css'
import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import { Navigate, useNavigate } from 'react-router-dom';


const Signup = () => {
    

    const [username, SetUsername] = useState('')
    const [password, SetPassword] = useState('')
    const [success, SetSuccess] = useState('')
    const history = useNavigate();
    

    const SubmitForm = async(e: React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        try{
            await axios.post ("http://localhost:8000/signup", {username, password})
            .then (res=>{

                if(res.data==="success")
                {
                    // SetSuccess("success")
                    alert("Signup Successful")
                    history('/login')
                }
                if (res.data ==="user exists")
                {
                    alert("Username already in use, Try again with another username")
                }
                else if (res.data==="oh no")
                {
                    alert("An error occured, signup unsuccessful")
                }

            })

        }
        catch(e)
        {
            console.log("error", e)
            alert("Unable to signup, try again.")
        }
    }



    return(
        <div className='body-signup'>
            <div className='container-signup'>
            <form className='login-form-signup' onSubmit={SubmitForm}>
                <h2 className='login-form h2-signup'>Sign-Up </h2>
                <div className='form-group'>
                    <label className='form-group label'>Username</label>
                    <input className='form-group input' type='text'
                    placeholder='Enter Username'
                    value={username}
                    onChange ={(e)=>SetUsername(e.target.value)}
                    required/>
                </div>
                <div className='form-group'>
                    <label className='form-group label'>Password</label>
                    <input className='form-group input' type='password'
                    placeholder='Enter Password'
                    value={password}
                    onChange ={(e)=>SetPassword(e.target.value)}
                    required/>
                </div>
                <button className='form-group button'>Signup</button>
                <div>
                < a href='/login' className='form-group .signup-link'>Already have an account? Login</a>
                </div>
            </form>
            </div>
           
        </div>
    ); 
}

export default Signup