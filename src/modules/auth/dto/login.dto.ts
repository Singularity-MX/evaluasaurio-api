// login.dto.ts

import { IsEmail, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
  @ApiProperty({
    example: "admin@evaluasaurio.com",
    description: "Correo del usuario",
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: "Password123",
    description: "Contraseña",
  })
  @IsString()
  password!: string;
}
