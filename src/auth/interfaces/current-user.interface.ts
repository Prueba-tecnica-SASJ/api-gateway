import { Roles } from '../enums/roles.enum';

export interface CurrentUser {
  id: string;
  role: Roles;
}
