import express from 'express';
import authenticate from '../../middlewares/passport';
import users from '../../controllers/users';

// Use the express router
const router = express.Router();

// Main routes
router.get('/test', users.test);
router.post('/register', users.register);
router.post('/login', users.login);
router.get('/current', authenticate, users.current);

export default router;