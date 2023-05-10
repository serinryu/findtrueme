import db from '../models/index.js';
import { Op } from 'sequelize';

const Post = db.Post;

export const board = async(req,res) => {
    try{
        const posts = await Post.findAll();
        return res.render('../views/post/board.pug', {pageTitle: 'Home', posts});
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
        const newpost = await Post.create({
            title,
            content
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

export const getDetailPost = async(req,res) => {
    const { id } = req.params;
    try{
        const post = await Post.findOne({
            where: {
                id
            }
        });
        return res.render('../views/post/detail.pug', {pageTitle: `Title : ${post.title}`, post});
    } catch(error){
        console.log(error);
    }
}

export const geteditPost = async(req,res) => {
    const { id } = req.params;
    try{
        const post = await Post.findOne({
            where: {
                id
            }
        });
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
            where: {
                id
            }
        });
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
            where: {
                id
            }
        });
        await post.destroy(); // later : change status
        return res.redirect('/posts');
    } catch(error){
        console.log(error);
    }
}