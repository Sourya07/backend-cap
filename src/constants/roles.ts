export const Roles = {
  Viewer: 'viewer',
  Analyst: 'analyst',
  Admin: 'admin',
} as const;

export type Role = (typeof Roles)[keyof typeof Roles];

export const roleHierarchy: Record<Role, number> = {
  [Roles.Viewer]: 1,
  [Roles.Analyst]: 2,
  [Roles.Admin]: 3,
};
