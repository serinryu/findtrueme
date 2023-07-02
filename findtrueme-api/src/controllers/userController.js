import db from '../models/index.js';
const User = db.User;

export const getProfile = async(req,res) => {
    const { id } = req.params;
    try {
        const user = await User.findOne({
            where: {
                id,
            }
        });
        if (!user) {
            return res.json({
                code: 404,
                message: 'User is not found',
            });
        }
        return res.json({
            code: 200,
            payload: user,
        });
    } catch (err) {
        console.error(err);
    }
};

export const deleteProfile = async(req,res) => {
    const { id } = req.params;
    try {
        // session check - passport
        if (parseInt(id, 10) !== req.user.id) {
            return res.json({
                code: 404,
                message: 'It is not you.',
            });
        };

        await User.destroy({
            where: {
                id: req.user.id,
            }
        });

        // session logout - passport
        req.logout();

        return res.json({
            code: 200,
            message: 'User is deleted.',
        });
    } catch (err) {
        console.error(err);
    }
};

export const editProfile = async(req,res) => {
    const { id } = req.params;
    const { email } = req.body; // only email

    try {
        // session check
        if (parseInt(id, 10) !== req.user.id) {
            return res.json({
                code: 404,
                message: 'It is not you.',
            });
        };
        const user = await User.findOne({
            where: { email }
        });
        if (user) {
            return res.json({
                code: 400,
                message: 'This email is already taken.',
            });
        };
        await User.update({
            email,
        }, { where: { id } });
        return res.json({
            code: 200,
            message: 'User is updated.',
        });
    } catch (err) {
        console.error(err);
    }
};

export const followUser = async(req,res) => {
    const { id } = req.params;

    try {
        // session check
        if(parseInt(id, 10) !== req.user.id) {
            return res.json({
                code: 400,
                message: 'You cannot follow yourself.',
            });
        };
        const user = await User.findOne({
            where: {id}
        });
        if (!user) {
            return res.json({
                code: 404,
                message: 'User is not found',
            });
        };

        // backend validation
        const followers = await user.getFollowers();
        const isFollower = Boolean(followers.find((follower) => follower.id === req.user.id));
        if (isFollower){
            // unfollow
            await user.removeFollowers(req.user.id); // Followers
            await req.user.removeFollowings(parseInt(id)); // Followings
            return res.json({
                code: 200,
                message: 'Unfollowed.',
            });
        } else {
            // follow
            await user.addFollowers(req.user.id); // Followers
            await req.user.addFollowings(parseInt(id)); // Followings
            return res.json({
                code: 200,
                message: 'Followed.',
            });
        }
    } catch (err) {
        console.error(err);
    }
};
