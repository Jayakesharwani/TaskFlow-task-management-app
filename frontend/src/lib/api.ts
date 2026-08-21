import axios from "axios";

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:3000",

  headers: {
    "Content-Type": "application/json",
  },
});

// =====================================================
// REQUEST INTERCEPTOR
// =====================================================

api.interceptors.request.use(
  (config) => {
    let token: string | null = null;

    if (typeof window !== "undefined") {
      token =
        window.localStorage.getItem(
          "token",
        );
    }

    console.log(
      "API REQUEST:",
      config.method?.toUpperCase(),
      config.url,
      "TOKEN:",
      !!token,
    );

    if (token) {
      config.headers =
        config.headers || {};

      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  },
);

// =====================================================
// RESPONSE INTERCEPTOR
// =====================================================

api.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {
    console.error(
      "API ERROR:",
      error.response?.status,
      error.response?.data,
    );

    if (
      error.response?.status === 401
    ) {
      console.warn(
        "Unauthorized request - token is missing or expired.",
      );
    }

    return Promise.reject(error);
  },
);

export default api;