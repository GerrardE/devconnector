import express from 'express';
import post from '../../controllers/post';
import authenticate from '../../middlewares/passport';

const router = express.Router();

router.post('/', authenticate, post.createPost);
router.get('/', post.getPosts);
router.get('/:id', post.getPost);
router.delete('/:id', authenticate, post.deletePost);
router.post('/like/:id', authenticate, post.likePost);
router.post('/unlike/:id', authenticate, post.unlikePost);

export default router;