import express from "express";
import { board, uploadPost, filterPost, editPost, deletePost, getDetail, likePost, getHashtagsPost } from "../controllers/postController.js";
import { isLoggedIn, isNotLoggedIn } from '../middlewares/index.js';

const postRouter = express.Router();

// GET /api/posts
postRouter.get('/', board);

// POST /api/posts
postRouter.route('/')
    .all(isLoggedIn)
    .post(uploadPost);

// GET /api/posts/:id 
// PUT /api/posts/:id
// PATCH /api/posts/:id
postRouter.route('/:id')
    .get(getDetail)
    .put(editPost)
    .patch(deletePost);
    
// POST /api/posts/:id/like
postRouter.route('/:id/like')
    .all(isLoggedIn)
    .post(likePost);

// GET /api/posts/search
postRouter.get('/search', filterPost);

// GET /api/posts/hashtag/:hashtag
postRouter.get('/hashtag/:hashtag', getHashtagsPost);

export default postRouter;