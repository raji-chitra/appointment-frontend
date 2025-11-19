import axios from 'axios';
import { toast } from 'react-toastify';



const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

console.log("🔗 API Base URL =", API_BASE_URL);

const API = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

/* -------------------------------------------
    REQUEST INTERCEPTOR 
-------------------------------------------- */
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    const adminToken = localStorage.getItem("adminToken");

    if (token && token !== "false") {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (adminToken && adminToken !== "false") {
      config.headers.Authorization = `Bearer ${adminToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* -------------------------------------------
    RESPONSE INTERCEPTOR 
-------------------------------------------- */
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("adminToken");
      localStorage.removeItem("userData");
      window.location.href = "/login";
      return;
    }

    const message =
      error.response?.data?.message ||
      "Something went wrong. Try again later.";

    try {
      toast.error(message);
    } catch {
      toast.error(String(message));
    }

    return Promise.reject(error);
  }
);

/* -------------------------------------------
    AUTH APIs
-------------------------------------------- */
export const authAPI = {
  signup: async (data) => {
    try {
      const res = await API.post("/auth/signup", data);
      return res.data;
    } catch (error) {
      return error.response?.data || { success: false, message: "Signup failed" };
    }
  },

  login: async (data) => {
    try {
      const res = await API.post("/auth/login", data);
      return res.data;
    } catch (error) {
      return error.response?.data || { success: false, message: "Login failed" };
    }
  },

  getMe: async () => {
    const res = await API.get("/auth/me");
    return res.data;
  },
};

/* -------------------------------------------
    PUBLIC API
-------------------------------------------- */
export const publicAPI = {
  getDoctors: async () => {
    try {
      const res = await API.get("/doctors");
      return res.data;
    } catch (error) {
      return error.response?.data || { success: false, message: "Failed to load doctors" };
    }
  },
};

/* -------------------------------------------
    APPOINTMENTS API
-------------------------------------------- */
export const appointmentsAPI = {
  bookAppointment: async (data) => {
    try {
      const res = await API.post("/appointments/book", data);
      return res.data;
    } catch (error) {
      return error.response?.data || { success: false, message: "Failed to book" };
    }
  },

  getMyAppointments: async () => {
    const res = await API.get("/appointments/my-appointments");
    return res.data;
  },

  cancelAppointment: async (id) => {
    try {
      const res = await API.put(`/appointments/${id}/cancel`);
      return res.data;
    } catch (error) {
      return error.response?.data || { success: false, message: "Cancel failed" };
    }
  },
};

/* -------------------------------------------
    ADMIN API 
-------------------------------------------- */
export const adminAPI = {
  login: async (creds) => {
    try {
      const res = await API.post("/admin/login", creds);
      return res.data;
    } catch (error) {
      return error.response?.data || { success: false, message: "Admin login failed" };
    }
  },

  getDoctors: async () => {
    const res = await API.get("/admin/doctors");
    return res.data;
  },

  addDoctor: async (data) => {
    const res = await API.post("/admin/doctors", data);
    return res.data;
  },

  updateDoctor: async (id, data) => {
    const res = await API.put(`/admin/doctors/${id}`, data);
    return res.data;
  },

  removeDoctor: async (id) => {
    const res = await API.delete(`/admin/doctors/${id}`);
    return res.data;
  },

  getDashboardStats: async () => {
    const res = await API.get("/admin/dashboard/stats");
    return res.data;
  },
};

/* -------------------------------------------
    HEALTH CHECK
-------------------------------------------- */
export const healthCheck = async () => {
  const res = await API.get("/health");
  return res.data;
};

export default API;
