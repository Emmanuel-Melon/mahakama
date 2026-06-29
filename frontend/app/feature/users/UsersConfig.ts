export const USERS_ROUTES = {
  PROFILE: {
    URL_SEGMENT: ":profile",
    PATH: "routes/users/$profile.tsx",
    NAME: "userProfile",
    LABEL: "Profile",
  },
  SETTINGS: {
    URL_SEGMENT: "settings",
    PATH: "routes/users/settings.tsx",
    NAME: "userSettings",
    LABEL: "Settings",
  },
} as const;
