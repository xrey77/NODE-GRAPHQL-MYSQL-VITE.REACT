import { Resolver, Query, Arg, ObjectType, Field, Int, Mutation } from "type-graphql";
import { AppDataSource } from "../data-source.js";
import { Product } from "../entity/Product.js";
// import { GraphQLError } from "graphql";
// import { getPaginatedListProducts } from '../middleware/paginate.products.js';

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

//   @Field(() => Boolean)
//   hasMore: boolean;
}

@Resolver()
export class ListProducts {
  @Mutation(() => PaginatedProducts) // Changed to @Query for better convention
  async getAllproducts(
    @Arg("page", () => Int) page: number
  ): Promise<PaginatedProducts> {
    const paginatedResult = await getPaginatedListProducts(page);
    const totalpage = Math.ceil(paginatedResult.count / 5);
    console.log(paginatedResult.data);
    return {
        products: paginatedResult.data,
        totalrecords: paginatedResult.count,
        totpage: totalpage,
        page: page
    };
  }
}

// @Resolver()
// export class ListProducts {
//   @Mutation(() => PaginatedProducts)
//   async getAllproducts(
//     @Arg("page", () => Int) page: number
//   ): Promise<PaginatedProducts> {

//         try {
//             const paginatedResult = await getPaginatedListProducts(page);
//             if (paginatedResult.data.length > 0) {

//                 const totalpage = Math.ceil(paginatedResult.count / 5);
//                 return {
//                     products: paginatedResult.data,
//                     totalrecords: paginatedResult.count,
//                     totpage: totalpage,
//                     page: page
//                 }
                
//             } else {
//                 throw new GraphQLError('Products not found.');
//             }
        
//         } catch (error: any) {
//                 throw new GraphQLError(error.message);
//         }

//   }
// }
