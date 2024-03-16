import mongoose from "mongoose"
import { Video } from "../models/video.model.js"
import { Subscription } from "../models/subscription.model.js"
import { Like } from "../models/like.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
})

const getChannelVideos = asyncHandler(async (req, res) => {
    // Get all the videos uploaded by the channel
    
    const video = await Video.find(
        {
            owner: req.user?._id,
        }
    )

    if (!(video || video.length > 0)) {
        return res.status(200).json(new ApiResponse(200, {}, "no videos published"))
    }

    return res.status(200).json(new ApiResponse(200, video, "successfully fetched videos"))
})


export {
    getChannelStats,
    getChannelVideos
}