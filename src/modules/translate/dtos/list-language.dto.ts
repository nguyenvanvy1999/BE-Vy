import { ApiProperty } from '@nestjs/swagger';

export class ListLanguageResDTO {
  @ApiProperty({
    type: [String],
    description: 'List of language',
    nullable: false,
    required: true,
    example: ['en', 'vi'],
  })
  languages: string[];
}
