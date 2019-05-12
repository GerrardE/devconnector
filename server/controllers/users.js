import gravatar from 'gravatar';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import validRegistration from '../middlewares/register';
import validLogin from '../middlewares/login';

class UserController {
  // @route  GET api/users/test
  // @desc   Tests users route
  // @access Public
  static test(req, res) {
    res.json({
      message: 'Success: Users working'
    });
  }

  // @route  GET api/users/register
  // @desc   Registers a user
  // @access Public
  static register(req, res) {
    const { errors, isValid } = validRegistration(req.body);

    // Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    User.findOne({
      email: req.body.email
    })
      .then((user) => {
        if (user) {
          errors.message = 'Email already exists, Try a new one.';
          return res.status(400)
            .json({
              success: false,
              errors
            });
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
                    });
                })
                .catch((err) => {
                  errors.message = err;
                  return res.status(400)
                    .json({
                      success: false,
                      errors
                    });
                });
            });
          });
        }
      });
  }

  // @route  GET api/users/login
  // @desc   Logs in a user/ Return JWT
  // @access Public
  static login(req, res) {
    const { errors, isValid } = validLogin(req.body);

    // Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const { email, password } = req.body;

    // Find user by email
    User.findOne({ email })
      .then((user) => {
      // Check if user exists
        if (!user) {
          errors.email = 'Authentication failed: User not found.';
          return res.status(404)
            .json({
              success: false,
              errors
            });
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
              };

              // Sign the token
              jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: 360000 }, (err, token) => {
                if (token) {
                  return res.status(200)
                    .json({
                      success: true,
                      message: 'Authentication successful. User logged in.',
                      token: `Bearer ${token}`
                    });
                }
                errors.message = err;
                return res.status(400)
                  .json({
                    success: false,
                    errors
                  });
              });
            } else {
              errors.email = 'Authentication failed';
              return res.status(400)
                .json({
                  success: false,
                  errors
                });
            }
          });
      });
  }

  // @route  GET api/users/current
  // @desc   Returns the current user
  // @access Private
  static current(req, res) {
    const { id, name, email } = req.user;
    return res.json({
      success: true,
      message: 'Route accessed successfully.',
      user: {
        id, name, email
      }
    });
  }
}

export default UserController;