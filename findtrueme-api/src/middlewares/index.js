import jwt from 'jsonwebtoken';

/*

// Session-based authentication
// This is a middleware function that checks if the user is logged in or not.
// Passport.js provides req.isAuthenticated() method.

export const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) { 
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
*/

// Token-based authentication
export const authenticateAccessToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    console.log(req.headers);
    const token = authHeader && authHeader.split(' ')[1]; // Bearer token
    if(!token) {
        return res.status(401).json({
            message: 'Access token not found.',
        });
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) {
            console.error(err);
            return res.status(403).json({
                message: 'Access token expired.',
            });
        }
        req.user = user;
        next();
    });
}

// In frontend, we can use res.locals to access the variables.
export const localsMiddleware = (req, res, next) => {
    res.locals.loggedIn = Boolean(req.isAuthenticated());
    res.locals.loggedInUser = req.user || {};
    next();
}