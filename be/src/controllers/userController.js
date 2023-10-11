import { Op } from 'sequelize';
import bcrypt from 'bcrypt';
import db from '../models/index.js';
const User = db.User;

export const signup = async (req, res) => {
    const { email, username, password, password2 } = req.body;
    if(password !== password2) {
        return res.status(400).json({ error : "Passwords do not match." });
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
            return res.status(409).json({ error : "User already exists." });
        }
        const hash = await bcrypt.hash(password, 12);
        await User.create({
            email,
            username,
            password: hash,
        });
        return res.render('login', { message : "Signup successfully. Please login." });
    } catch(error) {
        console.error(error);
    }
}

export const getAllProfile = async(req,res) => {
    try {
        const users = await User.findAll();
        return res.status(200).json(users);
    } catch (err) {
        console.error(err);
    }
}

export const getProfile = async(req,res) => {
    const { id } = req.params;
    console.log(id);
    try {
        const user = await User.findOne({
            where: {
                id,
            }
        });
        if (!user) {
            return res.status(404).json({ error : "User is not found" });    
        };

        // bring followers, followings, posts, comments, likedpost to show in front-end
        const followers = await user.getFollowers();
        const followersList = followers.map((follower) => follower.username);
        const followings = await user.getFollowings();
        const followingsList = followings.map((following) => following.username);
        const posts = await user.getPosts();
        const comments = await user.getComments();
        const likedpost = await user.getLiked(); 
        const isFollower = Boolean(followers.find((follower) => follower.id === req.user.id));

        return res.status(200).json({user, followersList, followingsList, posts, comments, likedpost, isFollower});

    } catch (err) {
        console.error(err);
    }
};

export const deleteProfile = async(req,res) => {
    const { id } = req.params;
    try {
        // session check
        if (parseInt(id, 10) !== req.user.id) {
            return res.status(404).json({ error : "Session is not matched. Login again." });
        };

        await User.destroy({
            where: {
                id: req.user.id,
            }
        });

        // session logout
        req.logout();
        req.session.destroy();
        return res.status(200).json({ message : "User is deleted." });
        //return res.redirect("/");
    } catch (err) {
        console.error(err);
    }
};


export const editProfile = async(req,res) => {
    const { id } = req.params;
    const { email } = req.body;
    try {
        // session check
        if (parseInt(id, 10) !== req.user.id) {
            return res.status(404).json({ error : "Session is not matched. Login again." });
        };

        const user = await User.findOne({
            where: { email } 
        });
        if (user) {
            return res.status(409).json({ error : "Email already exists." })
        };

        await User.update({
            email,
            }, {where: {id}}
        );
        return res.status(200).json({ message : "User is updated." });
        //return res.redirect(`/users/${id}`);
    } catch (err) {
        console.error(err);
    }
    
};

export const followUser = async(req,res) => {
    const { id } = req.params;
    try {
        // session check
        if(parseInt(id, 10) == req.user.id) {
            return res.status(404).json({ error : "You cannot follow yourself." });
        };

        const user = await User.findOne({
            where: {id}
        });
        if (!user) {
            return res.status(404).json({ error : "User is not found" });
        };

        // backend validation
        const followers = await user.getFollowers();
        const isFollower = Boolean(followers.find((follower) => follower.id === req.user.id));
        if (isFollower){
            // unfollow
            await user.removeFollowers(req.user.id); // Followers
            await req.user.removeFollowings(parseInt(id)); // Followings
        } else {
            // follow
            await user.addFollowers(req.user.id); // Followers
            await req.user.addFollowings(parseInt(id)); // Followings
        }

        return res.status(200).json({ message : "Follow successfully" });
        //return res.redirect(`/users/${id}`);
    } catch (err) {
        console.error(err);
    }
};
