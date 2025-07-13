import { IsEmail, IsString, MinLength, MaxLength, IsOptional, IsDateString } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Введите корректный email адрес' })
  email: string;

  @IsString({ message: 'Пароль должен быть строкой' })
  @MinLength(6, { message: 'Пароль должен содержать минимум 6 символов' })
  @MaxLength(50, { message: 'Пароль не должен превышать 50 символов' })
  password: string;

  @IsString({ message: 'Имя пользователя должно быть строкой' })
  @MinLength(3, { message: 'Имя пользователя должно содержать минимум 3 символа' })
  @MaxLength(20, { message: 'Имя пользователя не должно превышать 20 символов' })
  username: string;

  @IsOptional()
  @IsString({ message: 'Имя должно быть строкой' })
  @MaxLength(50, { message: 'Имя не должно превышать 50 символов' })
  firstName?: string;

  @IsOptional()
  @IsString({ message: 'Фамилия должна быть строкой' })
  @MaxLength(50, { message: 'Фамилия не должна превышать 50 символов' })
  lastName?: string;

  @IsOptional()
  @IsString({ message: 'Страна должна быть строкой' })
  @MaxLength(100, { message: 'Название страны не должно превышать 100 символов' })
  country?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Дата рождения должна быть в корректном формате' })
  birthDate?: string;
}
