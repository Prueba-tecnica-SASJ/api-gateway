import {
  IsString,
  IsEmail,
  IsStrongPassword,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { Roles } from '../enums/roles.enum';

export class RegisterUserDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsStrongPassword()
  password: string;

  @IsEnum(Roles)
  @IsOptional()
  role?: Roles;
}
