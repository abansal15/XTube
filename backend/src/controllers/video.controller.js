import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { deleteOnCloudinary } from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    // const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
    let { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;

    page = isNaN(page) ? 1 : Number(page);
    limit = isNaN(limit) ? 10 : Number(limit);

    //because 0 is not accepatabl ein skip and limit in aggearagate pipelien
    if (page < 0) {
        page = 1;
    }
    if (limit <= 0) {
        limit = 10;
    }

    const matchStage = {};
    if (userId && isValidObjectId(userId)) {
        matchStage["$match"] = {
            owner: new mongoose.Types.ObjectId(userId),
        };
    } else if (query) {
        matchStage["$match"] = {
            $or: [
                { title: { $regex: query, $options: "i" } },
                { description: { $regex: query, $options: "i" } },
            ],
        };
    } else {
        matchStage["$match"] = {};
    }
    if (userId && query) {
        matchStage["$match"] = {
            $and: [
                { owner: new mongoose.Types.ObjectId(userId) },
                {
                    $or: [
                        { title: { $regex: query, $options: "i" } },
                        { description: { $regex: query, $options: "i" } },
                    ],
                },
            ],
        };
    }

    const sortStage = {};
    if (sortBy && sortType) {
        sortStage["$sort"] = {
            [sortBy]: sortType === "asc" ? 1 : -1,
        };
    } else {
        sortStage["$sort"] = {
            createdAt: -1,
        };
    }

    const skipStage = { $skip: (page - 1) * limit };
    const limitStage = { $limit: limit };

    const videos = await Video.aggregate([
        matchStage,
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {
                        $project: {
                            fullName: 1,
                            username: 1,
                            avatar: 1,
                        },
                    },
                ],
            },
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "video",
                as: "likes"
            }
        },
        sortStage,
        {
            $skip: (page - 1) * limit,
        },
        {
            $limit: limit,
        },
        {
            $addFields: {
                owner: {
                    $first: "$owner",
                },
                likes: {
                    $size: "$likes"
                }
            },
        },
    ]);

    if (!videos) {
        throw new ApiError(404, "No videos found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, videos, "video fetched successfully !"));

})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body
    // get video, upload to cloudinary, create video
    const videoPath = req.files?.videoFile[0]?.path;
    const thumbnailPath = req.files?.thumbnail[0]?.path;

    if (!videoPath) {
        throw new ApiError(400, "video not found to publish");
    }

    const uploadedVideo = await uploadOnCloudinary(videoPath);
    let uploadedThumbnail;

    if (thumbnailPath) {
        uploadedThumbnail = await uploadOnCloudinary(thumbnailPath);
    }

    if (!uploadedVideo) {
        throw new ApiError(401, "Something went wrong while uploading video");
    }

    if (thumbnailPath && !uploadedThumbnail) {
        throw new ApiError(401, "Something went wrong while uploading Thumbnail");
    }

    const newVideo = await Video.create(
        {
            videoFile: uploadedVideo?.url,
            thumbnail: uploadedThumbnail?.url,
            title: title,
            description: description,
            duration: uploadedVideo.duration,
            owner: req.user?._id,
            views: 0,
            isPublished: true
        }
    )

    return res.status(200).json(new ApiResponse(200, newVideo, "Vedio published succcessfully"))

})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    // get video by id
    const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiError(400, "Video not found you want to get")
    }

    return res.status(200).json(200, video, "Video fetched successfully")
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    // update video details like title, description, thumbnail
    const video = await Video.findById(videoId);

    if (!video || !(video.owner.toString() === req.user._id.toString())) {
        throw new ApiError(400, "Cannot find the vedio")
    }

    const { title, description } = req.body;

    if (!(title && description)) {
        throw new ApiError(400, " title and discription required for updation")
    }


    const thumbnailPath = req.file?.thumbnail[0]?.path;

    let uploadedThumbnail = video.thumbnail;

    if (uploadedThumbnail) {
        await deleteOnCloudinary(uploadedThumbnail);
    }

    if (thumbnailPath) {
        uploadedThumbnail = await uploadOnCloudinary(thumbnailPath);
        uploadedThumbnail = uploadedThumbnail?.url
    }

    if (thumbnailPath && !uploadedThumbnail) {
        throw new ApiError(401, "Something went wrong while uploading Thumbnail");
    }

    const updatedVideo = await Video.findById(
        videoId,
        {
            $set: {
                title: title,
                description: description,
                thumbnail: uploadedThumbnail
            }
        },
        {
            new: true,
        }
    )

    return res.status(200).json(200, updateVideo, "video updated successfully");

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    // delete video
    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }
    if (video.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(400, "Unauthorized request to delete video");
    }

    await deleteOnCloudinary(video.videoFile);
    await deleteOnCloudinary(video.thumbnail);

    const deletedVideo = await Video.findByIdAndDelete(videoId);

    return res.status(200).json(new ApiResponse(200, deletedVideo, "Video deleted successfully"))

})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }
    if (video.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(400, "Unauthorized request to change video publish status");
    }

    const newVideo = await Video.findByIdAndUpdate(
        videoId,
        {
            $unset: {
                isPublished: false,
            }
        },
        {
            new: true
        }
    )

    return res.status(200).json(new ApiResponse(200, newVideo, "Video published status updated"))

})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}