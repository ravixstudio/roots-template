export const endpoints = {
  auth: {
    google: {
      query: "googleOauth",
      endpoint: "/v1/oauth/google",
    },
    apple: {
      query: "appleOauth",
      endpoint: "/v1/oauth/apple",
    },
    me: {
      query: "me",
      endpoint: "/v1/auth/me",
    },
    logout: {
      query: "logout",
      endpoint: "/v1/auth/logout",
    },
  },
  users: {
    getAll: {
      query: "getAllUsers",
      endpoint: "/v1/users",
    },
  },
};
