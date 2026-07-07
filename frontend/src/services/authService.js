import api from "./api";

// Register User
const register = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

// Login User
const login = async (userData) => {
  const response = await api.post("/auth/login", userData);
  return response.data;
};

// Get Logged-in User Profile
const getProfile = async () => {
  const response = await api.get("/auth/profile");
  return response.data;
};

// Logout User
const logout = () => {
  localStorage.removeItem("token");
};

const authService = {
  register,
  login,
  getProfile,
  logout,
};

export default authService;
