import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import passport from 'passport';
import * as dotenv from 'dotenv';
import methodOverride from 'method-override';

import db from './models/index.js';
import session from 'express-session';
import RedisStore from "connect-redis";
import {createClient} from "redis";
import passportConfig from './passport/index.js';
import { localsMiddleware } from './middlewares/index.js';

import globalRouter from './routes/globalRouter.js';
import authRouter from './routes/authRouter.js';
import userRouter from './routes/userRouter.js';
import postRouter from './routes/postRouter.js';
import commentRouter from './routes/commentRouter.js';


dotenv.config();
const app = express();
passportConfig();
//const multer = require('multer') // v1.0.5
//const upload = multer({ dest: 'uploads/' }) // for parsing multipart/form-data

const redisClient = createClient({
    url: `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
});
redisClient.on('error', err => console.log('Redis Client Error', err));
await redisClient.connect().catch(console.error);
const redisStore = new RedisStore({ 
    client: redisClient,
    socket: {
        connectTimeout: 50000,
    },
});

app.set('port', process.env.PORT || 8001);
app.set('view engine', 'pug');
app.set("views", process.cwd() + "/src/views");

//middleware
app.use(morgan('dev'));
app.use(methodOverride('_method'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    secret: process.env.COOKIE_SECRET,
    saveUninitialized: false,
    resave: false,
    store: redisStore,
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge : 1000 * 60 * 10,
    }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(localsMiddleware)

app.use('/', globalRouter);
app.use('/', authRouter);
app.use('/users', userRouter);
app.use('/posts', postRouter);
app.use('/comments', commentRouter);

db.sequelize
    .sync({ alter: true, force: false })
    .then(() => {
        console.log('database connected!')
    })
    .catch((err) => {
        console.error(err);
    }
);

export default app;