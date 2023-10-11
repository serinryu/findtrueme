import express from "express";
import { welcome } from "../controllers/postController.js";

const globalRouter = express.Router();

globalRouter.get('/', welcome);

export default globalRouter;