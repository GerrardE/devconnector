import express from 'express';
import users from '../../controllers/users';

const router = express.Router();

router.get('/test', users.test);
router.post('/register', users.register);
router.post('/login', users.login);

export default router;