import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(7)
  password: string;

  @IsString()
  @MinLength(7)
  passwordConfirm: string;
}
