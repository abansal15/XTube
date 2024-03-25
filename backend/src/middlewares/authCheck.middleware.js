// import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const authCheck = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header('Authorization')?.replace("Bearer ", "");

        if (!token) {
            req.isAuthenticated = false; // Set isAuthenticated flag
            return next();
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

        if (!user) {
            req.isAuthenticated = false; // Set isAuthenticated flag
            return next();
        }

        req.isAuthenticated = true; // Set isAuthenticated flag
        req.user = user;
        next();
    } catch (error) {
        req.isAuthenticated = false; // Set isAuthenticated flag
        next();
    }
});
