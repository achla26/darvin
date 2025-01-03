import { Router } from "express";
import { body } from "express-validator";
import { createProject , getProjects , updateProject , addUserToProject} from "../controllers/project.controller.js"; 
import { authUser } from "../middlewares/auth.middleware.js";


const router = Router();

router.post('/create', [
        body("name") 
        .isString().withMessage("Name must be a string") 
    ],
    authUser,createProject
);

router.get('/all', authUser,getProjects);

router.put('/update/:id', 
    [   
        body("name") 
        .isString().withMessage("Name must be a string")
    ],
    authUser,updateProject
);


router.put('/add-user',
    authUser,
    [
        body('projectId').isString().withMessage('Project ID is required'),
        body('users').isArray({ min: 1 }).withMessage('Users must be an array of strings').bail()
        .custom((users) => users.every(user => typeof user === 'string')).withMessage('Each user must be a string')
    ],
    addUserToProject
)

export default router;