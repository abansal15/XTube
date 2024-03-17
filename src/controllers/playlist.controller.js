import mongoose, { isValidObjectId } from "mongoose"
import { Playlist } from "../models/playlist.model.js"
import { Video } from "../models/video.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body
    // create playlist
    if (!name || !description) {
        throw new ApiError(400, "name and description both are required")
    }

    const createdPlaylist = await Playlist.create(
        {
            name: name,
            description: description,
            owner: new mongoose.Types.ObjectId(req.user?._id),
            videos: []
        }
    )

    return res.status(200).json(new ApiResponse(200, createdPlaylist, "playlist created successfully"))
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params
    // get user playlists
    if (!(userId && isValidObjectId(userId))) {
        throw new ApiError(400, "Invalid user");
    }

    const userPlaylists = await Playlist.aggregate(
        [
            {
                $match: {
                    owner: new mongoose.Types.ObjectId(userId),
                }
            },
            {
                $lookup: {
                    from: "videos",
                    localField: "videos",
                    foreignField: "_id",
                    as: "playlistVideos",
                    pipeline: [
                        {
                            $project: {
                                thumbnail: 1,
                                videoFile: 1,
                                title: 1,
                                description: 1,
                                duration: 1,
                                views: 1,
                            }
                        },
                    ]
                }
            },
            {
                $project: {
                    name: 1,
                    description: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    playlistVideos: 1
                }
            },
            {
                $sort: {
                    createdAt: -1,
                }
            }
        ]
    )

    if (userPlaylists.length == 0) {
        throw new ApiError(404, "playlist not found")
    }

    return res.status(200).json(new ApiResponse(200, userPlaylists, "Playlist fetched successfully"))

})

const getPlaylistById = asyncHandler(async (req, res) => {
    // get playlist by id
    const { playlistId } = req.params

    if (!(playlistId && isValidObjectId(playlistId))) {
        throw new ApiError(400, "Invalid playlist id");
    }

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        throw new ApiError(404, "playlist not found")
    }

    if (playlist.owner.toString() != (req.user?._id).toString()) {
        throw new ApiError(401, "Unauthorised user!");
    }

    const userPlaylistById = await Playlist.aggregate(
        [
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(playlistId),
                }
            },
            {
                $lookup: {
                    from: "videos",
                    localField: "videos",
                    foreignField: "_id",
                    as: "playlistVideos",
                    pipeline: [
                        {
                            $project: {
                                thumbnail: 1,
                                videoFile: 1,
                                title: 1,
                                description: 1,
                                duration: 1,
                                views: 1,
                            }
                        },
                    ]
                }
            },
            {
                $project: {
                    name: 1,
                    description: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    playlistVideos: 1
                }
            },
            {
                $sort: {
                    createdAt: -1,
                }
            }
        ]
    )

    if (userPlaylistById.length == 0) {
        throw new ApiError(404, "playlist not found")
    }

    return res.status(200).json(new ApiResponse(200, userPlaylistById, "Playlist fetched successfully"))


})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params

    if (!(playlistId && isValidObjectId(playlistId))) {
        throw new ApiError(400, "Invalid playlist id");
    }

    if (!(videoId && isValidObjectId(videoId))) {
        throw new ApiError(400, "Invalid video id");
    }

    const VideoToAdd = await Video.findById(videoId);

    if (!VideoToAdd) {
        throw new ApiError(404, "video not found!");
    }

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        throw new ApiError(404, "playlist not found")
    }

    if (playlist.owner.toString() != (req.user?._id).toString()) {
        throw new ApiError(401, "Unauthorised user!");
    }

    if (playlist.videos.includes(new mongoose.Types.ObjectId(videoId))) {
        throw new ApiError(500, "video alredy exists in playlist!");
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $push: {
                videos: new mongoose.Types.ObjectId(videoId),
            }
        },
        {
            new: true
        }
    )

    if (!updatedPlaylist) {
        throw new ApiError(500, "Something went wrong while adding video to playlist!");
    }

    return res.status(200).json(new ApiResponse(200, updatedPlaylist, "Video added successfully to playlist"))

})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    // remove video from playlist
    const { playlistId, videoId } = req.params

    if (!(playlistId && isValidObjectId(playlistId))) {
        throw new ApiError(400, "Invalid playlist id");
    }

    if (!(videoId && isValidObjectId(videoId))) {
        throw new ApiError(400, "Invalid video id");
    }

    const VideoToAdd = await Video.findById(videoId);

    if (!VideoToAdd) {
        throw new ApiError(404, "video not found to remove from playlist");
    }

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        throw new ApiError(404, "playlist not found")
    }

    if (playlist.owner.toString() != (req.user?._id).toString()) {
        throw new ApiError(401, "Unauthorised user!");
    }

    if (!(playlist.videos.includes(new mongoose.Types.ObjectId(videoId)))) {
        throw new ApiError(500, "video does not exist in playlist!");
    }

    const updatedPlaylist = await Playlist.findByIdAndDelete(
        playlistId,
        {
            $pull: {
                videos: new mongoose.Types.ObjectId(videoId),
            }
        },
        {
            new: true
        }
    )

    if (!updatedPlaylist) {
        throw new ApiError(500, "Something went wrong while removing video from playlist!");
    }

    return res.status(200).json(new ApiResponse(200, updatedPlaylist, "Video removed successfully from playlist"))

})

const deletePlaylist = asyncHandler(async (req, res) => {
    // delete playlist
    const { playlistId } = req.params

    if (!(playlistId && isValidObjectId(playlistId))) {
        throw new ApiError(400, "Invalid playlist id");
    }

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        throw new ApiError(404, "playlist not found")
    }

    if (playlist.owner.toString() != (req.user?._id).toString()) {
        throw new ApiError(401, "Unauthorised user");
    }

    const updatedPlaylist = await Playlist.findByIdAndDelete(playlistId);

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "playlist deleted successfully!"));

})

const updatePlaylist = asyncHandler(async (req, res) => {
    // update playlist
    const { playlistId } = req.params
    const { name, description } = req.body

    if (!name || !description) {
        throw new ApiError(400, "name and description both are required")
    }

    if (!(playlistId && isValidObjectId(playlistId))) {
        throw new ApiError(400, "Invalid playlist id");
    }

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        throw new ApiError(404, "playlist not found")
    }

    if (playlist.owner.toString() != (req.user?._id).toString()) {
        throw new ApiError(401, "Unauthorised user");
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $set: {
                name: name,
                description: description,
            }
        },
        {
            new: true,
        }
    )

    if (!updatedPlaylist) {
        throw new ApiError(500, "error while updating playlist!");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, updatedPlaylist, "playlist updated successfully!")
        );


})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}