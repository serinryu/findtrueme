import express from "express";
import { signup, deleteProfile, getProfile, getAllProfile, editProfile, followUser } from "../controllers/userController.js";
import { isLoggedIn, isNotLoggedIn } from '../middlewares/index.js';

const userRouter = express.Router();

// POST /api/users/signup
userRouter.route('/signup')
    .all(isNotLoggedIn)
    .post(signup);

// GET /api/users
userRouter.route('/')
    .all(isLoggedIn)
    .get(getAllProfile)

// GET /api/users/:id
// PATCH /api/users/:id
userRouter.route('/:id')
    .all(isLoggedIn)
    .get(getProfile)
    .put(deleteProfile);

// PUT /api/users/:id
userRouter.route('/:id')
    .all(isLoggedIn) 
    .put(editProfile);

// POST /api/users/:id/follow
userRouter.route('/:id/follow')
    .all(isLoggedIn)
    .post(followUser);


export default userRouter;