export const isCustomRole = (role: string): boolean => {
  return role.includes("custom_");
};

export const isSystemRole = (role: string): boolean => {
  return role === "system";
};
  