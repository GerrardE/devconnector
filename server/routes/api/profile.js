import express from 'express';
import profile from '../../controllers/profile';
import authenticate from '../../middlewares/passport';

const router = express.Router();

router.get('/test', profile.test);
router.get('/', authenticate, profile.getUser);
router.post('/', authenticate, profile.createUser);
router.delete('/', authenticate, profile.deleteUser);
router.get('/handle/:handle', profile.getProfileByHandle);
router.get('/user/:user_id', profile.getProfileById);
router.get('/all', profile.getAllProfiles);
router.post('/experience', authenticate, profile.addExperience);
router.delete('/experience/:exp_id', authenticate, profile.deleteExperience);
router.post('/education', authenticate, profile.addEducation);
router.delete('/education/:edu_id', authenticate, profile.deleteEducation);

export default router;
