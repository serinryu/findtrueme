import { v4 as uuidv4 } from 'uuid';
import db from '../models/index.js';
const User = db.User;
const Domain = db.Domain;

export const renderLogin = async (req, res, next) => {
    try {
        const user = await User.findOne({
            where: { id: req.user?.id || null },
            include: [{
                model: Domain,
                attributes: ['host', 'type', 'clientSecret'],
            }],
            order: [[{ model: Domain }, 'createdAt', 'DESC']],
        });
        res.render('login', {
            user: user || null,
            domains: user?.Domains || null,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

export const createDomain = async (req, res, next) => {
    try {
        await Domain.create({
            host: req.body.host,
            type: req.body.type,
            clientSecret: uuidv4(),
            UserId: req.user.id, // req.user.id is from deserializeUser
        });
        return res.status(200).json({
            message: 'Domain created successfully.',
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};