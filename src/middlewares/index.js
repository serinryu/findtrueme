export const isLoggedIn = (req, res, next) => {
    console.log(req.isAuthenticated());
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