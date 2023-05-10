import express from "express";

const globalRouter = express.Router();

globalRouter.get('/', (req,res) => res.send('Home'));
globalRouter.get('/login', (req,res) => res.send('Login'));
globalRouter.get('/join', (req,res) => res.send('Join'));

export default globalRouter;