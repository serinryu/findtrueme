import express from "express";
import { signup, signin, signout } from '../controllers/authController.js';
import { isLoggedIn, isNotLoggedIn } from '../middlewares/index.js';

const authRouter = express.Router();

// POST api/auth/signup
authRouter.post('/signup', isNotLoggedIn, signup);

// POST api/auth/signin
authRouter.post('/signin', isNotLoggedIn, signin);

// GET api/auth/signout
authRouter.get('/signout', isLoggedIn, signout);

export default authRouter;