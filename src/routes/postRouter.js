import express from "express";
import { board, getUploadPost, postUploadPost, filterPost, getDetailPost, editPost, deletePost, geteditPost } from "../controllers/postController.js";

// /posts
const postRouter = express.Router();

postRouter.get('/', board)
postRouter.get('/search', filterPost);
postRouter.route('/upload')
    .get(getUploadPost)
    .post(postUploadPost);

postRouter.route('/:id')
    .get(getDetailPost)
    .patch(deletePost);
    
postRouter.route('/:id/edit')
    .get(geteditPost)
    .put(editPost)
    
postRouter.post('/:id/like', (req,res) => res.send('Like post'));

export default postRouter;