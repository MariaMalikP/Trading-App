
import '../styles/updatepass.css'
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import User from '../styles/user.png'
import { RootState } from "../store/store";
import { useSelector, useDispatch } from "react-redux";
import { setLogin } from "../store/accountslice";
import { useEffect } from 'react'

const UpdatePassword =()=>{
    const history = useNavigate()
    const dispatch = useDispatch();
    const logged = useSelector((state: RootState) => state.account.logged);
    const [password, SetPassword] = useState('')
    const [confpassword, SetconfPassword] = useState('')
    const { name } = useParams();

    useEffect(() => {
        if (!localStorage.getItem('logged')|| localStorage.getItem('logged')!=='ya') {
            // Redirect the user to login page if not logged in
            history('/login');
        }

    }, [logged]);
    const BrowseButton = () =>{
        history(`/browse/${name}`)
    }
    const ProfileButton = () =>{
        history(`/myprofile/${name}`)
    }
    const Logout = () =>{
        localStorage.removeItem('logged');
        dispatch(setLogin(""))
        history('/login')
    }
    const goHome = () =>{
        history(`/home/${name}`)
    }
    const SubmitForm = async(e: React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        try{
            await axios.post ("http://localhost:8000/changepassword", {password, confpassword, name})
            .then (res=>{
                if(res.data==="success")
                {
                    
                    alert("Update successful")
                    history(`/myprofile/${name}`)
                }
                else if (res.data ==="wrong password")
                {
                    alert("Incorrect password, try again.")
                }
                else if (res.data==="oh no")
                {
                    alert("An error occured, update unsuccessful")
                }
            })
        }
        catch(e)
        {
            console.log("error", e)
            alert("Unable to update, try again.")
        }

    }
    return (
        <div className='body'>
            <div className='container-login'>
            <form className='login-form-login' onSubmit={SubmitForm}>
                <h2 className='login-form h2-login'>Change Password </h2>
                <div className='form-group-login'>
                    <label className='label-login'>Old Password</label>
                    <input className='input' type='text'
                    placeholder='Enter Username'
                    value={password}
                    onChange ={(e)=>SetPassword(e.target.value)}
                    required/>
                </div>
                <div className='form-group-login'>
                    <label className='label-login'>New Password</label>
                    <input className='input' type='password'
                    placeholder='Enter Password'
                    value={confpassword}
                    onChange ={(e)=>SetconfPassword(e.target.value)}
                    required/>
                </div>
                <button className='button'>Change Password</button>
                {/* <div>
                < a href=`/profile${name}` className='form-group .signup-link'>Changed your mind? Go back</a>
                </div> */}
            </form>
            </div>
            <div>
            <ul className="container-navbar">
                <span className="sub-container">
                    <li onClick={goHome}>Home</li>
                    <li onClick={BrowseButton}>Browse</li>
                    <li onClick={ProfileButton}>My Profile</li>
                </span>
                <span className="sub-container"> 
                    <li><img src={User} width="40px" /></li>
                    <li className="logout" onClick={Logout}>Logout</li>
                </span>
            </ul>
        </div>
        </div>
    );
}

export default UpdatePassword