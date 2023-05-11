import express from "express";

const globalRouter = express.Router();

globalRouter.get('/', (req,res) => res.send('Home'));

export default globalRouter;