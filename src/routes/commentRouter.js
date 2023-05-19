import express from "express";
import { isLoggedIn } from "../middlewares/index.js";
import { postComment, deleteComment, likeComment } from "../controllers/commentController.js";

const commentRouter = express.Router();

// /comments
commentRouter.route('/')
    .all(isLoggedIn)
    .post(postComment); // will get postid via form(req.body) in frontend

commentRouter.route('/:id')
    .all(isLoggedIn)
    //.put(editComment)
    .patch(deleteComment); // /comments/:commentid

commentRouter.route('/:id/like')
    .all(isLoggedIn)
    .post(likeComment);

export default commentRouter;