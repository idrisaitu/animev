import { IsEmail, IsString, MinLength, MaxLength, IsOptional, IsDateString, IsUrl } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsEmail({}, { message: 'Введите корректный email адрес' })
  email?: string;

  @IsOptional()
  @IsString({ message: 'Имя пользователя должно быть строкой' })
  @MinLength(3, { message: 'Имя пользователя должно содержать минимум 3 символа' })
  @MaxLength(20, { message: 'Имя пользователя не должно превышать 20 символов' })
  username?: string;

  @IsOptional()
  @IsString({ message: 'Имя должно быть строкой' })
  @MaxLength(50, { message: 'Имя не должно превышать 50 символов' })
  firstName?: string;

  @IsOptional()
  @IsString({ message: 'Фамилия должна быть строкой' })
  @MaxLength(50, { message: 'Фамилия не должна превышать 50 символов' })
  lastName?: string;

  @IsOptional()
  @IsString({ message: 'Биография должна быть строкой' })
  @MaxLength(500, { message: 'Биография не должна превышать 500 символов' })
  bio?: string;

  @IsOptional()
  @IsString({ message: 'Страна должна быть строкой' })
  @MaxLength(100, { message: 'Название страны не должно превышать 100 символов' })
  country?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Дата рождения должна быть в корректном формате' })
  birthDate?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Аватар должен быть корректной ссылкой' })
  avatar?: string;

  @IsOptional()
  @IsString({ message: 'Язык должен быть строкой' })
  language?: string;

  @IsOptional()
  @IsString({ message: 'Тема должна быть строкой' })
  theme?: string;
}
