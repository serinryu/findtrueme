import express from "express";
import { home } from "../controllers/postController.js";

const globalRouter = express.Router();

globalRouter.get('/', home);

export default globalRouter;