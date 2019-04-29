import express from 'express';

const router = express.Router();

// @route  GET api/profile/test
// @desc   Tests profile route
// @access Public
router.get('/test', (req, res) => {
  res.json({
    message: 'Success: Profile working'
  })
})

export default router;