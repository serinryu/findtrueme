import express from "express";
import { isLoggedIn } from "../middlewares/index.js";
import { postComment, deleteComment, likeComment } from "../controllers/commentController.js";

const commentRouter = express.Router();

// POST /api/comments
commentRouter.route('/')
    .all(isLoggedIn)
    .post(postComment); // will get postid via form(req.body) in frontend

// PATCH /api/comments/:commentid
commentRouter.route('/:id')
    .all(isLoggedIn) // isCommentOwner 
    .patch(deleteComment); 

// POST /api/comments/:commentid/like
commentRouter.route('/:id/like')
    .all(isLoggedIn)
    .post(likeComment);

export default commentRouter;