import { Category } from './entities/category.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { GetCategoriesQueryParams } from './dto/get-categories-query-params';

export interface GetOutputParams {
  pageNumber: number;
  allPages: number;
  result: Category[];
}
@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}
  create(createCategoryDto: Category): Promise<Category> {
    try {
      return this.categoryRepository.save(createCategoryDto);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  getCategoryByIdOrSlug(idOrSlug: string): Promise<Category> {
    return this.categoryRepository.findOne({
      where: [{ slug: idOrSlug }, { id: idOrSlug }],
    });
  }

  async findByFilter(searchParams: GetCategoriesQueryParams): Promise<GetOutputParams> {
    const searchParamsTrimed: GetCategoriesQueryParams = {}

    for(const key in searchParams) {
      searchParamsTrimed[key] = searchParams[key].trim()
    }

    const { name, description, active, search, page, pageSize, sort } = searchParamsTrimed;

    const numberOfOrders = +pageSize ? pageSize : 2;
    const pageNumber = +page ? page : 1;
    const startOfView = pageNumber * numberOfOrders - (numberOfOrders - 1) - 1;
    const allSortCategories = ['name', 'slug', 'description', 'active', 'createdDate'];

    const sortField = sort && allSortCategories.includes(sort) 
      ? `category.${sort}`.replace('-', '') 
      : 'category.createdDate';

    const sortDirection = sort && !sort.includes('-') && allSortCategories.includes(sort) ? 'ASC' : 'DESC';
    
    const query = this.categoryRepository.createQueryBuilder('category');

    if (search) {
      const modifiedSearch = search.replace('е', '[е|ё]');
      query
        .where('lower (category.name) similar to lower (:name)', {
          name: `%${modifiedSearch}%`,
        })
        .orWhere(
          'lower (category.description) similar to lower (:description)',
          {
            description: `%${modifiedSearch}%`,
          },
        );
    }

    if (!search && name) {
      const modifiedName = name.replace('е', '[е|ё]');
      query.where('lower (category.name) similar to lower (:name)', {
        name: `%${modifiedName}%`,
      });
    }

    if (!search && description) {
      const modifiedDescription = description.replace('е', '[е|ё]');
      query.andWhere(
        'lower (category.description) similar to lower (:description)',
        {
          description: `%${modifiedDescription}%`,
        },
      );
    }

    if (active) {
      query.andWhere('category.active = :active', { active });
    }

    query
      .orderBy(sortField, sortDirection)
      .limit(numberOfOrders)
      .offset(startOfView)

    const result = await query.getMany();
    const allPages = Math.ceil((await query.getCount()) / numberOfOrders);

    return {
      pageNumber,
      allPages,
      result,
    }
  }

  async updateCategoryById(
    id: string,
    updateCategoryDto: Category,
  ): Promise<number> {
    try {
      return (await this.categoryRepository.update(id, updateCategoryDto)).affected;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async deleteCategoryById(id: string) {
    try {
      return (await this.categoryRepository.delete(id)).affected;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}
