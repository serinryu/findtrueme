import express from "express";

const commentRouter = express.Router();

// /comments
commentRouter.post('/', (req,res) => res.send('Create comment'));
commentRouter.route('/{:id}')
    .put((req,res) => res.send('Edit comment'))
    .patch((req,res) => res.send('Delete comment'));
commentRouter.post('/{:id}/like', (req,res) => res.send('Like comment'));

export default commentRouter;