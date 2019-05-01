import User from '../models/User';
import gravatar from 'gravatar';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

class UserController {
  // @route  GET api/users/test
  // @desc   Tests users route
  // @access Public
  static test (req, res) {
    res.json({
      message: 'Success: Users working'
    })
  }

  // @route  GET api/users/register
  // @desc   Registers a user
  // @access Public
  static register (req, res) {
    User.findOne({ 
      email: req.body.email
    })
    .then((user) => {
      if (user) {
        return res.status(400)
        .json({
          success: false,
          message: 'Email already exists, Try a new one.'
        })
      } else {
        const avatar = gravatar.url(req.body.email, {
          s: '200', // Size
          r: 'pg', // Rating
          d: 'mm' // Default
      });
        const newUser = new User ({
          name: req.body.name,
          email: req.body.email,
          avatar,
          password: req.body.password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save()
            .then((user) => {
              return res.status(200)
              .json({
                success: true,
                message: 'User created successfully',
                user
              })
            })
            .catch((err) => {
              return res.status(400)
              .json({
                success: false,
                message: err
              })
            })
          })
        })
      }
    })
  }

  // @route  GET api/users/login
  // @desc   Logs in a user/ Return JWT
  // @access Public
  static login (req, res) {
    const {email, password} = req.body;

    // Find user by email
    User.findOne({email})
    .then((user) => {
      // Check if user exists
      if (!user) {
        return res.status(404)
          .json({
            success: false,
            message: 'Authentication failed: User not found.'
          })
      }

      // Check for password match
      bcrypt.compare(password, user.password)
        .then((isMatch) => {
          if (isMatch) {
            // Create the payload
            const payload = {
              id: user.id,
              name: user.name,
              email: user.email,
              avatar: user.avatar
            }

            // Sign the token
            jwt.sign(payload, process.env.SECRET_KEY, {expiresIn: 360000}, (err, token) => {
              if (token) {
                return res.status(200)
                  .json({
                    success: true,
                    message: 'Authentication successful. User logged in.',
                    token: `Bearer ${token}`
                  })
              }
              return res.status(400)
                .json({
                  success: false,
                  message: err
                })
            })
          } else {
            return res.status(400)
              .json({
                success: false,
                message: 'Authentication failed'
            })
          }
        })
    })
  }
}

export default UserController;