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

  // @route  POST api/profile
  // @desc   Create/Update user profile
  // @access Private
  static createUser (req, res) {
    const { profileFields } = {};
    profileFields.user = req.user.id;
    const errors = {};

    
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.githubusername) profileFields.githubusername = req.body.githubusername;

    // Split the skills into an array
    if (typeof req.body.skills !== 'undefined') {
      profileFields.skills = req.body.skills.split(',');
    }

    // Social
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

    Profile.findOne({user: req.user.id})
      .then(profile => {
        if(profile) {
          // Update
          Profile.findOneAndUpdate({user: req.user.id}, {$set: profileFields}, {new: true})
            .then(profile => {
              res.status(200)
                .json({
                  success: true,
                  message: 'Profile updated successfully',
                  profile
                })
            });
        } else {
          // Create
          // Check if handle exists
          Profile.findOne({handle: req.user.id})
            .then(profile => {
              if (profile) {
                errors.handle = 'That handle already exists';
                return res.status(400)
                  .json({
                    success: false,
                    errors
                  })
              }

              // Save Profile
              new Profile(profileFields).save()
                .then(profile => {
                  return res.status(200)
                  .json({
                    success: true,
                    message: 'Profile created successfully',
                    profile
                  })
                })
            })
        }
      })

    
  } 
}

export default ProfileController;