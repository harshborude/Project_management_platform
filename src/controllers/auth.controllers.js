import {User} from "../models/user.model.js";
import {ApiResponse} from '../utils/api-response.js'
import {ApiError} from '../utils/api-error.js'
import {asyncHandler} from '../utils/async-handler.js'
import { emailVerificationMailgenContent, sendEmail } from "../utils/mail.js";


const generateAccessAndRefreshToken = async(userId) =>{
    try {
       const user =  await User.findById(userId)
      const accessToken =  user.generateAccessToken();
      const refreshToken =  user.generateRefreshToken();

      user.refreshToken = refreshToken
      await user.save({validateBeforeSave : false})
      return {accessToken, refreshToken}
    } catch(error){
        throw new ApiError(500, "Something went wrong while generating access token", error);
    }
}



const registerUser = asyncHandler(async (req,res) =>{
    const {email, username, password, role} = req.body;

  const existingUser = await  User.findOne({
        $or : [{username}, {email}]
    })

    if(existingUser){
        throw new ApiError(409, "User with email or username already exists", [])
    }

    const user = await User.create({
        email,
        password,
        username,
        isEmailVerified : false,

    })

   const {unhasedToken, hashedToken, tokenExpiry} =  user.generateTemporaryToken();
   user.emailVerificationToken = hashedToken
    emailVerificationExpiry = tokenExpiry

    await user.save({validateBeforeSave: false})

    await sendEmail({
        email: user?.email,
        subject : "Email Verification",
        mailgenContent : emailVerificationMailgenContent(user.username, `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unhasedToken}`)
    })

    const createdUser = await User.findById(user_.id).select(
        "-password -refreshToken -emailVerificationToken -emailVerificationExpiry"
    )

    if(!createdUser){
        throw new ApiError(500," Something went wrong while registering the user")
    }
    return res.status(201).json(new ApiResponse(200, {user: createdUser}, "User registered successfully and verification email has been sent to your email"))
})

export { registerUser};