import { Router } from "express";
import { authCheck } from "../controllers/authCheck.controller.js";

const router = Router();

router.route('/status').post(authCheck);

export default router