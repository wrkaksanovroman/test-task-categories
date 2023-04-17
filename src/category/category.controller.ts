import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { GetCategoriesQueryParams } from './dto/get-categories-query-params';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Category } from './entities/category.entity';

@ApiTags('Categories')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({ summary: 'Get categories by filter' })
  @Get()
  findByFilter(@Query() query: GetCategoriesQueryParams) {
    return this.categoryService.findByFilter(query);
  }

  @ApiOperation({ summary: 'Get category by id or slug' })
  @Get('/:id_or_slug')
  getCategoryByIdOrSlug(@Param('id_or_slug') idOrSlug: string) {
    return this.categoryService.getCategoryByIdOrSlug(idOrSlug);
  }

  @ApiResponse({ type: Category })
  @ApiOperation({ summary: 'Create new category' })
  @Post()
  createCategory(@Body() createCategoryDto: Category) {
    return this.categoryService.create(createCategoryDto);
  }

  @ApiOperation({ summary: 'Update category by id' })
  @Patch('/:id')
  updateCategoryById(
    @Param('id') id: string,
    @Body() updateCategoryDto: Category,
  ) {
    return this.categoryService.updateCategoryById(id, updateCategoryDto);
  }

  @ApiOperation({ summary: 'Delete category by id' })
  @Delete('/:id')
  deleteCategoryById(@Param('id') id: string) {
    return this.categoryService.deleteCategoryById(id);
  }
}
