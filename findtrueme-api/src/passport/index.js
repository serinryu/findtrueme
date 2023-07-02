import passport from "passport";
import local from "./localStrategy.js";
import db from '../models/index.js';
const User = db.User;

export default () => {

    /*
    로그인 시 세션을 사용한다면 아래의 코드를 넣어줘야한다. 
    보안상 세션이 더 유리하다고 하지만 약간이나마 부담을 덜기 위해 쿠키로 사용하는 방법도 고려해보자.
    */
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