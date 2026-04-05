import axios from "axios";

const api = axios.create({
  baseURL: "https://finance-tracker-production-860d.up.railway.app",
  withCredentials: true,
});

export default api;
