import mongoose, { Schema, mongo } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema(
    {
        videoFile: {
            type: String, // cloudinary url 
            required: [true, 'It is required'],
        },
        thumbnail: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        duration: {
            type: Number,
            default: 0
        },
        views: {
            type: Number,
            default: 0
        },
        isPublished: {
            type: Boolean,
            default: true,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    }, {
    timestamps: true,
}
);

videoSchema.plugin(mongooseAggregatePaginate)

videoSchema.methods.increaseViewCount = async function () {
    this.views = this.views + 1;
    await this.save();
}

export const Video = mongoose.model("Video", videoSchema);