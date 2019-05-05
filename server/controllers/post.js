import Profile from '../models/Profile';
import Post from '../models/Post';
import validPost from '../middlewares/post';

class PostController {
  // @route  GET api/posts/test
  // @desc   Tests posts route
  // @access Public
  static test (req, res) {
      res.json({
        message: 'Success: Posts working'
    })
  }

  // @route  POST api/posts
  // @desc   Creates a post
  // @access Private
  static createPost (req, res) {
    const { errors, isValid } = validPost(req.body);

    // Check validation
    if(!isValid) {
      // If any errors, send 400 with errors object
      return res.status(400)
        .json({
          success: false,
          errors
        })
    }

    const newPost = new Post ({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    })

    newPost.save()
      .then(post => {
        return res.status(200)
          .json({
            success: true,
            message: 'Post created successfully.',
            post
          })
      })
  }

  // @route  GET api/posts
  // @desc   Gets all posts
  // @access Public
  static getPosts (req, res) {
    const errors = {};

    Post.find()
      .sort({ date: -1 })
        .then(posts => {
          return res.status(200)
            .json({
              success: true,
              message: 'Posts retrieved successfully.',
              posts
            })
        })
        .catch(err => {
          errors.nopost = 'No posts yet.'
          return res.status(404)
            .json({
              success: false,
              errors
            })
        })
  }

  // @route  GET api/posts/:id
  // @desc   Gets a post
  // @access Public
  static getPost (req, res) {
    const errors = {};

    Post.findById(req.params.id)
        .then(post => {
          return res.status(200)
            .json({
              success: true,
              message: 'Post retrieved successfully.',
              post
            })
        })
        .catch(err => {
          errors.nopost = 'No post found with that ID.'
          return res.status(404)
            .json({
              success: false,
              errors
            })
        })
  }

  // @route  DELETE api/posts/:id
  // @desc   Deletes a post
  // @access Private
  static deletePost (req, res) {
    const errors = {};

    Profile.findOne({user: req.user.id})
      .then(profile => {
        Post.findById(req.params.id)
          .then(post => {
            // Check for post owner
            if(post.user.toString() !== req.user.id) {
              errors.notauthorized = 'User not authorized.';
              return res.status(401)
                .json({
                  success: false,
                  errors
                })
            }

            // Delete the post
            post.remove()
              .then(() => {
                return res.status(200)
                  .json({
                    success: true,
                    message: 'Post deleted successfully'
                  })
              })
              .catch(err => {
                errors.notdeleted = 'Post could not be deleted. Try again.';
                return res.status(400)
                  .json({
                    success: false,
                    errors
                  })
              })
          })
          .catch(err => {
            errors.nopost = 'There is no post with this ID.';
              return res.status(404)
                .json({
                  success: false,
                  errors
                })
          })
      })
      .catch(err => {
        errors.noprofile = 'This profile does not exist.';
        return res.status(404)
          .json({
            success: false,
            errors
          })
      })
  }
}

export default PostController;