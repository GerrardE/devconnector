import { ExtractJwt, Strategy } from 'passport-jwt';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';

dotenv.config();

const Auth = User.modelName;
const opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET_KEY;

const strategy = (passport) => {
  passport.use(new Strategy(opts, (jwt_payload, done) => {
    const { id } = jwt_payload;
    User.findById(id)
      .then((user) => {
        if (user) {
          return done(null, user)
        }
        return done(null, false);
      })
      .catch(err => console.log(err));
  }));
};

export default strategy;
