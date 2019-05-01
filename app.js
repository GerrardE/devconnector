import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import passport from 'passport';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import strategy from './server/helpers/passport';
import users from './server/routes/api/users';
import profile from './server/routes/api/profile.js';
import posts from './server/routes/api/posts';
 
const app = express();
dotenv.config();
app.use(morgan('tiny'));

// DB config
const db = process.env.DATABASE;
// connect to MongoDb
mongoose
  .connect(db)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log(err))
  
// Passport middleware
app.use(passport.initialize());
strategy(passport);

// Configure body parser
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());  
  
// Use the router and dotenv
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

const port = process.env.PORT || 3000;
// Listen on the port
app.listen(port, () => {
  console.log(`Server started at port ${port}`)
})