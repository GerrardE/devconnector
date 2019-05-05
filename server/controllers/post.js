import User from '../models/User';
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

  // @route  POST api/post/create
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
}

export default PostController;