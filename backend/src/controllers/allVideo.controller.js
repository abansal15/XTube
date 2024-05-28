import mongoose from "mongoose"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const getHomeVideos = asyncHandler(async (req, res) => {

    const allVideoDetails = await Video.aggregate(
        [
            {
                $lookup: {
                    from: 'users',
                    localField: "owner",
                    foreignField: "_id",
                    as: "ownerDetails",
                    pipeline: [
                        {
                            $project: {
                                fullName: 1,
                                username: 1,
                                avatar: 1,
                            }
                        }
                    ]
                }
            },
            {

                $lookup: {
                    from: "likes",
                    localField: "_id",
                    foreignField: "video",
                    as: "likes",
                    pipeline: [
                        {
                            $project: {
                                video: 1
                            }
                        }
                    ]
                }

            },
            {

                $lookup: {
                    from: "subscriptions",
                    localField: "owner",
                    foreignField: "channel",
                    as: "subcriptions",
                    pipeline: [
                        {
                            $project: {
                                channel: 1
                            }
                        }
                    ]
                }

            },
            {
                $lookup: {
                    from: "comments",
                    localField: "_id",
                    foreignField: "video",
                    as: "commentDetails",
                    pipeline: [
                        {
                            $project: {
                                content: 1,
                                // owner:1, karna hai kaise owner ki sari details laye
                                createdAt:1
                            }
                        }
                    ]
                }
            },
            {
                $addFields: {
                    ownerDetails: "$ownerDetails",
                    likes: {
                        $size: "$likes"
                    },
                    subcriptions: {
                        $size: "$subcriptions"
                    },
                    commentDetails: "$commentDetails"
                }
            }
        ]
    )

    if (!allVideoDetails) {
        throw new ApiError(404, "No videos found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, allVideoDetails, "video fetched successfully !"));
})

export { getHomeVideos }