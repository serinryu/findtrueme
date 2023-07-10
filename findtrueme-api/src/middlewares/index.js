import jwt from 'jsonwebtoken';
import { rateLimit } from 'express-rate-limit';
import cors from 'cors';
import db from '../models/index.js';
const Domain = db.Domain;

/*
Session-based authentication
This is a middleware function that checks if the user is logged in or not.
Passport.js provides req.isAuthenticated() method.
*/
export const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) { 
        next();
    } else {
        res.status(401).send('You need to login.');
    }
}

export const isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        next();
    } else {
        res.status(401).send('You are already logged in.');
    }
}

/*
Token-based authentication
*/
export const verifyToken = (req, res, next) => {
    try {
        // token should be sent in the header of the request
        // req.headers.authorization = 'Bearer <token>'
        res.locals.decoded = jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET);
        return next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') { // 유효기간 초과
            return res.status(419).json({
            code: 419,
            message: 'Token has expired.',
            });
        }
        // 유효하지 않은 토큰
        return res.status(401).json({
            code: 401,
            message: 'Token is not valid.',
        });
    }
};

export const deprecated = (req, res) => {
    res.status(410).json({
        code: 410,
        message: 'New version is available. Please update.',
    });
};

export const apiLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // 1 minute 동안 최대 10번 요청 가능
    delayMs: 0,
    handler(req, res) {
        res.status(this.statusCode).json({
            code: this.statusCode, // 기본값 429
            message: 'Too many requests. Please try again later.',
        });
    }
});

export const corsWhenDomainMatches = async (req, res, next) => {
    const domain = await Domain.findOne({
        where: { host : new URL(req.get('origin')).host }, 
    });
    console.log(new URL(req.get('origin')).host);
    if (domain) {
        cors({
            origin: req.get('origin'),
            credentials: true,
        })(req, res, next);
    }
    else {
        // CORS error in the browser
        return res.status(401).json({
            code: 401,
            message: 'Not registered domain. Register domain first.',
        });
    }
};