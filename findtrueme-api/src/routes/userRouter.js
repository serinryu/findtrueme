import express from "express";
import { deleteProfile, getProfile, editProfile, followUser } from "../controllers/userController.js";
import { authenticateAccessToken } from '../middlewares/index.js';

// /users
const userRouter = express.Router();

userRouter.route('/:id')
    .all(authenticateAccessToken)
    .get(getProfile)
    .patch(deleteProfile)
    .put(editProfile); // email

userRouter.route('/:id/follow')
    .all(authenticateAccessToken)
    .post(followUser);

export default userRouter;