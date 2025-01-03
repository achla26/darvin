import { Router } from "express";
import { body } from "express-validator";
import { createProject } from "../controllers/project.controller.js"; 
import { authUser } from "../middlewares/auth.middleware.js";


const router = Router();


router.post('/create', [
    body("name") 
    .isString().withMessage("Name must be a string") 
],authUser,createProject
) 


export default router