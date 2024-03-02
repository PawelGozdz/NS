import { ApiProperty } from '@nestjs/swagger';

export class ValidationErrorDto {
  @ApiProperty({
    description: 'A list of validation errors',
    example: ['email must be an email'],
    nullable: false,
  })
  subErrors: string[];

  @ApiProperty({
    description: 'Input validation error',
    example: 'Bad Request Exception',
    nullable: false,
  })
  error: string;
}
