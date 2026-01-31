import { Resolver, Arg, Query, Mutation} from "type-graphql";
import { AppDataSource } from "../data-source.js";
import { GraphQLError } from "graphql"; 
import { User } from "../entity/User.js";

@Resolver()
export class GetUserId {

    @Mutation(() => User)
    async getUserById(
        @Arg("id", () => Number) id: number
    ): Promise<User | null> {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOneBy({ id });

        if (!user) {
            throw new GraphQLError(`User with ID ${id} not found`, {
            extensions: { code: 'NOT_FOUND', http: { status: 404 } },
            });
        }

        return user;
    }   
}