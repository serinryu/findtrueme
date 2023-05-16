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

// In frontend, we can use res.locals to access the variables.
export const localsMiddleware = (req, res, next) => {
    res.locals.loggedIn = Boolean(req.isAuthenticated());
    res.locals.loggedInUser = req.user || {};
    next();
}