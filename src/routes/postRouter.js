import express from "express";
import { board, getUploadPost, postUploadPost, filterPost, editPost, deletePost, getDetail, geteditDetail } from "../controllers/postController.js";
import { isLoggedIn, isNotLoggedIn } from '../middlewares/index.js';

// /posts
const postRouter = express.Router();

postRouter.get('/', board)
postRouter.get('/search', filterPost);
postRouter.route('/upload')
    .all(isLoggedIn)
    .get(getUploadPost)
    .post(postUploadPost);

postRouter.route('/:id')
    .get(getDetail)
    .patch(deletePost);
    
postRouter.route('/:id/edit')
    .all(isLoggedIn)
    .get(geteditDetail)
    .put(editPost)
    
postRouter.post('/:id/like', (req,res) => res.send('Like post'));

export default postRouter;