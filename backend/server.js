import { Socket, Server } from "socket.io";
import http from "http";
import { app } from "./app.js";
import { config } from "dotenv";
import Auction from "./models/auctions.js";

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

config({
  path: "./config.env",
});

io.on("connection", (socket) => {
  console.log("USER CONNECTED:", socket.id);

  socket.on('join auction', (title) => {
    console.log("joing room", title)
    socket.join(title);
});

socket.on("bid placed", async (data) => {
  console.log(data)
  try{
    const res= await Auction.findOne({_id:data.AuctionId})
    console.log("res", res, "auction ", data.AuctionId)
    res.currentPrice=data.bid
    res.currentWinner=data.name
    await res.save();
    console.log("Bid updated in the database:", res, "data", data);
  }
  catch(e){
    console.error("error updating bid", e)
  }
  socket.to(data.AuctionId).emit("bid dekho", data);
});
});

server.listen(8000, () => {
  console.log("Server is running on port 8000");
});