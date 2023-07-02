import express from "express";
import { authenticateAccessToken } from "../middlewares/index.js";
import { getAllComments, getCommentsByPostId, postComment, deleteComment, likeComment } from "../controllers/commentController.js";

const commentRouter = express.Router();

// /api/comments
commentRouter.route('/')
    .get(getAllComments) // get all comments

commentRouter.route('/:id')
    .get(getCommentsByPostId) // get comments by postid
    .post(authenticateAccessToken, postComment)
    .patch(authenticateAccessToken, deleteComment); 
    //.put(editComment)

commentRouter.route('/:id/like')
    .all(authenticateAccessToken)
    .post(likeComment);

export default commentRouter;