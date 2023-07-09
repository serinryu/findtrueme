import bcrypt from 'bcrypt';
import passport from 'passport';
import db from '../models/index.js';
import { Op } from 'sequelize';
const User = db.User;

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
            return res.status(200).json({
                message: 'Login successful. You can register domain now.',
            });
        });
    }
    )(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
};

export const signout = (req, res, next) => {
    try { 
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