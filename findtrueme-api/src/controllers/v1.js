import jwt from 'jsonwebtoken';
import db from '../models/index.js';
const User = db.User;
const Domain = db.Domain;
const Post = db.Post;
const Hashtag = db.Hashtag;

export const createToken = async (req, res) => {
    const { clientSecret } = req.body;
    console.log(clientSecret);
    try {
        const domain = await Domain.findOne({
            where: { clientSecret },
            include: {
                model: User,
                attribute: [ 'id', 'email' ],
            },
        });
        if (!domain) {
            return res.status(401).json({
                code: 401,
                message: 'Not registered domain.',
            });
        }
        const token = jwt.sign({
            id: domain.User.id,
            email: domain.User.email,
        }, process.env.JWT_SECRET, {
            expiresIn: '5m', 
            issuer: 'findtrueme',
        });
        return res.json({
            code: 200,
            message: 'Token has been created.',
            token,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            code: 500,
            message: 'Server error.',
        });
    }
}

export const tokenTest = (req, res) => {
    res.json(res.locals.decoded);
}

export const getMyPosts = (req, res) => {
    console.log(res.locals.decoded);
    Post.findAll({ where: { UserId: res.locals.decoded.id } })
        .then((posts) => {
            res.json({
                code: 200,
                payload: posts,
            });
        }
    ).catch((error) => {
        console.error(error);
        return res.status(500).json({
            code: 500,
            message: 'Server error.',
        });
    }
    );
}

export const getPostsByHashtag = async (req, res) => {
    try {
        const hashtag = await Hashtag.findOne({ where: { hashtag_name : req.params.hashtagname } });
        if (!hashtag) {
            return res.status(404).json({
                code: 404,
                message: 'No search results.',
            });
        }
        const posts = await hashtag.getPosts();
        return res.json({
            code: 200,
            payload: posts,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            code: 500,
            message: 'Server error.',
        });
    }
}