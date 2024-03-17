import mongoose, { isValidObjectId } from "mongoose"
import { User } from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    // toggle subscription
    const { channelId } = req.params
    if (!channelId.trim() || !isValidObjectId(channelId)) {
        throw new ApiError(400, "channelid is required or invalid!");
    }
    try {
        const existedSubscription = await Subscription.findOne({
            subscriber: new mongoose.Types.ObjectId(req.user?._id),
            channel: new mongoose.Types.ObjectId(channelId),
        });

        if (existedSubscription) {
            await existedSubscription.remove();
            return res.status(200).json(new ApiResponse(200, existedSubscription, "Unsubscribed successfully"));
        }

        const newSubscription = await Subscription.create({
            subscriber: new mongoose.Types.ObjectId(req.user?._id),
            channel: new mongoose.Types.ObjectId(channelId),
        });

        return res.status(200).json(new ApiResponse(200, newSubscription, "Subscribed successfully"));
    } catch (error) {
        return res.status(500).json(new ApiError(500, "Internal Server Error"));
    }
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params
    if (!channelId.trim() || !isValidObjectId(channelId)) {
        throw new ApiError(400, "channelid is required or invalid!");
    }

    const listUsers = await Subscription.aggregate(
        [
            {
                $match: {
                    channel: new mongoose.Types.ObjectId(channelId),
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "subscriber",
                    foreignField: "_id",
                    as: "subscribers",
                    pipeline: [
                        {
                            $project: {
                                fullName: 1,
                                username: 1,
                                avatar: 1,
                                _id: 1
                            }
                        }
                    ]
                }
            },
            {
                $addFields: {
                    userDetails: {
                        $first: "$subscribers"
                    }
                }
            },
            {
                $project: {
                    subscriber: 1,
                    userDetails: 1
                }
            }
        ]
    )

    if (listUsers.length == 0) {
        throw new ApiError(404, "No subscriber found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, listUsers, "fetched subscirber successfully!"));


})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {

    const { subscriberId } = req.params

    const registeredUser = await User.findById(subscriberId)

    if (!registeredUser || !(registeredUser._id.toString() == req.user._id.toString())) {
        throw new apiError(400, "subscriber id does not exists")
    }

    const listChannels = await Subscription.aggregate(
        [
            {
                $match: {
                    subscriber: new mongoose.Types.ObjectId(subscriberId)
                }
            },
            {
                $project: {
                    channel: 1
                }
            }
        ]
    )

    if (listChannels.length == 0) {
        throw new ApiError(404, "No subscriber found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                listChannels,
                "fetched channels successfully!"
            )
        );


})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}