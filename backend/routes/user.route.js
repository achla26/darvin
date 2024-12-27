import { Router } from "express";
import { body } from "express-validator";
import { registerUser , loginUser , getUserProfile , logoutUser} from "../controllers/user.controller.js";
import { authUser } from "../middlewares/auth.middleware.js";


const router = Router();

router.post('/register', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('fullname.firstname').isLength({ min: 3 }).withMessage('First name must be at least 3 characters long'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
],
    registerUser
)
router.post('/login', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
],
    loginUser
)

router.get('/profile', authUser, getUserProfile)
router.get('/logout', authUser,logoutUser)


export default router