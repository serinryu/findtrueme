import express from 'express';
import { createToken, tokenTest, getMyPosts, getPostsByHashtag } from '../controllers/v1.js';
import { verifyToken, apiLimiter, corsWhenDomainMatches } from '../middlewares/index.js';

const router = express.Router();

router.use(corsWhenDomainMatches);

// POST /api/v2/token
router.post('/token', apiLimiter, createToken);

/* 
Token verification is required for the following routes.
*/

// GET /api/v2/test
router.get('/test', apiLimiter, verifyToken, tokenTest);

// GET /api/v2/posts/my
router.get('/posts/my', apiLimiter, verifyToken, getMyPosts);

// GET /api/v2/hashtags/:hashtagname
router.get('/hashtags/:hashtagname', apiLimiter, verifyToken, getPostsByHashtag);

export default router;
