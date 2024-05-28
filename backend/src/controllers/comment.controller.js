import mongoose, { isValidObjectId } from "mongoose"
import { Comment } from "../models/comment.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    // get all comments for a video

    const { page: rawPage = 1, limit = 10 } = req.query;
    const page = isNaN(rawPage) ? 1 : Number(rawPage);

    // let page = isNaN(page) ? 1 : Number(page);
    // let limit = isNaN(limit) ? 10 : Number(limit);


    // page = isNaN(page) ? 1 : Number(page);
    // limit = isNaN(limit) ? 10 : Number(limit);

    const { videoId } = req.params;
    // console.log(videoId)

    if (!videoId?.trim() || !isValidObjectId(videoId)) {
        throw new ApiError(400, "video id is required or valid");
    }

    // //because skip and limit value in aggearagation must be greater than zero
    // if (page <= 0) {
    //     page = 1
    // } if (limit <= 0) {
    //     limit = 10
    // }

    const comments = await Comment.aggregate([
        {
            $match: {
                video: new mongoose.Types.ObjectId(videoId),
            },
        },
        {
            $lookup: {
                from: 'users',
                localField: 'owner',
                foreignField: '_id',
                as: 'owner',
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            fullName: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        },
        {
            $lookup: {
                from: 'likes',
                localField: '_id',
                foreignField: 'comment',
                as: 'likeCount'
            }
        },
        {
            $addFields: {
                likeCount: {
                    $size: '$likeCount'
                }
            }
        },
        {
            $addFields: {
                owner: {
                    $first: '$owner'
                }
            }
        },
        {
            $addFields: {
                createdAt: {
                    $toDate: '$_id'
                },
                // _id: '$_id'
            }
        },
        // {
        //     $skip: (page - 1) * limit
        // },
        // {
        //     $limit: page,
        // },
    ]);

    // if (comments.length == 0) {
    //     throw new ApiError(500, "commets not found!");
    // }
    return res
        .status(200)
        .json(new ApiResponse(200, comments, "comments fetched successfully!"));

})

const addComment = asyncHandler(async (req, res) => {

    const { videoId } = req.params;
    const { addComm } = req.body;

    if (!videoId) {
        throw new ApiError(400, "video id not found")
    }

    if (!addComm) {
        throw new ApiError(400, "Comment not found")
    }

    const commentCreated = await Comment.create({
        content: addComm,
        video: new mongoose.Types.ObjectId(videoId),
        owner: req.user?._id
    })

    if (!commentCreated) {
        throw new ApiError(400, "Something went wrong while creating comment")
    }

    return res.status(200).json(new ApiResponse(200, commentCreated, "Comment created successfully"));

})

const updateComment = asyncHandler(async (req, res) => {

    const { commentId } = req.params;
    const newContent = req.body.content;

    if (!newContent) {
        throw new ApiError(400, "new data should be required")
    }

    const commentFound = await Comment.findById(commentId);
    if (!commentFound) {
        throw new ApiError(400, "existed comment not found")
    }

    if (!(commentFound.owner.toString() === req.user?._id.toString())) {
        throw new ApiError(400, "cannot update only comment user can update")
    }


    try {
        const updatedComment = await Comment.findByIdAndUpdate(
            commentId,
            {
                $set: {
                    content: newContent
                }
            },
            {
                new: true,
            }
        )

        if (!updatedComment) {
            throw new ApiError(400, "Something went wrong while updating the comment")
        }

        return res.status(200).json(new ApiResponse(200, updatedComment, "comment updated successfully"))

    } catch (error) {
        throw new ApiError(401, error?.message)
    }
})

const deleteComment = asyncHandler(async (req, res) => {

    const { commentId } = req.params;

    const commentFound = await Comment.findById(commentId);

    if (!commentFound) {
        throw new ApiError(400, "existed comment not found")
    }

    if (!(commentFound.owner.toString() === req.user?._id.toString())) {
        throw new ApiError(400, "cannot update only comment user can delete")
    }


    try {
        const updatedComment = await Comment.findByIdAndDelete(
            commentId,
            {
                new: true,
            }
        )

        if (!updatedComment) {
            throw new ApiError(400, "Something went wrong while deleting the comment")
        }

        return res.status(200).json(new ApiResponse(200, updatedComment, "comment deleted successfully"))

    } catch (error) {
        throw new ApiError(401, error?.message || "cannot delete comment")
    }
})

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}