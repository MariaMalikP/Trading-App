import mongoose from "mongoose";

const AuctionSchema = new mongoose.Schema ({
    title: {
        type: String,
        required: true,
    },

    description: {
        type: String,
        required:true,
    },
    
    startingPrice: {
        type: Number,
        default: 0
    },
    startingTime: {
        type: Date,
        default: Date.now
    },
    endingTime: {
        type: Date,
        default: Date.now
    },

   currentPrice:
    {
        type: Number,
        default: 0
    },
    currentWinner:
    {
        type: String,
        default: "No one",
    }
});

const Auction = mongoose.model('Auction', AuctionSchema);

export default Auction