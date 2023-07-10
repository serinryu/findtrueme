import express from 'express';
import { createToken, tokenTest, getMyPosts, getPostsByHashtag } from '../controllers/v1.js';
import { verifyToken, deprecated } from '../middlewares/index.js';

const router = express.Router();

router.use(deprecated);

// POST /api/v1/token
router.post('/token', createToken);

/* 
Token verification is required for the following routes.
*/

// GET /api/v1/test
router.get('/test', verifyToken, tokenTest);

// GET /api/v1/posts/my
router.get('/posts/my', verifyToken, getMyPosts);

// GET /api/v1/hashtags/:hashtagname
router.get('/hashtags/:hashtagname', verifyToken, getPostsByHashtag);

export default router;
