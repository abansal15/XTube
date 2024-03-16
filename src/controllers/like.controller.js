import mongoose, { isValidObjectId } from "mongoose"
import { Like } from "../models/like.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    // toggle like on video
    try {
        const userAlreadyLiked = await Like.find(
            {
                video: videoId,
                likedBy: req.user?._id
            }
        )
        if (userAlreadyLiked && userAlreadyLiked.length > 0) {
            await Like.findByIdAndDelete(userAlreadyLiked,
                {
                    new: true
                }
            )

            return res.status(200).json(new ApiResponse(200, {}, "Video dislikked successfully"))
        }

        const VideoLike = await Like.create(
            {
                video: videoId,
                likedBy: req.user?._id
            }
        )
        if (!VideoLike) {
            throw new ApiError(400, "unable to like a video")
        }

        return res.status(200).json(new ApiResponse(200, VideoLike, "video liked successfully"))
    } catch (error) {
        throw new ApiError(401, error?.message || "something went wrong while toggling the video like")
    }
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params
    // toggle like on comment
    try {
        const userAlreadyComment = await Like.findOne(
            {
                likedBy: req.user?._id,
                comment: commentId
            }
        )

        if (userAlreadyComment && userAlreadyComment.length > 0) {
            await Like.findByIdAndDelete(
                userAlreadyComment,
                {
                    new: true
                }
            )

            return res.status(200).json(new ApiResponse(200, {}, "comment like successfully deleted"))
        }

        const commentLike = await Like.create(
            {
                comment: commentId,
                likedBy: req.user?._id
            }
        )

        if (!commentLike) {
            throw new ApiError(400, "unable to like the comment")
        }

        return res.status(200).json(new ApiResponse(200, commentLike, "comment liked successfully"))
    } catch (error) {
        throw new ApiError(401, error?.message || "something went wrong while liking the comment");
    }

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params
    // toggle like on tweet

    try {
        const userAlreadyTweet = await Like.findOne(
            {
                likedBy: req.user?._id,
                tweet: tweetId
            }
        )

        if (userAlreadyTweet && userAlreadyTweet.length > 0) {
            await Like.findByIdAndDelete(
                userAlreadyTweet,
                {
                    new: true
                }
            )

            return res.status(200).json(new ApiResponse(200, {}, "tweet like successfully deleted"))
        }

        const tweetLike = await Like.create(
            {
                tweet: tweetId,
                likedBy: req.user?._id
            }
        )

        if (!tweetLike) {
            throw new ApiError(400, "unable to like the comment")
        }

        return res.status(200).json(new ApiResponse(200, tweetLike, "tweet liked successfully"))
    } catch (error) {
        throw new ApiError(401, error?.message || "something went wrong while liking the tweet");
    }

}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    // get all liked videos
    const likedVideos = await Like.aggregate(
        [
            {
                $match: {
                    likedBy: req.user?._id
                }
            },
            {
                $lookup: {
                    from: "videos",
                    localField: "video",
                    foreignField: "_id",
                    as: "likedVideos"
                }
            },
            {
                $unwind: "likedVideos",
            },
            {
                $project: {
                    likedVideos: 1
                }
            }
        ]
    )

    if (!likedVideos) {
        return res.json(
            new ApiResponse(
                200,
                {},
                "user have no liked vedios"
            )
        )
    }
    return res.status(200).json(new ApiResponse(200, likedVideos, "liked videos fetched succesfully"))
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}