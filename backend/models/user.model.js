import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
    },
    mobile: {
        type: String,
    },
    role: {
        type: String,
        enum: ["user", "owner", "delivery"]
    }
}, { timestamps: true })


const User = mongoose.model("User", userSchema)
export default User