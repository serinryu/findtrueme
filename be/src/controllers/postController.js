import db from '../models/index.js';
import { Op } from 'sequelize';

const Post = db.Post;
const Hashtag = db.Hashtag;

export const welcome = (req,res) => {
    return res.status(200).json({ message : "Welcome to the backend server"});
}

export const board = async(req,res) => {
    try{
        const posts = await Post.findAll();
        return res.status(200).json(posts);
    } catch(error){
        console.log(error);
    }
}

export const uploadPost = async(req,res) => {
    const { title, content, hashtags } = req.body;
    const hashtagsArr = hashtags.split(', ').map((word) => word.startsWith('#') ? word : `#${word}`);
    try{
        const post = await Post.create({
            title,
            content,
            UserId: req.user.id,
        });
        // put hashtags in Hashtag table
        hashtagsArr.map(async(word) => {
            const hashtag = await Hashtag.findOrCreate({
                where: {hashtag_name: word.slice(1).toLowerCase()}
            });
            await post.addHashtag(hashtag[0]); 
        });
        return res.status(201).json({ message : "Post created successfully"});
    } catch(error){
        console.log(error);
    }
}

export const getDetail = async(req,res) => {
    const { id } = req.params;
    try{
        const post = await Post.findOne({
            where: {id}
        });
        if(!post){
            return res.status(404).json({ error : "Post is not found"});
        };

        // bring user, comments, likers to show in front-end
        const user = await post.getUser(); 
        const hashtags = await post.getHashtags();
        const hashtagNames = hashtags.map((hashtag) => hashtag.hashtag_name);
        const comments = await post.getComments(); 
        const likers = await post.getLiker(); 
        const isLiker = Boolean(likers.find((liker) => liker.id === req.user.id));

        return res.status(200).json({post, user, hashtagNames, comments, likers, isLiker});

    } catch(error){
        console.log(error);
    }
}

export const editPost = async(req,res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    try{
        const post = await Post.findOne({
            where: {id}
        });
        if(!post){
            return res.status(404).json({ error : "Post is not found" });
        };

        // IsPostOwner
        if(post.UserId !== req.user.id){
            return res.status(403).json({ message : "You are not allowed to edit this post" });
        }
        
        await post.update({
            title,
            content
        });
        return res.status(200).json({ message : "Post updated successfully" });
    } catch(error){
        console.log(error);
    }
}

export const deletePost = async(req,res) => {
    const { id } = req.params;
    try{
        const post = await Post.findOne({
            where: {id}
        });
        if(!post){
            return res.status(404).json({ error : "Post is not found" });
        };

        // IsPostOwner
        if(post.UserId !== req.user.id){
            return res.status(403).json({ message : "You are not allowed to delete this post" });
        }

        await post.destroy();
        return res.status(200).json({ message : "Post deleted successfully" });
    } catch(error){
        console.log(error);
    }
}

export const likePost = async(req,res) => {
    const { id } = req.params;
    try{
        const post = await Post.findOne({
            where: {id}
        });
        if(!post){
            return res.status(404).json({ message : "Post is not found" });
        };

        // isNotPostOwner
        if(post.UserId === req.user.id){
            return res.status(404).json({ message : "You cannot like your own post" });
        };

        // backend validation
        const likers = await post.getLiker(); // Many-to-Many
        const isLiker = Boolean(likers.find((liker) => liker.id === req.user.id));
        if(isLiker){
            await post.removeLiker(req.user.id);
        } else {
            await post.addLiker(req.user.id);
        }
        return res.status(200).json({ message : "Post liked successfully" });
    } catch(error){
        console.log(error);
    }
};

export const filterPost = async(req,res) => {
    const { title } = req.query;
    try{
        const posts = await Post.findAll({
            where: {
                title: {
                    [Op.like]: `%${title}%`
                }
            }
        });
        return res.status(200).json(posts);
    } catch(error){
        console.log(error);
    }
};

export const getHashtagsPost = async(req,res) => {
    const { hashtag } = req.params;
    try{
        const hashtagObj = await Hashtag.findOne({
            where: {hashtag_name: hashtag.toLowerCase()}
        });
        if(!hashtagObj){
            return res.status(404).json({ error : "Hashtag is not found"});
        };
        
        const posts = await hashtagObj.getPosts();
        return res.status(200).json(posts);
    }
    catch(error){
        console.log(error);
    }
};