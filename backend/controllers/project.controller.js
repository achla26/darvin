import { validationResult } from "express-validator";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { addProject , getProjectsByUserId , updateProjectById , addNewUserToProject}  from "../services/project.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const createProject = asyncHandler(async (req, res, next) => {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Destructure request body
    const { name } = req.body;
    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(401, "Unauthorized: User ID not found.");
    }

    // Create the project using the service
    const project = await addProject(name, userId);

    // Send response
    return res.status(201).json(
        new ApiResponse(201, { project }, "Project created successfully.")
    );
});

export const getProjects = asyncHandler(async (req, res, next) => {
    const user_id = req.user?._id;

    if(!user_id){
        throw new ApiError(401, "Unauthorized: User ID not found.");
    }

    const projects = await getProjectsByUserId(user_id);

    return res.status(200).json(
        new ApiResponse(200, { projects }, "Projects retrieved successfully.")
    );

});

export const updateProject = asyncHandler(async (req, res, next) => {   
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name } = req.body;
    const { id } = req.params;
    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(401, "Unauthorized: User ID not found.");
    }

    // Update the project using the service
    const project = await updateProjectById(id, name, userId);

    // Send response

    return res.status(200).json(
        new ApiResponse(200, { project }, "Project updated successfully.")
    );
    
});

export const addUserToProject = asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { projectId, users } = req.body;
    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(401, "Unauthorized: User ID not found.");
    }

    // Add the user to the project using the service
    const project = await addNewUserToProject(projectId, users, userId);

    // Send response
    return res.status(200).json(
        new ApiResponse(200, { project }, "User added to project successfully.")
    );
});