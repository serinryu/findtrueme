import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import session from 'express-session';
import * as dotenv from 'dotenv';
import methodOverride from 'method-override';

import globalRouter from './routes/globalRouter.js';
import userRouter from './routes/userRouter.js';
import postRouter from './routes/postRouter.js';
import commentRouter from './routes/commentRouter.js';
import db from './models/index.js';
const app = express();
//const multer = require('multer') // v1.0.5
//const upload = multer({ dest: 'uploads/' }) // for parsing multipart/form-data
dotenv.config();

app.set('port', process.env.PORT || 8001);
app.set('view engine', 'pug');
app.set("views", process.cwd() + "/src/views");

//middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    }
}));
app.use(methodOverride('_method'));

app.use('/', globalRouter);
app.use('/users', userRouter);
app.use('/posts', postRouter);
app.use('/comments', commentRouter);

db.sequelize
    .sync()
    .then(() => {
        console.log('database connected!')
    })
    .catch((err) => {
        console.error(err);
    }
);

export default app;