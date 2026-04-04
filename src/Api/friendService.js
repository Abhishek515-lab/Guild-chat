import api from "axios";

export const friendService = {
  // User search karna ID se
  searchUser: (userId) => api.get(`/users/search/${userId}`),

  // Friend Request bhejna
  sendRequest: (targetId) => api.post("/users/request/send", { targetId }),

  // Request accept karna
  acceptRequest: (targetId) => api.post("/users/request/accept", { targetId }),

  // User ko block karna
  blockUser: (targetId) => api.post("/users/block", { targetId }),
  
  // Unfriend karna
  unfriend: (targetId) => api.post("/users/unfriend", { targetId }),
};