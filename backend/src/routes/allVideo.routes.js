import { Router } from "express";
import { getHomeVideos } from "../controllers/allVideo.controller.js";

const router = Router();

router.route('/').get(getHomeVideos);

export default router