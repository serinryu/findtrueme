import { hash } from 'bcrypt';
import db from '../models/index.js';
import { Op } from 'sequelize';

const Post = db.Post;
const Hashtag = db.Hashtag;

export const home = (req,res) => {
    return res.render('../views/post/home.pug', {pageTitle: 'Home'});
}

export const board = async(req,res) => {
    Post.findAll()
    .then((posts) => {
        console.log(posts);
        res.json({
            code: 200,
            payload: posts,
        });
    })
    .catch(error => {
        console.log(error);
        res.json({
            code: 500,
            message: 'Server Error',
        });
    }
    );
}

export const filterPost = async(req,res) => {
    
    const { title } = req.query;
    Post.findAll({
        where: {
            title: {
                [Op.like]: `%${title}%`
            }
        }
    })
    .then((posts) => {
        console.log(posts);
        res.json({
            code: 200,
            payload: posts,
        });
    })
    .catch(error => {
        console.log(error);
        res.json({
            code: 500,
            message: 'Server Error',
        });
    }
    );
}

export const getHashtagsPost = async(req,res) => {
    const { hashtag } = req.params;

    Hashtag.findOne({
        where: {hashtag_name: hashtag.toLowerCase()}
    })
    .then((hashtagObj) => {
        hashtagObj.getPosts()
        .then((posts) => {
            console.log(posts);
            res.json({
                code: 200,
                payload: posts,
            });
        })
        .catch(error => {
            console.log(error);
            res.json({
                code: 500,
                message: 'Server Error',
            });
        }
        );
    })
    .catch(error => {
        console.log(error);
        res.json({
            code: 500,
            message: 'Server Error',
        });
    }
    );
};

// Need to fix
export const getUploadPost = (req,res) => {
    try{
        return res.render('../views/post/upload.pug', {pageTitle: 'Upload'});
    } catch(error){
        console.log(error);
    }
}


export const postUploadPost = async(req,res) => {
    const { title, content, hashtags } = req.body;
    const hashtagsArr = hashtags.split(', ').map((word) => word.startsWith('#') ? word : `#${word}`);
    
    Post.create({
        title,
        content,
        UserId: req.user.id,
    })
    .then((post) => {
        console.log(post);
        hashtagsArr.map(async(word) => {
            const hashtag = await Hashtag.findOrCreate({
                where: {hashtag_name: word.slice(1).toLowerCase()}
            });
            await post.addHashtag(hashtag[0]);
        });
        res.json({
            code: 200,
            payload: post,
        });
    })
    .catch(error => {
        console.log(error);
        res.json({
            code: 500,
            message: 'Server Error',
        });
    }
    );
}

export const getDetail = async(req,res) => {
    const { id } = req.params;
    Post.findOne({
        where: {id}
    })
    .then((post) => {
        console.log(post);
        res.json({
            code: 200,
            payload: post,
        });
    })
    .catch(error => {
        console.log(error);
        res.json({
            code: 500,
            message: 'Server Error',
        });
    }
    );
}

// Need to fix
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
    Post.update({
        title,
        content
    }, {
        where: {id}
    })
    .then((post) => {
        console.log(post);
        res.json({
            code: 200,
            payload: post,
        });
    })
    .catch(error => {
        console.log(error);
        res.json({
            code: 500,
            message: 'Server Error',
        });
    }
    );
}

export const deletePost = async(req,res) => {
    const { id } = req.params;
    Post.destroy({
        where: {id}
    })
    .then((post) => {
        console.log(post);
        res.json({
            code: 200,
            payload: post,
        });
    })
    .catch(error => {
        console.log(error);
        res.json({
            code: 500,
            message: 'Server Error',
        });
    }
    );
}

export const likePost = async(req,res) => {
    const { id } = req.params;
    Post.findOne({
        where: {id}
    })
    .then(async(post) => {
        console.log(post);
        const likers = await post.getLiker(); // Many-to-Many
        const isLiker = Boolean(likers.find((liker) => liker.id === req.user.id));
        if(isLiker){
            await post.removeLiker(req.user.id);
        } else {
            await post.addLiker(req.user.id);
        }
        res.json({
            code: 200,
            payload: likers
        });
    })
    .catch(error => {
        console.log(error);
        res.json({
            code: 500,
            message: 'Server Error',
        });
    }
    );
};