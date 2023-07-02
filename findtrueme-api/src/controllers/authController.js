import bcrypt from 'bcrypt';
import passport from 'passport';
import jwt from 'jsonwebtoken';
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

// access token을 secret key 기반으로 생성
const generateAccessToken = (id) => {
    return jwt.sign({
        id,
    }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '15m',
    });
}

// refresh token을 secret key 기반으로 생성
const generateRefreshToken = (id) => {
    return jwt.sign({
        id,
    }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '7d',
    });
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
            
            // create token
            const accessToken = generateAccessToken(user.id);
            const refreshToken = generateRefreshToken(user.id);

            // res.cookie('refreshToken', refreshToken, {
            //     httpOnly: true,
            //     secure: false,
            // });
            // res.cookie('accessToken', accessToken, {
            //     httpOnly: true,
            //     secure: false,
            // });
            return res.status(200).json({
                message: 'Login successful.',
            });
        });
    }
    )(req, res, next);
};

// access token을 refresh token 기반으로 재발급
export const refresh = (req, res, next) => {
    let refreshToken = req.body.refreshToken;
    if(!refreshToken) {
        return res.status(401).json({
            message: 'Refresh token not found.',
        });
    }
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if(err) {
            console.error(err);
            return res.status(403).json({
                message: 'Refresh token expired.',
            });
        }
        const accessToken = generateAccessToken(user.id);
        res.json({ accessToken });
    });
}

export const signout = (req, res, next) => {
    try {
        // req.cookies.refreshToken = null;
        // req.cookies.accessToken = null;
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