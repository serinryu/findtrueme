import express from "express";
import { board, getUploadPost, postUploadPost, filterPost, editPost, deletePost, getDetail, geteditDetail, likePost, getHashtagsPost } from "../controllers/postController.js";
import { isLoggedIn, isNotLoggedIn } from '../middlewares/index.js';

// /posts
const postRouter = express.Router();

postRouter.get('/', board)
postRouter.get('/search', filterPost);

postRouter.route('/hashtag/:hashtag')
    .get(getHashtagsPost);

/*
IsLoggedIn 미들웨어를 사용하여 로그인 여부를 확인하는 로직
*/
postRouter.route('/upload')
    .all(isLoggedIn)
    .get(getUploadPost)
    .post(postUploadPost);

postRouter.route('/:id')
    .all(isLoggedIn)
    .get(getDetail)
    .patch(deletePost);
    
postRouter.route('/:id/edit')
    .all(isLoggedIn)
    .get(geteditDetail)
    .put(editPost)
    
postRouter.route('/:id/like')
    .all(isLoggedIn)
    .post(likePost);

export default postRouter;