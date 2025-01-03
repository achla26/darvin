import { validationResult } from "express-validator";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { addProject } from "../services/project.service.js";
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
