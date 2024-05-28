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
            subscriber: req.user?._id,
            channel: channelId,
        });

        // console.log("Existed subscription is ", existedSubscription);

        if (existedSubscription) {
            await Subscription.findByIdAndDelete(existedSubscription._id, { new: true });
            return res.status(200).json(new ApiResponse(200, false, "Unsubscribed successfully"));
        }

        const newSubscription = await Subscription.create({
            subscriber: req.user?._id,
            channel: channelId,
        });

        return res.status(200).json(new ApiResponse(200, true, "Subscribed successfully"));
    } catch (error) {
        console.log("Error in toggle subscription function ", error);
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

    const subscriberId  = req.user?._id;

    const registeredUser = await User.findById(subscriberId)

    if (!registeredUser || !(registeredUser._id.toString() == req.user._id.toString())) {
        throw new ApiError(400, "subscriber id does not exists")
    }

    const listChannels = await Subscription.aggregate(
        [
            {
                $match: {
                    subscriber: subscriberId
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "channel",
                    foreignField: "_id",
                    as: "subscriptions",
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
                        $first: "$subscriptions"
                    }
                }
            },
            {
                $project: {
                    userDetails: 1,
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

const checkIsSubscribed = asyncHandler(async (req, res) => {
    const { channelId } = req.params
    if (!channelId.trim() || !isValidObjectId(channelId)) {
        throw new ApiError(400, "channelid is required or invalid!");
    }
    try {
        const existedSubscription = await Subscription.findOne({
            subscriber: req.user?._id,
            channel: channelId,
        });

        if (existedSubscription) {
            return res.status(200).json(new ApiResponse(200, true, "user is subscribed to the channel"));
        }

        return res.status(200).json(new ApiResponse(200, false, " user is not subscribed to the channel"));
    } catch (error) {
        console.log("Error in checking is subscribed or not function ", error);
        return res.status(500).json(new ApiError(500, "Internal Server Error"));
    }
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels,
    checkIsSubscribed
}