import express from "express";
import { board, getUploadPost, filterPost, editPost, deletePost, getDetail, likePost, getHashtagsPost } from "../controllers/postController.js";
import { authenticateAccessToken } from '../middlewares/index.js';

// /api/posts
const postRouter = express.Router();

postRouter.route('/')
    .get(board)
    .post(authenticateAccessToken, getUploadPost);

postRouter.get('/search', filterPost);

postRouter.route('/hashtag/:hashtag')
    .get(getHashtagsPost);

postRouter.route('/:id')
    .all(authenticateAccessToken)
    .get(getDetail)
    .patch(deletePost)
    .put(editPost);
    
postRouter.route('/:id/like')
    .all(authenticateAccessToken)
    .post(likePost);

export default postRouter;