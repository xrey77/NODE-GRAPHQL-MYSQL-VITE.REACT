import { Resolver, Query, Arg, ObjectType, Field, Int, Mutation } from "type-graphql";
import { AppDataSource } from "../data-source.js";
import { Product } from "../entity/Product.js";

export const getPaginatedListProducts = async (page: number): Promise<{ data: Product[], count: number }> => {

    const productRepository = AppDataSource.getRepository(Product);
    const perPage = 5;
    const offset = Math.ceil((page - 1) * perPage);

    const [result, total] = await productRepository.findAndCount({        
        select: ['id','category','descriptions','qty','unit','sellprice','productpicture'],
        order: { id: "ASC" },
        // relations: ["category"],
        take: perPage,
        skip: offset,
    });

    return {
        data: result,
        count: total
    };
};



@ObjectType()
class PaginatedProducts {
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
export class ListProducts {
  @Query(() => PaginatedProducts)
  async getAllproducts(
    @Arg("page", () => Int) page: number
  ): Promise<PaginatedProducts> {
    const paginatedResult = await getPaginatedListProducts(page);
    const totalpage = Math.ceil(paginatedResult.count / 5);
    return {
        products: paginatedResult.data,
        totalrecords: paginatedResult.count,
        totpage: totalpage,
        page: page
    };
  }
}