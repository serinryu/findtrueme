import passport from "passport";
import local from "./localStrategy.js";
import db from '../models/index.js';
const User = db.User;

export default () => {
    passport.serializeUser((user, done) => {
        done(null, user.id); // 세션 객체에 어떤 데이터를 저장할지(user.id)
    });
    
    passport.deserializeUser((id, done) => {
        User.findOne({ where: { id } })
        .then((user) => done(null, user)) // 세션에 저장한 아이디로 사용자 정보를 조회
        .catch((err) => done(err));
    });
    
    local();
};