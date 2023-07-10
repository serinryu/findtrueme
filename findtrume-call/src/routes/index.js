import express from "express";
import { getMyPosts, searchByHashtag, renderMain } from "../controllers/index.js";

const router = express.Router();

router.get('/', renderMain);

router.get('/myposts', getMyPosts);

router.get('/search/:hashtag', searchByHashtag);

export default router;