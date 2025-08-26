import { User } from "../models/user.model.js";
import { ApiResponse } from '../utils/api-response.js'
import { ApiError } from '../utils/api-error.js'
import { asyncHandler } from '../utils/async-handler.js'
import { emailVerificationMailgenContent, sendEmail } from "../utils/mail.js";


const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })
        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating access token", error);
    }
}


const registerUser = asyncHandler(async (req, res) => {
    const { email, username, password, role } = req.body;

    const existingUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existingUser) {
        throw new ApiError(409, "User with email or username already exists", [])
    }

    const user = await User.create({
        email,
        password,
        username,
        // The `role` and `isEmailVerified` fields are good to include here.
        role,
        isEmailVerified: false,
    })

    const { unhasedToken, hashedToken, tokenExpiry } = user.generateTemporaryToken();
    user.emailVerificationToken = hashedToken;
    // FIX: Corrected the typo to set the property on the user object.
    user.emailVerificationExpiry = tokenExpiry;

    await user.save({ validateBeforeSave: false })

    await sendEmail({
        email: user?.email,
        subject: "Email Verification",
        mailgenContent: emailVerificationMailgenContent(user.username, `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unhasedToken}`)
    })

    // FIX: Corrected the typo from 'user_.id' to 'user._id'.
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken -emailVerificationToken -emailVerificationExpiry"
    )

    if (!createdUser) {
        throw new ApiError(500, " Something went wrong while registering the user")
    }
    // FIX: Matched the ApiResponse status code to the HTTP status code (201).
    return res.status(201).json(new ApiResponse(201, { user: createdUser }, "User registered successfully and verification email has been sent to your email"))
})

const login = asyncHandler(async(req,res) =>{
    const {email, password, username} = req.body

    if(!username || !email){
        throw new ApiError(400, "Username/Email is required");
    }

    const user = await User.findOne({email});

    if(!user){
        throw new ApiError(400, " User does not exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if(!isPasswordValid){
        throw new ApiError(400, " Invalid credentials");
    }

    const{accessToken, refreshToken} =  await generateAccessAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
    )
    if(!loggedInUser){
        throw new ApiError(500, "Something went wrong while logging in")
    }

    const options = {
        httpOnly : true,
        secure : true,
    }

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken
                },
                "User logged in successfully"
            )
        )

})

const logoutUser = asyncHandler(async(req,res)=>{
  await User.findByIdAndUpdate(  req.user._id,{
    $set : {
        refreshToken: ""
    },
    },
    {
        new : true
    },
  );
  const options = {
    httpOnly: true,
    secure : true
  }
  return res.status(200).clearCookie("accessToken", options).clearCookie("refreshToken", options).json(new ApiResponse(200, {}, " Logged out")); 
})


export { registerUser, login, logoutUser };
