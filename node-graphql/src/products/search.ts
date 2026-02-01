import { Resolver, Query, Arg, ObjectType, Field, Int, Mutation } from "type-graphql";
import { AppDataSource } from "../data-source.js";
import { Product } from "../entity/Product.js";
import { Like } from 'typeorm';
import { GraphQLError } from "graphql";

export const getPaginatedSearchProducts = async (page: number, keyword: string = ''): Promise<{ data: Product[], count: number }> => {
    const productRepository = AppDataSource.getRepository(Product);

    const perPage = 5;
    const offset = Math.ceil((page - 1) * perPage);

    const [result, total] = await productRepository.findAndCount({        
    select: ['id','descriptions','qty','unit','sellprice','productpicture'],
    where: { descriptions: Like(`%${keyword}%`) },
    order: { id: "ASC" },
        take: perPage,
        skip: offset,
    });

    return {
        data: result,
        count: total
    };
};


@ObjectType()
class PaginatedSearchProducts {
  @Field(() => [Product])
  products: Product[];

  @Field(() => Int)
  totalrecords: number;

  @Field(() => Int)
  totpage: number;

  @Field(() => Int)
  page: number;

}

@Resolver()
export class SearchProducts {
  @Query(() => PaginatedSearchProducts)
  async findProductsByDescriptions(
    @Arg("page", () => Int) page: number,
    @Arg("key", () => String) key: string
  ): Promise<PaginatedSearchProducts> {
        try {
            const paginatedResult = await getPaginatedSearchProducts(page, key);
            if (paginatedResult.data.length > 0) {

                const totalpage = Math.ceil(paginatedResult.count / 5);
                return {
                    products: paginatedResult.data,
                    totalrecords: paginatedResult.count,
                    totpage: totalpage,
                    page: page
                };

            } else {
            throw new GraphQLError('Products not found.');
        
            }
        } catch (error: any) {
            throw new GraphQLError(error.message);
        }
  }
}