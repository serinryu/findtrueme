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
        }
        return res.render("../views/user/profile.pug", { pageTitle : `${user.username}'s profile`, user , user});
    } catch (err) {
        console.error(err);
    }
};
