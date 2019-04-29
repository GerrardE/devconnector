import express from 'express';

const router = express.Router();

// @route  GET api/posts/test
// @desc   Tests posts route
// @access Public
router.get('/test', (req, res) => {
  res.json
  .send({
    message: 'Success: Posts working'
  })
})

export default router;