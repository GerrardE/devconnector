import { ExtractJwt, Strategy } from 'passport-jwt';
import mongoose from 'mongoose';
import User from '../models/User';

const Auth = User.modelName; 
const opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'authorize';

const strategy = (passport) => {
  passport.use(new Strategy(opts, (jwt_payload, done) => {
    const { id } = jwt_payload;
    User.findById(id)
      .then(user => {
        if (user) {
          return done(null, user)
        }
        return done(null, false);
      })
      .catch(err => console.log(err));
  }));
}

export default strategy;
