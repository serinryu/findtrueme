import express from "express";
import { isLoggedIn } from "../middlewares/index.js";
import { postComment } from "../controllers/commentController.js";

const commentRouter = express.Router();

// /comments
commentRouter.route('/:postid')
    .all(isLoggedIn)
    .post(postComment);
commentRouter.route('/:postid/:commentid')
    .put((req,res) => res.send('Edit comment'))
    .patch((req,res) => res.send('Delete comment'));
commentRouter.post('/:postid/:commentid/like', (req,res) => res.send('Like comment'));

export default commentRouter;