import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginAuthRequestDto {
  @ApiProperty({ description: 'The phone number of user', example: '0905123632' })
  @IsNotEmpty({ message: 'Phone number is required' })
  phonenumber: string;

  @ApiProperty({ description: 'The password of user', example: '123' })
  @IsNotEmpty({
    message: 'Password is required',
  })
  password: string;
}

export class LoginAuthResponseDto {
  accessToken: string;
}
