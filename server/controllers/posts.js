class PostController {
  static test (req, res) {
      res.json({
        message: 'Success: Posts working'
    })
  }
}

export default PostController;