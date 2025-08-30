import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import genToken from "../utils/token.js";

const signUp = async (req, res) => {
    try {
        const { fullName, email, password, mobile, role } = req.body;
        console.log(req)

        const existUser = await User.findOne({
            $or: [{ email }, { mobile }]
        });


        if (existUser) {
            return res.status(422).json({ message: "User Already Exist!" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Your password is smaller than 6" });
        }

        if (mobile.length < 10) {
            return res.status(400).json({ message: "Your mobile is smaller than 10 digit" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            fullName,
            email,
            mobile,
            role,
            password: hashedPassword,
        });

        const token = await genToken(user._id);

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(201).json({
            message: "User registered successfully!",
            user,
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal error!" });
    }
};

const signIn = async (req, res) => {
    try {

        console.log(req)
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Your Email not found!" });
        }

        const isMatchPassword = await bcrypt.compare(password, user.password);

        if (!isMatchPassword) {
            return res.status(400).json({ message: "Your Password is incorrect!" });
        }

        const token = await genToken(user._id);

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            message: "User Login successfully!",
            user,
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal error!" });
    }
};

const signOut = async (req, res) => {
    try {
        res.clearCookie("token");
        res.status(200).json({ message: "Signed out successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Signout Error" });
    }
};

export { signUp, signIn, signOut };
