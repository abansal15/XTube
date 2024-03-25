import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const authCheck = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header('Authorization')?.replace("Bearer ", "");
        let isAuth = false; // Initialize isAuthenticated flag

        if (token) {
            const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

            if (user) {
                // User found, set isAuthenticated flag to true
                isAuth = true;
                req.user = user;
            }
        }

        // Pass the isAuthenticated flag to the response
        res.status(200).json(new ApiResponse(200, { isAuthenticated: isAuth }));
    } catch (error) {
        // Handle errors
        next(error);
    }
});

export { authCheck };
