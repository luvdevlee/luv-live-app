import { UserRole } from '@src/user/schemas/user.schema';

export type AuthUser = {
  sub: string;
  email: string;
  role: UserRole;
};
