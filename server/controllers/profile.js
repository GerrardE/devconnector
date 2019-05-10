import Profile from '../models/Profile';
import User from '../models/User';
import validProfile from '../middlewares/profile';
import validExperience from '../middlewares/experience';
import validEducation from '../middlewares/education';

class ProfileController {
  // @route  GET api/profile/test
  // @desc   Tests profile route
  // @access Public
  static test(req, res) {
    res.json({
      message: 'Success: Profile working'
    });
  }

  // @route  GET api/profile
  // @desc   Get current user's profile
  // @access Private
  static getUser(req, res) {
    const id = req.user.id;
    const errors = {};

    Profile.findOne({user: id})
      .populate('user', ['name', 'avatar'])
      .then(profile => {
        if (!profile) {
          errors.noprofile = 'There is no profile for this user';
          return res.status(404)
            .json({
              success: false,
              errors
            });
        }
        return res.status(200)
          .json({
            success: true,
            profile
          });
      })
      .catch(err => {
        return res.status(404)
          .json({
            success: false,
            err
          });
      });
  }

  // @route  POST api/profile
  // @desc   Create/Update user profile
  // @access Private
  static createUser(req, res) {
    const profileFields = {};
    profileFields.user = req.user.id;
    const { errors, isValid } = validProfile(req.body);
    
    // Check validation
    if (!isValid) {
      // return any error with 400 status
      return res.status(400)
        .json({
          success: false,
          errors
        });
    }
    
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
      .populate('user', ['name', 'avatar'])
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
                });
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
                  });
              }

              // Save Profile
              new Profile(profileFields).save()
                .then(profile => {
                  return res.status(200)
                    .json({
                      success: true,
                      message: 'Profile created successfully',
                      profile
                    });
                });
            });
        }
      });

    
  } 

  // @route  GET api/profile/handle/:handle
  // @desc   Get current user's profile by handle
  // @access Public
  static getProfileByHandle(req, res) {
    const errors = {};

    Profile.findOne({handle: req.params.handle})
      .populate('user', ['name', 'avatar'])
      .then(profile => {
        if(!profile) {
          errors.noprofile = 'There is no profile for this user';
          return res.status(404)
            .json({
              success: false,
              errors
            });
        }
        return res.status(200)
          .json({
            success: true,
            message: 'Profile retrieved successfully',
            profile
          });
      })
      .catch(err => {
        return res.status(404)
          .json({
            success: false,
            err
          });
      });
  } 

  // @route  GET api/profile/user/:user_id
  // @desc   Get current user's profile by user id
  // @access Public
  static getProfileById(req, res) {
    const errors = {};

    Profile.findOne({user: req.params.user_id})
      .populate('user', ['name', 'avatar'])
      .then(profile => {
        if(!profile) {
          errors.noprofile = 'There is no profile for this user';
          return res.status(404)
            .json({
              success: false,
              errors
            });
        }
        return res.status(200)
          .json({
            success: true,
            message: 'Profile retrieved successfully',
            profile
          });
      })
      .catch(err => {
        errors.noprofile = 'There is no profile for this user';
        return res.status(404)
          .json({
            success: false,
            errors 
          });
      });
  } 

  // @route  GET api/profile/all
  // @desc   Get all profiles
  // @access Public
  static getAllProfiles(req, res) {
    const errors = {};

    Profile.find()
      .populate('user', ['name', 'avatar'])
      .then(profiles => {
        if(!profiles) {
          errors.noprofile = 'There are no profiles';
          return res.status(404)
            .json({
              success: false,
              errors
            });
        }
        return res.status(200)
          .json({
            success: true,
            message: 'Profiles retrieved successfully',
            profiles
          });
      })
      .catch(err => {
        return res.status(404)
          .json({
            success: false,
            errors 
          });
      });
  }

  // @route  POST api/profile/experience
  // @desc   Add experience to profile
  // @access Private
  static addExperience(req, res) {
    const { errors, isValid } = validExperience(req.body);

    // Check validation
    if (!isValid) {
      // return any error with 400 status
      return res.status(400)
        .json({
          success: false,
          errors
        });
    }

    Profile.findOne({user: req.user.id})
      .then(profile => {
        const newExp = {
          title: req.body.title,
          company: req.body.company,
          location: req.body.location,
          from: req.body.from,
          to: req.body.to,
          current: req.body.current,
          description: req.body.description
        };

        // Add to Experience array
        profile.experience.unshift(newExp);
        profile.save()
          .then(profile => {
            return res.status(200)
              .json({
                success: true,
                message: 'Experience added successfully',
                profile
              });
          })
          .catch(err => {
            errors.notSaved = 'This experience was not saved';
            return res.status(400)
              .json({
                success: false,
                errors
              });
          });
      })
      .catch(err => {
        errors.noprofile = 'This profile does not exist';
        return res.status(404)
          .json({
            success: false,
            errors
          });
      });
  }

  // @route  POST api/profile/education
  // @desc   Add education to profile
  // @access Private
  static addEducation(req, res) {
    const { errors, isValid } = validEducation(req.body);

    // Check validation
    if (!isValid) {
      // return any error with 400 status
      return res.status(400)
        .json({
          success: false,
          errors
        });
    }

    Profile.findOne({user: req.user.id})
      .then(profile => {
        const newEdu = {
          school: req.body.school,
          degree: req.body.degree,
          fieldofstudy: req.body.fieldofstudy,
          from: req.body.from,
          to: req.body.to,
          current: req.body.current,
          description: req.body.description
        };

        // Add to Top of Education array
        profile.education.unshift(newEdu);
        profile.save()
          .then(profile => {
            return res.status(200)
              .json({
                success: true,
                message: 'Education added successfully',
                profile
              });
          })
          .catch(err => {
            errors.notSaved = 'This education was not saved';
            return res.status(400)
              .json({
                success: false,
                errors
              });
          });
      })
      .catch(err => {
        errors.noprofile = 'This profile does not exist';
        return res.status(404)
          .json({
            success: false,
            errors
          });
      });
  }

  // @route  DELETE api/profile/experience/:exp_id
  // @desc   Delete experience from profile
  // @access Private
  static deleteExperience(req, res) {
    const errors = {};

    Profile.findOne({user: req.user.id})
      .then(profile => {
        // Get remove index
        const removeIndex = profile.experience
          .map(item => item.id)
          .indexOf(req.params.exp_id);

        // Splice outtah array
        profile.experience.splice(removeIndex, 1);
        // Save profile
        profile.save()
          .then(profile => {
            return res.status(200)
              .json({
                success: true,
                message: 'Experience deleted successfully.',
                profile
              });
          })
          .catch(err => {
            errors.notDeleted = 'Experience could not be deleted.';
            return res.status(400)
              .json({
                success: false,
                errors
              });
          });
      })
      .catch(err => {
        errors.noprofile = 'This profile does not exist.';
        return res.status(404)
          .json({
            success: false,
            errors
          });
      });
  }

  // @route  DELETE api/profile/education/:edu_id
  // @desc   Delete education from profile
  // @access Private
  static deleteEducation(req, res) {
    const errors = {};

    Profile.findOne({user: req.user.id})
      .then(profile => {
        // Get remove index
        const removeIndex = profile.education
          .map(item => item.id)
          .indexOf(req.params.edu_id);

        // Splice outtah array
        profile.education.splice(removeIndex, 1);
        // Save profile
        profile.save()
          .then(profile => {
            return res.status(200)
              .json({
                success: true,
                message: 'Education deleted successfully.',
                profile
              });
          })
          .catch(err => {
            errors.notDeleted = 'Education could not be deleted.';
            return res.status(400)
              .json({
                success: false,
                errors
              });
          });
      })
      .catch(err => {
        errors.noprofile = 'This profile does not exist.';
        return res.status(404)
          .json({
            success: false,
            errors
          });
      });
  }

  // @route  DELETE api/profile
  // @desc   Delete user and profile
  // @access Private
  static deleteUser(req, res) {
    const errors = {};

    Profile.findOneAndRemove({user: req.user.id})
      .then(()=> {
        User.findOneAndRemove({_id: req.user.id})
          .then(() => {
            return res.status(200)
              .json({
                success: true,
                message: 'User and corresponding profile deleted successfully.'
              });
          })
          .catch(err => {
            errors.noprofile = 'This user does not exist.';
            return res.status(404)
              .json({
                success: false,
                errors
              });
          });
      })
      .catch(err => {
        errors.noprofile = 'This profile does not exist.';
        return res.status(404)
          .json({
            success: false,
            errors
          });
      });
  }
}


export default ProfileController;