import express from 'express';
import profile from '../../controllers/profile';
import authenticate from '../../middlewares/passport';

const router = express.Router();

router.get('/test', profile.test);
router.get('/', authenticate, profile.getUser)
router.post('/', authenticate, profile.createUser)

export default router;