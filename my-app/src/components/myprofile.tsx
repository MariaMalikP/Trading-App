
import '../styles/profile.css'
import { useNavigate } from 'react-router-dom'
import UserImage from '../styles/user.png'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import User from '../styles/user.png'
import { RootState } from "../store/store";
import { useSelector, useDispatch } from "react-redux";
import { setLogin } from "../store/accountslice";


const MyProfile = ()=>{
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
    const {name} = useParams();
    const history = useNavigate();
    const [auctions, setAuctions] = useState<Auction[]>([]);
    const [owned, setOwned] = useState(0)
    const currentTime= new Date().getTime()

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
                const res = await axios.post("http://localhost:8000/getauctions", { name });
                setAuctions(res.data.auctions);
                setOwned(res.data.ongoing)
            } catch (e) {
                console.log("error", e);
                alert("Unable to fetch auctions");
            }
        }
        getAuctions();
    }, []);

    const CreateAuctionPage = () =>{
        history(`/createauction/${name}`)
    }
    const UpdatePassword = () =>{
        history(`/updatepassword/${name}`)
    }
    const specificAuction = (auction: Auction) =>{
        // alert("clicked")
        history(`/specificauction/${name}`,{state: {auction: auction } })
    }

    


 return(
    <div className="container-profile">
        <div className="profile-info">
            <div className="profile-image">
                <img src={UserImage} alt="User Image"/>
            </div>
            <div className="user-details-pro">
                <h2>Name: {name}</h2>
                <p>Username: {name}</p>
                <p>Items owned:{owned}</p>
            </div>
        </div>
        <div className="profile-actions">
            <button onClick={CreateAuctionPage}>Create Auction</button>
            <button onClick = {UpdatePassword}>Update Password</button>
        </div>
        <h3>My Auctions</h3>
        <div className="auction-list-pro">
            {auctions && auctions.map((auction,index)=>(
                <div className="auction-card-pro" key={index} onClick={()=>specificAuction(auction)}>
                <h4>{auction.title}</h4>
                <p>description: {auction.description}</p>
                <p>Starting Price:{auction.startingPrice}</p>
                <p>Current Price: {auction.currentPrice}</p>
                <p>Start Time: {new Date(auction.startingTime).toLocaleDateString()} {new Date(auction.startingTime).toLocaleTimeString()}</p>
                <p>End Time: {new Date(auction.endingTime).toLocaleDateString()} {new Date(auction.endingTime).toLocaleTimeString()}</p>
                {currentTime<new Date(auction.endingTime).getTime() && currentTime>new Date(auction.startingTime).getTime() && <p>Status:Ongoing</p>}
                {currentTime>new Date(auction.endingTime).getTime() && <p>Status:Finished</p>}
                {currentTime<new Date(auction.startingTime).getTime() && <p>Status:Not Started</p>}
            </div>
            ))}
        </div>
        {!auctions && <h4>You have no Auctions</h4>}
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

export default MyProfile;