import { apiCall } from "./utils";

export const login = async (email, password) => {
  return apiCall("/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
};
