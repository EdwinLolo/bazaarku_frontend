import { apiCall } from "./utils";

export const getUserData = async () => {
  return apiCall("/admin/users", {
    method: "GET",
  });
};

export const updateUser = async (userId, userData) => {
  return apiCall(`/admin/users/${userId}`, {
    method: "PUT",
    body: JSON.stringify(userData),
  });
};

export const deleteUser = async (userId) => {
  return apiCall(`/admin/users/${userId}`, {
    method: "DELETE",
  });
};

export const getEventData = async () => {
  return apiCall("/event-categories/with-count", {
    method: "GET",
  });
};
