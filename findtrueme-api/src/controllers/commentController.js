import { where } from 'sequelize';
import db from '../models/index.js';

const Comment = db.Comment;

export const getAllComments = async (req, res, next) => {
    try {
        const comments = await Comment.findAll({
            order: [['createdAt', 'DESC']],
        });
        return res.json({ comments });
    } catch (err) {
        console.error(err);
    }
};

export const getCommentsByPostId = async (req, res, next) => {
    const { id } = req.params;
    try {
        const comments = await Comment.findAll({
            where: { PostId: postid },
            order: [['createdAt', 'DESC']],
        });
        return res.json({ comments });
    } catch (err) {
        console.error(err);
    }
};

export const postComment = async (req, res, next) => {
    const { content } = req.body;
    const { id } = req.params;
    Comment.create({
        content,
        UserId: req.user.id,
        PostId: id,
    })
    .then((comment) => {
        console.log(comment);
        res.json({
            code: 200,
            payload: comment,
        });
    }
    )
    .catch(error => {
        console.log(error);
        res.json({
            code: 500,
            message: 'Server Error',
        });
    }
    );
};

export const deleteComment = async (req, res, next) => {
    const { id } = req.params; //commentid

    try {
        const comment = await Comment.findOne({
            where: { id },
        });
        // session check - if not the same user, return false
        if(comment.UserId !== req.user.id){
            return res.json({ success: false });
        };
        // delete comment
        await comment.destroy(); 
        return res.json({ success: true });
    }
    catch (err) {
        console.error(err);
    }
};

export const likeComment = async (req, res, next) => {
    const { id } = req.params; //commentid

    try {
        const comment = await Comment.findOne({
            where: { id },
        });
        // check if user already liked the comment, need to change database.
        // const liked = await comment.getLikers({
        //     where: { id: req.user.id },
        // });
        // if(liked.length > 0){
        await comment.update({
            like_count : comment.like_count + 1,
        });
        return res.json({ success: true });
    } catch (err) {
        console.error(err);
    }
}