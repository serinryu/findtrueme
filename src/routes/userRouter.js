import express from "express";
import { getProfile } from "../controllers/userController.js";

// /users
const userRouter = express.Router();
userRouter.route('/:id')
    .get(getProfile)
    .post((req,res) => res.send('Create user'))
    .patch((req,res) => res.send('Delete user'));
userRouter.route('/:id/edit')
    .get((req,res) => res.send('Edit user'))
    .put((req,res) => res.send('Edit user'));
userRouter.post('/:id/follow', (req,res) => res.send('Follow user'));

export default userRouter;