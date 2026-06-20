import axios from "axios";

const api = axios.create({
  baseURL: "https://penguin-ai-1t7q.onrender.com",
  timeout: 10000,
});

export default api;