import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.29.63:5000",
  timeout: 10000,
});

export default api;