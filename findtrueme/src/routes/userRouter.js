import express from "express";
import { deleteProfile, getProfile, geteditProfile, editProfile, followUser } from "../controllers/userController.js";
import { isLoggedIn, isNotLoggedIn } from '../middlewares/index.js';

// /users
const userRouter = express.Router();
userRouter.route('/:id')
    .all(isLoggedIn)
    .get(getProfile)
    .patch(deleteProfile);
userRouter.route('/:id/edit')
    .all(isLoggedIn)
    .get(geteditProfile)
    .put(editProfile);
userRouter.route('/:id/follow')
    .all(isLoggedIn)
    .post(followUser);

export default userRouter;