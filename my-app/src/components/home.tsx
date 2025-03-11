import React from "react";
import axios from 'axios'
import '../styles/home.css'
import '../styles/navbar.css'
import User from '../styles/user.png'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom';
import { RootState } from "../store/store";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { setLogin } from "../store/accountslice";

const Home = ()=>{
    const dispatch = useDispatch();
    const { username, password, logged } = useSelector((state: RootState) => state.account);
    console.log(username, password);
    const {name} = useParams();
    const history = useNavigate();

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

 return(
    // <body>
    <>

    <div className="container">
    <div>
        <h1>Welcome to BidMe</h1>
        <p className="subtitle">Discover unique items and bid to win!</p>
        <button className="join" onClick={BrowseButton}>Browse</button>
        <button className="join" onClick={ProfileButton}>My Profile</button>
    </div>
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
    </>
    /* </body> */
 )
    
}

export default Home;