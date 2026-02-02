import { Resolver, Query} from "type-graphql";
import { AppDataSource } from "../data-source.js";
import { Sales } from "../entity/Sales.js";

@Resolver()
export class SalesChart {
    @Query(() => [Sales])
    async showChart(
    ): Promise<Sales[]> {
        return await AppDataSource.getRepository(Sales).find();
    }
}
