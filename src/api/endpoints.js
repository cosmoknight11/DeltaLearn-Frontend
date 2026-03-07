import api from "./client";

export const auth = {
  requestOTP: (email) => api.post("/auth/request-otp/", { email }),
  verifyOTP: (email, code) => api.post("/auth/verify-otp/", { email, code }),
  refresh: (refreshToken) => api.post("/auth/refresh/", { refresh: refreshToken }),
  profile: () => api.get("/auth/profile/"),
  updateProfile: (data) => api.patch("/auth/profile/", data),
};

export const topics = {
  list: () => api.get("/topics/"),
};

export const subscriptions = {
  list: () => api.get("/subscriptions/"),
  create: (topicId) => api.post("/subscriptions/", { topic: topicId }),
  get: (id) => api.get(`/subscriptions/${id}/`),
  update: (id, data) => api.patch(`/subscriptions/${id}/`, data),
  remove: (id) => api.delete(`/subscriptions/${id}/`),
};

export const progress = {
  list: () => api.get("/progress/"),
};

export const history = {
  list: (page = 1) => api.get(`/history/?page=${page}`),
  detail: (id) => api.get(`/history/${id}/`),
};
