import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import {Apirespons} from "../utils/Apirespons.js"

const registerUser = asyncHandler( async (req,res) => {
    const {fullName,email,username,password} = req.body
    console.log("email :",email)

    if([fullName,email,username,password].some((feild) => feild?.trim() === "")){
        throw new ApiError(400, "all feild are required")
    }

    const existedUser =  User.findOne({
        $or:[{username},{email}]
    })

    if(existedUser){
        throw new ApiError(409,"user with email or username already exists")
    }

    const avaterLocalPath = req.files?.avater[0]?.path

    const coverImagePath = req.files?.coverImage[0].path

    if(!avaterLocalPath){
        throw new ApiError(400,"avater file is required ")
    }

    const avater =  await uploadOnCloudinary(avaterLocalPath)
    const coverImage = await uploadOnCloudinary(coverImagePath)

    if(!avater){
        throw new ApiError(400,"avater file is required ")
    }

    const user = await User.create({
        fullName,
        avater:avater.url,
        coverImage:coverImage.url || "",
        email,
        password,
        username:username.toLowerCase()
    })

    const createdUser =  await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500,"somthing went wrong when while registering the user")
    }

    return res.status(201).json(
        new Apirespons(200,createdUser,"successFully")
    )
})

export {registerUser}