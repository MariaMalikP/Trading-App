import { useState } from 'react';
import '../styles/specificauction.css'
import { useLocation, useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import User from '../styles/user.png'
import '../styles/navbar.css'
import { RootState } from "../store/store";
import { useSelector, useDispatch } from "react-redux";
import { setLogin } from '../store/accountslice';

const socket = io("http://localhost:8000");

const SpecificAuction=()=>{
    const dispatch = useDispatch();

    const { username, password, logged } = useSelector((state: RootState) => state.account);
    const history= useNavigate()
    const currentTime= new Date()
    const {name = ''} = useParams<{name?: string }>(); //set to strign by default
    const [bid,setBid]=useState(0);
    const [currentPrice, setCurrentPrice] = useState(0)
    const [currentWinner, setCurrentWinner] = useState<string>("")
    const [owner, setOwner]=useState("")
    const [reset, setReset]=useState("")

    const location = useLocation();
    const auction = location.state.auction;

    useEffect(() => {
        if (!localStorage.getItem('logged')|| localStorage.getItem('logged')!=='ya') {
            // Redirect the user to login page if not logged in
            history('/login');
        }
    }, [logged]);

    const updateBid=()=>{
        if(owner==name){
            alert("The user who posted the auction cannot bid on it.")
        }
        else if(bid<auction.startingPrice){
            alert("bid cannot be lesser than the starting price")
        }
        else if(currentPrice>=bid){
            alert("You can't place a bid price lower or equal to than the current going price")
        }
        else if(currentTime > new Date(auction.endingTime)){
            alert("Auction has ended, you can't place a bid now")
        }
        else{
        
        const AuctionId=auction._id
        setCurrentPrice(bid);
        setCurrentWinner(name);
        socket.emit("bid placed", {bid, name,currentPrice,AuctionId});
        }
    }
    const getCurrPrice=async()=>{
    try{
        const res = await axios.post("http://localhost:8000/getCurrentPrice",{auction});
        const ya=res.data.currentPrice
        const yo = res.data.currentWinner
        setCurrentPrice(ya);
        setCurrentWinner(yo);
    }
    catch(e){
        console.log("error", e);
        alert("Unable to get current price data");
    }
    }
        

    useEffect(()=>{
        socket.on("bid dekho", (data:any) => {
            
            const newPrice= data.bid;
            const newWinner=data.name;
            setCurrentPrice(newPrice)
            setCurrentWinner(newWinner)
            // alert(data.name+" placed a bid of "+data.bid)
        });
    },[socket])

    const getBoi =async()=>{
        try
        {
            const res = await axios.post("http://localhost:8000/getBoi",{auction});
            const smth=res.data
            setOwner(smth)

        }
        catch(e)
        {
            console.log("error", e);
            alert("Unable to update to database");
        }
    }

    useEffect(()=>{},[currentPrice,reset]) //component mounts evertime currentprice updates
    useEffect(()=>{ //runs onli once when the component mounts. User joins room, gets current price from db, gets auction owner
        joinRoom();
        getCurrPrice();
        getBoi();
    },[])

    //runs every second and checks if auction time is over
    useEffect (()=>{
        const interval = setInterval(() => {
            const time= new Date()
            if (time > new Date(auction.endingTime)){
                clearInterval(interval); // so it only runs once when condition met
                setReset("ya")
            }
          }, 1000); //runs every second
          return () => clearInterval(interval); //clearing the interval
    },[])
    const joinRoom = () => {
        if (auction._id !== "") {
          socket.emit("join auction", auction._id);
        }
      };
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
        
        <div className="auction-details">
        <div className="auction-info">
        {(currentTime > new Date(auction.endingTime)) && 
        <div style={{ display: 'block' }}>
        <h1>Auction has ended. The winner is {currentWinner}</h1>
      </div>}
            <h2 className="auction-title">{auction.title}</h2>
            <p className="description">Description: {auction.description}</p>
            <p><strong>Starting Price:</strong> {auction.startingPrice}</p>
            <p><strong>Current Price:</strong> {currentPrice}</p>
            <p><strong>Current Winner:</strong> {currentWinner}</p>
            <p><strong>Start Time:</strong> {new Date(auction.startingTime).toLocaleDateString()} {new Date(auction.startingTime).toLocaleTimeString()}</p>
            <p><strong>End Time:</strong> {new Date(auction.endingTime).toLocaleDateString()} {new Date(auction.endingTime).toLocaleTimeString()}</p>
            <div className="bid-form">
                <label htmlFor="bidAmount">Your Bid:</label>
                <input type="number" id="bidAmount" name="bidAmount" min="0" step="1" onChange={e=>setBid(Number(e.target.value))}required/>
                <button type="submit" onClick={updateBid}>Place Bid</button>
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
    </div>
    );
}

export default SpecificAuction