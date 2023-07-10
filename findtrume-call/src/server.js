import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import nunjucks from 'nunjucks';
import * as dotenv from 'dotenv';
import session from 'express-session';

import router from './routes/index.js';

dotenv.config();
const app = express();

app.set('port', process.env.PORT || 4000);
app.set('view engine', 'html');
nunjucks.configure(process.cwd() + "/src/views", {
    express: app,
    watch: true,
});

//middleware
app.use(morgan('dev'));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    secret: process.env.COOKIE_SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge : 1000 * 60 * 10,
    }
}));

app.use('/', router);

app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);
});

app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

export default app;