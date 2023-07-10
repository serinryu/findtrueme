import passport from "passport";
import local from "./localStrategy.js";
import db from '../models/index.js';
const User = db.User;

export default () => {

    // Passport 로 로그인 시 세션을 사용한다면 serializeUser, deserializeUser 함수를 정의해야 한다.

    // login이 최초로 성공했을 때만 호출되는 함수
    passport.serializeUser((user, done) => {
        done(null, user.id); // 세션 객체에 어떤 데이터를 저장할지(user.id)
    });
    
    // 사용자가 페이지를 방문할 때마다 호출되는 함수
    passport.deserializeUser((id, done) => {
        User.findOne({ where: { id } })
        .then((user) => done(null, user)) // 세션에 저장한 아이디로 사용자 정보를 조회
        .catch((err) => done(err));
    });
    
    local();
};