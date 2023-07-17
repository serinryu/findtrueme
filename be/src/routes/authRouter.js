import express from "express";
import { login, logout } from '../controllers/authController.js';
import { isLoggedIn, isNotLoggedIn } from '../middlewares/index.js';

const authRouter = express.Router();

// POST /account/login
authRouter.route('/login')
    .all(isNotLoggedIn)
    .post(login);

// POST /account/logout
authRouter.route('/logout')
    .all(isLoggedIn)
    .post(logout);

// POST /account/refresh
// authRouter.route('/refresh')
//     .post(refresh);

export default authRouter;