import express from "express";
import { signup, signin, signout } from '../controllers/authController.js';
import { isLoggedIn, isNotLoggedIn } from '../middlewares/index.js';

const authRouter = express.Router();

authRouter.route('/api/auth/signup') // join
    .all(isNotLoggedIn)
    //.get(getJoin)
    .post(signup);

authRouter.route('/api/auth/signin') // login
    .all(isNotLoggedIn)
    //.get(getLogin)
    .post(signin);

authRouter.route('/api/auth/signout') // logout
    .all(isLoggedIn)
    .get(signout);

export default authRouter;