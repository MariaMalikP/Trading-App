import mongoose from "mongoose";

const UserSchema = new mongoose.Schema ({
    username: {
        type: String,
        required: true,
        unique: true,
    },

    password : {
        type: String,
        required:true,
    },
    
    itemsOwned: {
        type: Number,
        default: 0
    },
    createdAuctions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Auction'
        }
    ]
});

const User = mongoose.model('User', UserSchema);

export default User