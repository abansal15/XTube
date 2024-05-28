import { Router } from 'express';
import {
    checkIsSubscribed,
    getSubscribedChannels,
    getUserChannelSubscribers,
    toggleSubscription,
} from "../controllers/subscription.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router
    .route("/c/:channelId")
    .get(getUserChannelSubscribers)
    .post(toggleSubscription);

router.route("/u").get(getSubscribedChannels);
router.route("/checkIsSubscribed/:channelId").get(checkIsSubscribed);

export default router