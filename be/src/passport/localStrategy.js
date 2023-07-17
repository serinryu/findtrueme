import passport from "passport";
import bcrypt from "bcrypt";
import { Strategy as LocalStrategy } from "passport-local";
import db from '../models/index.js';
const User = db.User;

export default () => {
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        }, async (email, password, done) => {
            try {
                const exUser = await User.findOne({ where: { email }});
                if(exUser) {
                    const result = await bcrypt.compare(password, exUser.password);
                    if(result) {
                        done(null, exUser);
                    } else {
                        done(null, false, { error : 'password is not correct.'});
                    }
                } else {
                    done(null, false, { error : 'email is not registered.'});
                }
            } catch (error) {
                console.error(error);
                done(error);
            }
        }
    ))
};