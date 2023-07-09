import express from "express";
import { getLogin, postLogin, getJoin, postJoin, logout } from '../controllers/authController.js';
import { isLoggedIn, isNotLoggedIn } from '../middlewares/index.js';

const authRouter = express.Router();

authRouter.route('/login')
    .all(isNotLoggedIn)
    .get(getLogin)
    .post(postLogin);

authRouter.route('/join')
    .all(isNotLoggedIn)
    .get(getJoin)
    .post(postJoin);

authRouter.route('/logout')
    .all(isLoggedIn)
    .get(logout);

export default authRouter;