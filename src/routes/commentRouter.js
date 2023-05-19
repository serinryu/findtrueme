import express from "express";
import { isLoggedIn } from "../middlewares/index.js";
import { postComment, deleteComment } from "../controllers/commentController.js";

const commentRouter = express.Router();

// /comments
commentRouter.route('/')
    .all(isLoggedIn)
    .post(postComment);

commentRouter.route('/:id')
    .all(isLoggedIn)
    //.put(editComment)
    .patch(deleteComment); // /comments/:commentid

commentRouter.post('/comment/:id/like', (req,res) => res.send('Like comment'));

export default commentRouter;