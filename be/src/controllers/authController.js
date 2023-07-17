import passport from 'passport';
import db from '../models/index.js';
const User = db.User;

export const login = (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => {
        if(authError) {
            console.error(authError);
            return next(authError);
        }
        if(!user) {
            return res.status(401).json({ error : 'Login failed'});
        }
        return req.login(user, (loginError) => {
            if(loginError) {
                console.error(loginError);
                return next(loginError);
            }
            return res.status(200).json({ message: 'Login successfully' });
        });
    }
    )(req, res, next); 
};

export const logout = (req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        return res.status(200).json({ message: 'Logout successfully' });
    });
}

// Token based authentication
// export const refresh = (req, res, next) => {
// }

