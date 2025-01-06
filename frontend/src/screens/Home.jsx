import React, { useState, useEffect } from "react";
import { useUser } from "../context/user.context";
import { Link, useNavigate } from "react-router-dom";
import axios from "../config/axios"; 

const Home = () => {
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState([]);

  // Handlers for modal
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Handle project creation
  const createProject = async (e) => {
    e.preventDefault();
    if (!projectName.trim()) {
      alert("Project name cannot be empty!");
      return;
    }

    try {
      const response = await axios.post("/projects/create", {
        name: projectName,
      });
      console.log("Project Created:", response.data);
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
    }

    closeModal();
    setProjectName("");
  };

  // Handle sign-out
  const signOut = () => {
    logout();
    localStorage.removeItem("token");
    navigate("/login");
  };

  //show all projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get("/projects/all");
        setProjects(response.data.projects);
        console.log("Projects:", response.data);
      } catch (error) {
        console.error("Error:", error.response?.data || error.message);
      }
    };

    fetchProjects();
  }, []);

  // Redirect if not logged in
  if (!user && !localStorage.getItem("token")) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-lg font-semibold mb-4">
          Please log in to access the dashboard.
        </p>
        <Link
          to="/login"
          className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-600 transition"
        >
          Login
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4">
      {/* Header Section */}
      <header className="w-full max-w-4xl flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome, {user?.name || "User"}!
        </h1>
        <button
          onClick={signOut}
          className="bg-red-500 text-white px-4 py-2 rounded-sm shadow hover:bg-red-600 transition"
        >
          Logout
        </button>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-4xl">
        <button
          onClick={openModal}
          className="bg-gray-800 text-white font-medium px-6 py-3 rounded-sm shadow-md transition-all transform hover:bg-gray-700 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          + Create New Project
        </button>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-full max-w-lg p-8 rounded-lg shadow-lg transform transition-transform scale-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Create a New Project
            </h2>
            <form onSubmit={createProject}>
              <label
                htmlFor="projectName"
                className="block text-sm font-medium text-gray-600 mb-2"
              >
                Project Name
              </label>
              <input
                type="text"
                id="projectName"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="border border-gray-300 rounded-lg w-full p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
                placeholder="Enter project name"
              />
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-600 transition"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 w-full max-w-4xl">
        {projects.length === 0 ? (
          <p>No projects found</p>
        ) : (
          projects.map((project) => (
            <div
              key={project._id} // Assuming each project has a unique "id"
              className="project-card bg-white p-4 mb-4 shadow-lg rounded-lg hover:bg-blue-100 cursor-pointer"
              onClick={() => {
                navigate(`/project`, {
                    state: { project }
                })
            }}
            >
              <h2 className="project-name text-xl font-semibold">
                {project.name}
              </h2> 
              <div className="project-collaborators">
                <p className="text-gray-500 mt-8 font-semibold">
                <i className="ri-user-line text-white bg-blue-500 p-2 rounded-full text-lg transform transition-all duration-200 group-hover:scale-110"></i>  Collaborators: {project.users?.length}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
