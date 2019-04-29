import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import users from './server/routes/api/users';
import profile from './server/routes/api/profile.js';
import posts from './server/routes/api/posts';


const app = express();

// Use the router and dotenv
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);
dotenv.config();

// DB config
const db = process.env.DATABASE;
// connect to MongoDb
mongoose
  .connect(db)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log(err))

const port = process.env.PORT || 3000;
// Listen on the port
app.listen(port, () => {
  console.log(`Server started at port ${port}`)
})