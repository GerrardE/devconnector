import express from 'express';
import profile from '../../controllers/profile';

const router = express.Router();

// @route  GET api/profile/test
// @desc   Tests profile route
// @access Public
router.get('/test', profile.test);

export default router;