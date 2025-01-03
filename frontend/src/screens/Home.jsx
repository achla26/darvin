import React , {useState } from "react";
import { useUser } from "../context/user.context";
import { Link  , useNavigate} from 'react-router-dom';
import axios from "../config/axios";

const Home = () => {
  const navigate = useNavigate();
  
  const { user, logout } = useUser();
  if (!user) {
    return <div>Please log in to access the dashboard.<Link to='/login'>Login</Link></div>;
  }
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState("");

  const openModal = () => setIsModalOpen(true);
  
  const closeModal = () => setIsModalOpen(false); 
  
  const createProject = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/projects/create', { name: projectName });
      console.log(response.data);
       
    } catch (error) {
      console.error(error.response.data);
    } 
    closeModal();
  };

  return (
    <>
      <button onClick={openModal} className="bg-blue-500 text-white px-4 py-2 rounded">
        Create New Project
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl mb-4">Enter Project Name</h2>
            <form onSubmit={createProject}>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="border p-2 mb-4 w-full"
              />
              <div className="flex justify-end">
                <button onClick={closeModal} className="bg-gray-500 text-white px-4 py-2 rounded mr-2">
                  Cancel
                </button>
                <button onClick={createProject} className="bg-blue-500 text-white px-4 py-2 rounded">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );

  const signOut = () => {
    logout();
    localStorage.removeItem('token');
    navigate('/login');
  }

  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <button onClick={signOut}>Logout</button>
    </div>
  );
};

export default Home;
