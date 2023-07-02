import passport from "passport";
import bcrypt from "bcrypt";
import { Strategy as LocalStrategy } from "passport-local";
import db from '../models/index.js';
const User = db.User;

const passportConfig = {
    usernameField: 'email',
    passwordField: 'password',
};

const passportVerify =  async (email, password, done) => {
    try {
        const exUser = await User.findOne({ where: { email }});
        if(exUser) {
            const compareResult = await bcrypt.compare(password, exUser.password);
            if(compareResult) {
                done(null, exUser); // login success, exUser is passed to req.user
            } else {
                done(null, false, { message: 'password is not correct.'});
            }
        } else {
            done(null, false, { message: 'email is not registered.'});
        }
    } catch (error) {
        console.error(error);
        done(error);
    }
};

export default () => {
    passport.use(new LocalStrategy(passportConfig,passportVerify));
}
