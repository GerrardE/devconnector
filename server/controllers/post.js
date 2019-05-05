import Profile from '../models/Profile';
import Post from '../models/Post';
import validPost from '../middlewares/post';
import validComment from '../middlewares/comment';

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

  // @route  POST api/posts/like/:id
  // @desc   Likes a post
  // @access Private
  static likePost (req, res) {
    const errors = {};

    Profile.findOne({user: req.user.id})
      .then(profile => {
        Post.findById(req.params.id)
          .then(post => {
            if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
              errors.alreadyliked = 'User already liked this post';
              return res.status(400)
                .json({
                  success: false,
                  errors
                })
            }

            // Add use id to likes array
            post.likes.unshift({user: req.user.id});
            post.save().then(post => {
              return res.status(200)
                .json({
                  success: true,
                  message: 'Post liked',
                  post
                })
            })
            .catch(err => {
              errors.notliked = 'Post not liked'
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

  // @route  POST api/posts/unlike/:id
  // @desc   Unlikes a post-like
  // @access Private
  static unlikePost (req, res) {
    const errors = {};

    Profile.findOne({user: req.user.id})
      .then(profile => {
        Post.findById(req.params.id)
          .then(post => {
            if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
              errors.notliked = 'You have not yet liked this post';
              return res.status(400)
                .json({
                  success: false,
                  errors
                })
            }

            // Get the removeIndex
            const removeIndex = post.likes
              .map(item => item.user.toString())
                .indexOf(req.user.id);

            // splice outtah the array
            post.likes.splice(removeIndex, 1);

            // Save
            post.save()
              .then(post => {
                return res.status(200)
                .json({
                  success: true,
                  message: 'Post unliked',
                  post
                })
              })
            .catch(err => {
              errors.notliked = 'Post not unliked'
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

  // @route  POST api/posts/comment/:id
  // @desc   Comments on a post
  // @access Private
  static comment (req, res) {
    const { errors, isValid } = validComment(req.body);

    // Check validation
    if(!isValid) {
      // If any errors, send 400 with errors object
      return res.status(400)
        .json({
          success: false,
          errors
        })
    }

    Post.findById(req.params.id)
      .then(post => {
        const newComment = {
          text: req.body.text,
          name: req.body.name,
          avatar: req.body.avatar,
          user: req.user.id
        }

        // Add to comments array
        post.comments.unshift(newComment);
        // Save
        post.save()
          .then(post => {
            return res.status(200)
              .json({
                success: true,
                message: 'Comment added successfully.',
                post
              })
          })
          .catch(err => {
            errors.nocomment = 'Comment not added.';
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
  }

  // @route  DELETE api/posts/comment/:id/:comment_id
  // @desc   Deletes a comment from a post
  // @access Private
  static uncomment (req, res) {
    const errors = {};

    Post.findById(req.params.id)
      .then(post => {
        // Check if comment exists
        if(post.comments.filter(comment => comment._id.toString() === req.params.comment_id).length === 0) {
          errors.nocomment = 'There is no comment with this ID.';
        return res.status(404)
          .json({
            success: false,
            errors
          })   
        }
        // Get the removeIndex
        const removeIndex = post.comments
        .map(item => item._id.toString())
          .indexOf(req.params.comment_id);

        // splice outtah the array
        post.comments.splice(removeIndex, 1);

        // Save
        post.save()
          .then(post => {
            return res.status(200)
              .json({
                success: true,
                message: 'Comment removed successfully.',
                post
              })
          })
          .catch(err => {
            errors.nocomment = 'Comment not removed.';
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
  }
}

export default PostController;