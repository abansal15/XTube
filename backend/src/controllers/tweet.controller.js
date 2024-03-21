import mongoose, { isValidObjectId } from "mongoose"
import { Tweet } from "../models/tweet.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    // create tweet
    const user = req.user?._id;
    const content = req.body.content;
    if (!content) {
        throw new ApiError(400, "Tweet Content is required");
    }
    const newTweet = await Tweet.create(
        {
            owner: user,
            content: content
        }
    )

    if (!newTweet) {
        throw new ApiError(400, "Something went worng while creating tweet");
    }

    return res.status(200).json(new ApiResponse(200, newTweet, "Tweet created successfully"))
})

const getUserTweets = asyncHandler(async (req, res) => {
    // get user tweets
    const { userId } = req.params;
    const userTweets = await Tweet.aggregate(
        [
            {
                $match: {
                    owner: new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $project: {
                    content: 1
                }
            }
        ]
    )

    if (!userTweets) {
        throw new ApiError(400, "user tweets does not exist")
    }

    return res.status(200).json(200, userTweets, "User tweets fetched successfully")

})

const updateTweet = asyncHandler(async (req, res) => {
    // update tweet
    const { tweetId } = req.params;
    const content = req.body.content;
    if (!content) {
        throw new ApiError(400, "Tweet Content is required");
    }

    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
        throw new ApiError(404, "Tweet does not exist")
    }

    const user = req.user?._id;
    if (!(tweet.owner.toString() === user.toString())) {
        throw new ApiError(400, "user is not logged in by the same id to change the tweet")
    }

    try {
        const updatedTweet = await Tweet.findByIdAndUpdate(
            tweetId,
            {
                $set: {
                    content: content
                }
            },
            {
                new: true,
            }
        )

        if (!updatedTweet) {
            throw new ApiError(500, "Something went wrong while updating the tweet");
        }

        return res.status(200).json(new ApiResponse(200, updatedTweet, "Tweet updated successfully"))
    } catch (error) {
        throw new ApiError(500, error?.message || "cannot update tweet")
    }

})

const deleteTweet = asyncHandler(async (req, res) => {
    // delete tweet
    const { tweetId } = req.params;

    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
        throw new ApiError(404, "Tweet does not exist")
    }

    const user = req.user?._id;
    if (!(tweet.owner.toString() === user.toString())) {
        throw new ApiError(400, "user is not logged in by the same id to delete the tweet")
    }

    const deletedTweet = await Tweet.findByIdAndDelete(tweetId);

    if (!deletedTweet)
    {
        throw new ApiError(500, "SOmething went wrong while deleting the tweet")
    }

    return res.status(200).json(new ApiResponse(200, deletedTweet, "Tweet deleted successfully"))

})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}