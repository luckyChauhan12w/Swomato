import jwt from "jsonwebtoken"

const genToken = async (userId) => {
    try {
        const Token = jwt.sign({
            id: userId
        }, process.env.JWT_SECRET, { expiresIn: "7d" })
        return Token
    } catch (error) {
        console.log("Token Is not Seted to the User Browser!")
    }
}

export default genToken