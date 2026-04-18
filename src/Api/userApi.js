import api from "./axios";

// get current user
export const getCurrentUser = () => {
  return api.get("/users/profile");
};

// update avatar
export const updateAvatarApi = (avatar) => {
  return api.patch("/users/avatar", { avatar });
};
