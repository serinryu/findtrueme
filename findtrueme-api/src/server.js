import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import passport from 'passport';
import nunjucks from 'nunjucks';
import * as dotenv from 'dotenv';
import methodOverride from 'method-override';

import db from './models/index.js';
import session from 'express-session';
import RedisStore from "connect-redis";
import {createClient} from "redis";
import passportConfig from './passport/index.js';

import indexRouter from './routes/indexRouter.js';
import authRouter from './routes/authRouter.js';

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

app.set('port', process.env.PORT || 8002);
app.set('view engine', 'html');
nunjucks.configure(process.cwd() + "/src/views", {
    express: app,
    watch: true,
});

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

app.use('/api', indexRouter);
app.use('/api/auth', authRouter);

db.sequelize
    .sync({ alter: false, force: false })
    .then(() => {
        console.log('database connected!')
    })
    .catch((err) => {
        console.error(err);
    }
);

export default app;