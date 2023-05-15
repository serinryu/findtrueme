import passport from "passport";
import local from "./localStrategy.js";
import db from '../models/index.js';
const User = db.User;

export default () => {
    passport.serializeUser((user, done) => {
        done(null, user.id); // req.session에 user.id가 저장됨
    });
    
    passport.deserializeUser((id, done) => {
        User.findOne({ where: { id } })
        .then((user) => done(null, user)) // req.user에 저장됨
        .catch((err) => done(err));
    });
    
    local();
};