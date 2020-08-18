import {
    IPaginationLinks,
    IPaginationMeta,
    IPaginationOptions,
    Pagination,
} from "nestjs-typeorm-paginate/index";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional } from "class-validator";

export class PaginationLinks implements IPaginationLinks {
    @ApiProperty()
    first: string;
    @ApiProperty()
    last: string;
    @ApiProperty()
    next: string;
    @ApiProperty()
    previous: string;
}

export class PaginationMeta implements IPaginationMeta {
    @ApiProperty()
    currentPage: number;
    @ApiProperty()
    itemCount: number;
    @ApiProperty()
    itemsPerPage: number;
    @ApiProperty()
    totalItems: number;
    @ApiProperty()
    totalPages: number;
}

export class PaginationDto implements Pagination<any> {
    @ApiProperty({ type: "object", isArray: true })
    items: any[];

    @ApiProperty()
    links: PaginationLinks;

    @ApiProperty()
    meta: PaginationMeta;
}

export class PaginateQueryDto implements IPaginationOptions {
    @ApiProperty({ type: Number, required: false })
    @IsOptional()
    @Type(() => Number)
    limit = 20;

    @ApiProperty({ type: Number, required: false })
    @IsOptional()
    @Type(() => Number)
    page = 1;

    [key: string]: any;
}
