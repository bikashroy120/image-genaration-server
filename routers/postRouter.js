import express from "express";
import * as dotenv from "dotenv";
import Post from "../modals/post.js";
import { v2 as cloudinary} from "cloudinary";
dotenv.config();
const router = express.Router()

    // Configuration 
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_CLOUD_KEY,
        api_secret: process.env.CLOUDINARY_SECRET_KEY,
    });

    router.get('/',async(req,res)=>{
        try {
            const post = await Post.find({})
            res.status(200).json({success:true,data:post})
        } catch (error) {
            res.status(400).json({success:false,data:error})
        }
    })
  
    router.post('/',async(req,res)=>{
        try {
            const {name,prompt,photo} = req.body;

            const uploadPhoto =await cloudinary.uploader.upload(photo)

            const newPost = Post.create({
                name,
                prompt,
                photo:uploadPhoto.url,
            })

            res.status(200).json({success:true,data:newPost})
        } catch (error) {
            res.status(400).json({success:false,data:error})
        }
    })


export default router;