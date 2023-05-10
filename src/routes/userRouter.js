import express from "express";

const userRouter = express.Router();

// /users
userRouter.route('/{:id}')
    .get((req,res) => res.send('User detail'))
    .put((req,res) => res.send('Edit user'))
    .patch((req,res) => res.send('Delete user'));

userRouter.post('/', (req,res) => res.send('Create user'));
userRouter.post('/{:id}/follow', (req,res) => res.send('Follow user'));

export default userRouter;