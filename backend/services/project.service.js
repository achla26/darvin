import Project from "../models/project.model.js";
import { ApiError } from "../utils/ApiError.js";

export const addProject = async (name, userId) => {
    try {
        if (!name?.trim()) {
            throw new ApiError(400, "Project name is required.");
        }
        if (!userId) {
            throw new ApiError(400, "User ID is required.");
        }

        // Create a new project
        const project = await Project.create({
            name,
            users: [userId], // Assuming `users` is an array in your schema
        });

        return project;
    } catch (error) {
        throw error; // Pass error to the calling function
    }
};
