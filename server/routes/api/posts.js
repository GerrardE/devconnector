import express from 'express';
import post from '../../controllers/post';
import authenticate from '../../middlewares/passport';

const router = express.Router();

router.post('/', authenticate, post.createPost);

export default router;