import express from 'express';
import users from '../../controllers/users';

const router = express.Router();

// @route  GET api/users/test
// @desc   Tests users route
// @access Public
router.get('/test', users.test);
router.post('/register', users.register);

export default router;