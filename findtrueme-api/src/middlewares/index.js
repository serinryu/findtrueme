import jwt from 'jsonwebtoken';

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
        res.locals.decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
        return next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') { // 유효기간 초과
            return res.status(419).json({
            code: 419,
            message: '토큰이 만료되었습니다',
            });
        }
        return res.status(401).json({
            code: 401,
            message: '유효하지 않은 토큰입니다',
        });
    }
};
