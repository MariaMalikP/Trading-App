import React from "react";
import axios from 'axios'
import '../styles/browse.css'
import auctionImage from '../styles/auction.png';
import User from '../styles/user.png'
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'
import { useState } from "react";
import { useEffect } from "react";
import { RootState } from "../store/store";
import { useSelector, useDispatch } from "react-redux";
import { setLogin } from "../store/accountslice";

const Browse = ()=>{
    interface Auction {
        title: string;
        description: string;
        startingPrice: number;
        startingTime: string
        endingTime: string
        currentPrice: number;
    }
    const dispatch = useDispatch();
    const { username, password, logged } = useSelector((state: RootState) => state.account);
    const [auctions, setAuctions] = useState<Auction[]>([]);
    const [allauctions, setAllAuctions] = useState<Auction[]>([]);
    const {name} = useParams();
    const [searchQuery, setsearchQuery]=useState('')
    const currentTime= new Date().getTime()

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

    useEffect(() => { 
        const getAuctions = async () => {
            try {
                const res = await axios.post("http://localhost:8000/getongoing");
                setAllAuctions(res.data)
                setAuctions(res.data);
            } catch (e) {
                console.log("error", e);
                alert("Unable to fetch auctions");
            }
        }
        getAuctions();
    }, []);

    const specificAuction = (auction: Auction) =>{
        // alert("clicked")
        history(`/specificauction/${name}`,{state: {auction: auction } })
    }
    const Searchkaro =()=>{
        const filtered = allauctions.filter(auction => auction.title.toLowerCase().includes(searchQuery.toLowerCase()));
        setAuctions(filtered)
    }
 return(
    <div className="container-bro">
    <div className="search-container">
        <input type="text" placeholder="Search..." onChange={e=>setsearchQuery(e.target.value)}/>
        <button onClick={Searchkaro}>Search</button>
    </div>
    
       {auctions && auctions.length>0 && auctions.map((auction,index)=>(
                <div className="auction-card-bro" key={index} onClick={()=>specificAuction(auction)}>
                
                <img src={auctionImage} alt="Item Image" className="item-image"/>
                <div className="auction-details-bro">
                <h2 className="auction-title-bro">{auction.title}</h2>
                <p>description: {auction.description}</p>
                <p>Starting Price:{auction.startingPrice}</p>
                <p>Current Price: {auction.currentPrice}</p>
                <p>Start Time: {new Date(auction.startingTime).toLocaleDateString()} {new Date(auction.startingTime).toLocaleTimeString()}</p>
                <p>End Time: {new Date(auction.endingTime).toLocaleDateString()} {new Date(auction.endingTime).toLocaleTimeString()}</p>
                </div>
            </div>
            ))}
    {/* </div> */}
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

export default Browse;