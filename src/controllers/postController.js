import db from '../models/index.js';
import { Op } from 'sequelize';

const Post = db.Post;

export const home = (req,res) => {
    return res.render('../views/post/home.pug', {pageTitle: 'Home'});
}

export const board = async(req,res) => {
    try{
        const posts = await Post.findAll();
        return res.render('../views/post/board.pug', {pageTitle: 'Board', posts});
    } catch(error){
        console.log(error);
    }
}

export const getUploadPost = (req,res) => {
    try{
        return res.render('../views/post/upload.pug', {pageTitle: 'Upload'});
    } catch(error){
        console.log(error);
    }
}

export const postUploadPost = async(req,res) => {
    const { title, content } = req.body;
    try{
        await Post.create({
            title,
            content,
            UserId: req.user.id
        });
        return res.redirect('/posts');
    } catch(error){
        console.log(error);
    }
}

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
        return res.render('../views/post/board.pug', {pageTitle: `Searching by ${title}`, posts});
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
        const user = await post.getUser(); // One-to-One
        const comments = await post.getComments(); // One-to-Many
        const likers = await post.getLiker(); // Many-to-Many
        return res.render('../views/post/detail.pug', {pageTitle: `Title : ${post.title}`, post, user, likers, comments});
    } catch(error){
        console.log(error);
    }
}

export const geteditDetail = async(req,res) => {
    const { id } = req.params;
    try{
        const post = await Post.findOne({
            where: {id}
        });
        // session check
        if(post.UserId !== req.user.id){
            return res.redirect('/posts');
        }
        return res.render('../views/post/edit.pug', {pageTitle: `Edit : ${post.title}`, post});
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
        // session check
        if(post.UserId !== req.user.id){
            return res.redirect('/posts');
        }
        await post.update({
            title,
            content
        });
        return res.redirect(`/posts/${id}`);
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
        // session check
        if(post.UserId !== req.user.id){
            return res.redirect('/posts');
        }
        await post.destroy();
        return res.redirect('/posts');
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
        /* if you want to remove like
        if(post.hasLiker(req.user.id)){
            await post.removeLiker(req.user.id);
        }
        */
        await post.addLiker(req.user.id);
        return res.redirect(`/posts/${id}`);
    } catch(error){
        console.log(error);
    }
}