import {
  IsArray,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class SendEmailDto {
  @IsString()
  @IsNotEmpty()
  template: string;

  @IsOptional()
  version?: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsArray()
  @IsNotEmpty()
  to: string[];

  @IsObject()
  @IsNotEmpty()
  variables: Record<string, any>;
}
