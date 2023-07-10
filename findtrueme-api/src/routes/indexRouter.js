import express from "express";
import { renderLogin, createDomain } from '../controllers/indexController.js';
import { isLoggedIn, isNotLoggedIn } from '../middlewares/index.js';

const indexRouter = express.Router();

// GET api/
indexRouter.get('/', renderLogin);

// POST api/domain
indexRouter.post('/domain', isLoggedIn, createDomain);

export default indexRouter;

