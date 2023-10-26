import {IsString, IsNumber} from 'class-validator'

export class CreateArticleDto {
    @IsString()
    title: string;

    @IsString()
    body: string;
}