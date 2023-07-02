import bcrypt from 'bcrypt';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import db from '../models/index.js';
import { Op } from 'sequelize';
const User = db.User;

// Need to fix this
// export const getJoin = (req, res) => {
//     res.render('../views/user/join', { title: 'Join' });
// }

export const signup = async (req, res, next) => {
    const { email, username, password, password2 } = req.body;

    if(password !== password2) {
        return res.status(400).json({
            code: 400,
            message: 'Passwords do not match.',
        });
    }
    try {
        const exUser = await User.findOne({
            where: {
                [Op.or]: [
                    { email },
                    { username }
                ]
            }
        });
        if(exUser) {
            return res.status(400).json({
                message: 'This email or username is already in use.',
            });
        }
        const hash = await bcrypt.hash(password, 12);
        await User.create({
            email,
            username,
            password: hash,
        });
        return res.status(200).json({
            message: 'User created successfully.',
        });
    } catch(error) {
        console.error(error);
        return res.status(500).json({
            message: error.message
        });
    }
}

// Need to fix this
// export const getLogin = (req, res) => {
//     res.render('../views/user/login', { title: 'Login' });
// };

export const signin = (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => {
        // auth error or user not found
        if(authError){
            console.error(authError);
            return next(authError);
        }
        if(!user) {
            return res.status(400).json({
                message: info.message,
            });
        }
        // login
        return req.login(user, (loginError) => {
            if(loginError) {
                res.send(loginError);
                return next(loginError);
            }
            // create token
            const token = jwt.sign({
                id: user.id,
            }, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '15m',
            });
            console.log(token);
            req.cookies.token = token;
        
            return res.status(200).json({
                message: 'Login successful.',
            });
        });
    }
    )(req, res, next);

    /*
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
    */
};

export const signout = (req, res, next) => {
    
    try {
        req.cookies.token = null;
        req.logout(function (err) { // req.logout() is added by passport, destroys req.user
            if(err) {
                console.error(err);
                return next(err);
            }
        });
        return res.status(200).json({
            message: 'Logout successful.',
        });
    } catch(error) {
        console.error(error);
        return res.status(500).json({
            message: error.message
        });
    }
}