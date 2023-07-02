import express from "express";
import { signup, signin, signout, refresh } from '../controllers/authController.js';
import { authenticateAccessToken } from '../middlewares/index.js';

const authRouter = express.Router();

authRouter.post('/signup', signup);

authRouter.post('/signin', signin);

authRouter.get('/signout', authenticateAccessToken, signout);

authRouter.post('/refresh', refresh);

export default authRouter;