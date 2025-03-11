import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import User from "./models/users.js";
import Auction from "./models/auctions.js";
export const app = express();
dotenv.config();

 
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONG_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log('Listening on port ' + process.env.PORT);
      console.log("Connected to Database");
  });
  })
  .catch((error) => {
    console.log(error);
  });

app.post('/signup', async (req,res)=>{
  const {username, password} = req.body
  const NewUser = 
  {
    username: username,
    password: password,
  }
 
  try {
    console.log("in here")
    const usernameCheck = await User.find({username:username})
    console.log("user", usernameCheck )
    if (usernameCheck.length>0)
    {
      return res.json("user exists")
    }
  }
  catch (e)
  {
    console.error("Error in try catch")
  }

 try
 {
  await User.insertMany(NewUser)
  return res.json("success")
 }
 catch(e)
 {
  console.error("An issue occured when inserting data")
  res.json("oh no")
 }
  

});

app.post('/login', async (req,res)=>{
  console.log("in login")
  const {username, password} = req.body

  try {
    const usernameCheck = await User.find({username:username, password:password})
    console.log("user", usernameCheck, username, password)
    if (usernameCheck.length<=0)
    {
      return res.json("no user")
    }
    else
    {
      return res.json("success")
    }
  }
  catch (e)
  {
    console.error("oh no")
  }
});

app.post('/createauction', async(req,res)=>{
  const {title, description, startingPrice, startingTime, endingTime,name} = req.body
  const newAuction = {
    title: title,
    description: description,
    startingPrice: startingPrice,
    startingTime: startingTime,
    endingTime: endingTime,
  }
 
  try
 {
  
  const createdAuction = await Auction.create(newAuction)
  console.log("name", name, createdAuction._id)
  await User.findOneAndUpdate({username:name},{$push:{createdAuctions: createdAuction._id } })
  return res.json("success")
 }
 catch(e)
 {
  console.error("An issue occured when inserting auction data")
  res.json("oh no")
 }
})

app.post('/changepassword', async (req,res)=>{
  
  const {password, confpassword, name} = req.body
  console.log(password,confpassword,name)
  try {
        const usernameCheck = await User.findOne({username:name})
        if (usernameCheck.password!==password)
        {
          return res.json("wrong password")
        }
        else
        {
          const change = await User.findOne({username:name})
          change.password=confpassword
          change.save()
          return res.json("success")
        }
      }
      catch (e)
      {
        console.error("oh no")
        return res.json("oh no")
      }
});

app.post('/getauctions', async (req,res)=>{
  console.log("in get auctions")
  const {name} = req.body
  const currDate = new Date()
  try{
    const result= await User.find({username:name})
    // console.log("resukt", result)
    const auctions= result[0].createdAuctions

    // console.log(auctions)
    let auctionsFinal=[]
    for(let index=0;index<auctions.length;index++)
    {
      const aik = await Auction.find({_id:auctions[index]})
      auctionsFinal.push(...aik)
    }
    // const owned= result[0].itemsOwned
    const AllAuctions = await Auction.find()
      let owned=0;
      for(let i=0;i<AllAuctions.length;i++)
      {
        if(AllAuctions[i].currentWinner==name && currDate>=new Date(AllAuctions[i].endingTime) ){owned=owned+1}
      }

    return res.json({auctions:auctionsFinal, ongoing:owned})
  }
  catch(e)
  {
    console.error("oh no")
    return res.json("oh no")
  }
});

app.post('/getongoing', async (req,res)=>{
  console.log("in on auctions")
  const currentTime= new Date()
  try{
      const all = await Auction.find()
      let ongoing=[]
      for(let i=0;i<all.length;i++)
      {
        // if(currentTime>=new Date(all[i].startingTime).getTime() && currentTime<=new Date(all[i].endingTime).getTime())
        console.log("tines", currentTime, all[i].startingTime, all[i].endingTime, all[i].title)
        if(currentTime>=new Date(all[i].startingTime) && currentTime<= new Date(all[i].endingTime))
        {
          ongoing.push(all[i])
        }
      }
      console.log(ongoing)
    return res.json(ongoing)
  }
  catch(e)
  {
    console.error("oh no")
    return res.json("oh no")
  }
});

app.post('/getBoi', async (req,res)=>{
  const {auction}= req.body;

  try{
      const user = await User.findOne({createdAuctions:{$in: [auction._id]}})
     
      const usernamee= user.username
      console.log("user", usernamee);
      return res.json(usernamee)
  }
  catch(e)
  {
    console.error("oh no")
    return res.json("oh no")
  }
});

app.post('/getCurrentPrice', async (req,res)=>{
  const {auction}= req.body;

  try{
      const user = await Auction.findOne({_id:auction._id})

      const currprice= user.currentPrice
      const winner = user.currentWinner
      // console.log("price", currprice, winner);
      return res.json({currentPrice:currprice, currentWinner:winner})
  }
  catch(e)
  {
    console.error("oh no")
    return res.json("oh no")
  }
});
