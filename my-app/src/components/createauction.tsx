import React from "react";
import axios from 'axios'
import '../styles/createauction.css'
import { useNavigate } from 'react-router-dom'
import { useState } from "react";
import User from '../styles/user.png'
import { useParams } from "react-router-dom";
import { RootState } from "../store/store";
import { useSelector, useDispatch } from "react-redux";
import { setLogin } from "../store/accountslice";
import { useEffect } from "react";

const CreateAuction = ()=>{
    const dispatch = useDispatch();
    const { username, password, logged } = useSelector((state: RootState) => state.account);
    const [title, setTitle]= useState('')
    const [description, setDescription]= useState('')
    const [startingPrice, setstartingPrice]= useState(0)
    const [startingTime, setstartingTime]= useState(new Date)
    const [endingTime, setendingTime]= useState(new Date)
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

    const SubmitForm = async(e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
        try{
            const res = await axios.post("http://localhost:8000/createauction", {title, description, startingPrice, startingTime, endingTime,name})
            if (res.data==="success")
            {
                alert("Auction Created successfully!")
            }
            else if(res.data==="oh no")
            {
                alert("smth went wrong")
            }

        }
        catch(e)
        {
            console.log("error", e)
            alert("Unable to create auction, try again.")
        }
        

    }

 return(
    <div className="container-auction">
        <h1>Create Auction</h1>
        <form className="form" onSubmit={SubmitForm}>
            <label htmlFor="title">Title:</label>
            <input type="title" id="title" name="title" onChange={(e)=>setTitle(e.target.value)} required/>
            <label htmlFor="description">Description:</label>
            <textarea id="description" name="description" rows={4} onChange={(e)=>setDescription(e.target.value)} required></textarea>
            <label htmlFor="startingPrice">Starting Price:</label>
            <input type="number" id="startingPrice" name="startingPrice" min={0} step={1} onChange={(e)=>setstartingPrice(parseInt(e.target.value))} required/>
            <label htmlFor="startTime">Start Time:</label>
            <input type="datetime-local" id="startTime" name="startTime" onChange={(e)=>setstartingTime(new Date(e.target.value))}required/>
            <label htmlFor="endTime">End Time:</label>
            <input type="datetime-local" id="endTime" name="endTime" onChange={(e)=>setendingTime(new Date(e.target.value))}required/>
            <button type="submit">Create Auction</button>
        </form>
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
 )
    
}

export default  CreateAuction;