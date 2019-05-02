import Profile from '../models/Profile';
import User from '../models/User';

class ProfileController {
  // @route  GET api/profile/test
  // @desc   Tests profile route
  // @access Public
  static test (req, res) {
      res.json({
        message: 'Success: Profile working'
    })
  }

  // @route  GET api/profile
  // @desc   Get current user's profile
  // @access Private
  static getUser (req, res) {
    const { id } = req.body;
    const errors = {};

    Profile.findOne({user: id})
      .then(profile => {
        if (!profile) {
          errors.noprofile = 'There is no profile for this user';
          return res.status(404)
            .json({
              success: false,
              errors
            });
        }
      })
      .catch(err => {
        return res.status(404)
          .json({
            success: false,
            err
          });
      })
  }
}

export default ProfileController;