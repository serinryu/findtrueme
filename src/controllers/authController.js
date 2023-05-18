import bcrypt from 'bcrypt';
import passport from 'passport';
import db from '../models/index.js';
const User = db.User;

export const getJoin = (req, res) => {
    res.render('../views/user/join', { title: 'Join' });
}

export const postJoin = async (req, res, next) => {
    const { email, username, password, password2 } = req.body;
    if(password !== password2) {
        return res.redirect('/join?joinError=Passwords do not match.');
    }
    try {
        const exUser = await User.findOne({ 
            where: { 
                email
            }
        });
        if(exUser) {
            return res.redirect('/join?joinError=This email or username is already in use.');
        }
        const hash = await bcrypt.hash(password, 12);
        await User.create({
            email,
            username,
            password: hash,
        });
        return res.redirect('/login');
    } catch(error) {
        console.error(error);
        return next(error);
    }
}

export const getLogin = (req, res) => {
    res.render('../views/user/login', { title: 'Login' });
};

export const postLogin = (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => {
        if(authError) {
            console.error(authError);
            return next(authError);
        }
        if(!user) {
            return res.redirect(`/?loginError=${info.message}`);
        }
        return req.login(user, (loginError) => {
            if(loginError) {
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect('/posts');
        });
    }
    )(req, res, next); 
};

export const logout = (req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
}