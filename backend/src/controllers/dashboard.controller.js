import mongoose from "mongoose"
import { Video } from "../models/video.model.js"
import { Subscription } from "../models/subscription.model.js"
import { Like } from "../models/like.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const data = await Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(req.user?._id),
            },
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "video",
                as: "likes",
            },
        },
        {
            $addFields: {
                likes: {
                    $size: "$likes",
                },
            },
        },
        {
            $group: {
                _id: null,
                totalViews: {
                    $sum: "$views",
                },
                totalVideo: {
                    $sum: 1,
                },
                totalLikes: {
                    $sum: "$likes",
                },
            },
        },
        {
            $addFields: {
                owner: new mongoose.Types.ObjectId(req.user?._id),
            },
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "owner",
                foreignField: "channel",
                as: "totalSubscribers",
            },
        },
        {
            $addFields: {
                totalSubscribers: {
                    $size: "$totalSubscribers",
                },
            },
        },
        // {
        //     $project: {
        //         _id: 0,
        //         owner: 0,
        //     },
        // },
    ]);

    return res.status(200).json(new ApiResponse(200, data, "get channel stats!"));
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

const getProfileVideos = asyncHandler(async (req, res) => {
    // Get all the videos uploaded by the channel
    const { userId } = req.params;

    const video = await Video.find(
        {
            owner: userId,
        }
    )

    if (!(video || video.length > 0)) {
        return res.status(200).json(new ApiResponse(200, {}, "no videos published"))
    }

    return res.status(200).json(new ApiResponse(200, video, "successfully fetched videos"))
})


export {
    getChannelStats,
    getChannelVideos,
    getProfileVideos
}