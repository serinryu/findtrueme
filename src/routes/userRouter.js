import express from "express";

const userRouter = express.Router();

// /users
userRouter.post('/', (req,res) => res.send('Create user'));
userRouter.route('/{:id}')
    .get((req,res) => res.send('User detail'))
    .post((req,res) => res.send('Create user'))
    .patch((req,res) => res.send('Delete user'));
userRouter.route('/{:id}/edit')
    .get((req,res) => res.send('Edit user'))
    .put((req,res) => res.send('Edit user'));
userRouter.post('/{:id}/follow', (req,res) => res.send('Follow user'));

export default userRouter;