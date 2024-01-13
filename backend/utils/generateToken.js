import jwt from "jsonwebtoken";

const generateToken = (res, userId) => {
    // Creating token -> first paramter is payload, second is secret, third is time of expiry
    const token = jwt.sign( { userId: userId }, process.env.JWT_SECRET, { expiresIn: '1d' });
        
    // Set JWT as HTTP-Only cookie. Name given to cookie is jwt
    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 1 * 24 * 60 * 60 * 1000 // 1 day
    })
}

export default generateToken;