import { IsString } from "class-validator";

export class UpdateUserDto {
  @IsString()
  role: string;
  @IsString()
  name: string;
  @IsString()
  userId: string;
}
