import { validationResult } from "express-validator";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { createUser , signIn ,blackListToken} from "../services/user.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import redisClient from '../services/redis.service.js';

export const registerUser = asyncHandler(async (req, res, next) => {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Destructure request body
    const { email, password } = req.body; 
 

    // Create the user using the service
    const newUser = await createUser(email, password);

    // Generate token if the user model supports it
    const token = newUser.generateAuthToken
        ? newUser.generateAuthToken()
        : null; // Ensure generateAuthToken exists on the model

    // Send response
    return res
        .status(201)
        .json(
            new ApiResponse(201, { user: newUser, token }, "User registered successfully.")
        );
});

export const loginUser = asyncHandler(async ( req, res) => {
    const {email  ,password} = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    } 

    const loggedInUser = await signIn(email , password);     

    const token = loggedInUser.generateAuthToken();

    res.cookie('token', token);

    // const options = {
    //     httpOnly: true,
    //     secure: true
    // }
    
    return res
    .status(200)
    .cookie("token", token) 
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser, token
            },
            "User logged In Successfully"
        )
    ) 
})

export const getUserProfile = asyncHandler(async(req, res) => {
    return res
    .status(200)
    .json(new ApiResponse(
        200,
        req.user,
        "User fetched successfully"
    ))
})

export const logoutUser = asyncHandler(async(req, res) => {
    const token = req.cookies.token || req.headers.authorization?.replace("Bearer " ,"");

    await blackListToken(token);
    
    res.clearCookie('token');

    return res
    .status(200)
    .json(new ApiResponse(
        200, 
        "User Logged Out successfully"
    ))
})