import db from '../models/index.js';

const Comment = db.Comment;

export const postComment = async (req, res, next) => {
    try {
        const { content } = req.body;
        const { postid } = req.params;
        await Comment.create({
            content,
            PostId: postid,
            UserId: req.user.id,
        });
        return res.redirect(`/posts/${postid}`);
    } catch (err) {
        console.error(err);
    }
}