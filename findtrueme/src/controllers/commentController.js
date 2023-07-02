import { where } from 'sequelize';
import db from '../models/index.js';

const Comment = db.Comment;

export const postComment = async (req, res, next) => {
    try {
        const { content, PostId } = req.body;
        await Comment.create({
            content,
            PostId,
            UserId: req.user.id,
        });
        return res.redirect(`/posts/${PostId}`);
    } catch (err) {
        console.error(err);
    }
};

export const deleteComment = async (req, res, next) => {
    const { id } = req.params; //commentid
    try {
        const comment = await Comment.findOne({
            where: { id },
        });
        //session check
        if(comment.UserId !== req.user.id){
            return res.redirect(`/posts/${comment.PostId}`);
        };
        await comment.destroy();
        return res.redirect(`/posts/${comment.PostId}`);
    } catch (err) {
        console.error(err);
    }
};

export const likeComment = async (req, res, next) => {
    const { id } = req.params; //commentid
    try {
        const comment = await Comment.findOne({
            where: { id },
        });
        // Q : Should I check if user already liked the comment?
        // If so, database should be changed?
        await comment.update({
            like_count : comment.like_count + 1,
        });
        return res.redirect(`/posts/${comment.PostId}`);
    } catch (err) {
        console.error(err);
    }
}