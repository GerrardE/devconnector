import express from 'express';
import posts from '../../controllers/posts'

const router = express.Router();

// @route  GET api/posts/test
// @desc   Tests posts route
// @access Public
router.get('/test', (req, res) => {
  res.json({
    message: 'Success: Posts working'
  })
})

router.post('/register', )
export default router;