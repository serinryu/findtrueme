import db from '../models/index.js';
const User = db.User;

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
            return res.status(404).render("../views/partials/404.pug", { pageTitle: "User is not found"})
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

        return res.render("../views/user/profile.pug", { pageTitle : `${user.username}'s profile`, user , followersList, followingsList, posts, comments, likedpost, isFollower});

    } catch (err) {
        console.error(err);
    }
};

export const deleteProfile = async(req,res) => {
    const { id } = req.params;
    try {
        // session check
        if (parseInt(id, 10) !== req.user.id) {
            return res.status(404).render("../views/partials/404.pug", { pageTitle: "It is not you."})
        };

        await User.destroy({
            where: {
                id: req.user.id,
            }
        });

        // session logout
        req.logout();

        return res.redirect("/");
    } catch (err) {
        console.error(err);
    }
};

export const geteditProfile = async(req,res) => {
    const { id } = req.params;
    try {
        //session check
        if (parseInt(id, 10) !== req.user.id) {
            return res.status(404).render("../views/partials/404.pug", { pageTitle: "It is not you."})
        };

        const user = await User.findOne({
            where: {id}
        });
        if (!user) {
            return res.status(404).render("../views/partials/404.pug", { pageTitle: "User is not found"})
        };

        return res.render("../views/user/editProfile.pug", { pageTitle : `${user.username}'s profile`, user , user});
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
            return res.status(404).render("../views/partials/404.pug", { pageTitle: "It is not you."})
        };

        const user = await User.findOne({
            where: { email } 
        });
        if (user) {
            return res.status(400).render("../views/partials/404.pug", { pageTitle: "This email is already taken."});
        };

        await User.update({
            email,
            }, {where: {id}}
        );
        return res.redirect(`/users/${id}`);
    } catch (err) {
        console.error(err);
    }
    
};

export const followUser = async(req,res) => {
    const { id } = req.params;
    try {
        // session check
        if(parseInt(id, 10) !== req.user.id) {
            return res.status(400).render("../views/partials/404.pug", { pageTitle: "You cannot follow yourself."});
        };

        const user = await User.findOne({
            where: {id}
        });
        if (!user) {
            return res.status(404).render("../views/partials/404.pug", { pageTitle: "User is not found"})
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

        return res.redirect(`/users/${id}`);
    } catch (err) {
        console.error(err);
    }
};
