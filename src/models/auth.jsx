import { apiCall } from "./utils";

export const login = async (email, password) => {
  return apiCall("/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
};

export const signup = async (
  email,
  password,
  first_name, // Send separately
  last_name, // Send separately
  role
) => {
  return apiCall("/signup", {
    method: "POST",
    body: JSON.stringify({ email, password, role, first_name, last_name }),
  });
};
