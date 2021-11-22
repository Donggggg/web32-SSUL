import { IsDate, IsNumber, IsString, IsEnum } from 'class-validator';
import { PostType } from '../models/Post';

export class PostDto {
  @IsNumber()
  id: number;
  @IsNumber()
  groupId: number;
  @IsNumber()
  userId: number;
  @IsString()
  title: string;
  @IsString()
  content: string;
  @IsDate()
  createdAt: Date | null;
  @IsEnum(PostType)
  type: PostType;
  @IsNumber()
  hit: number;
}
