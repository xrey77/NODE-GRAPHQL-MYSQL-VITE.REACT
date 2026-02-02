import { Resolver, Arg, Query, UseMiddleware} from "type-graphql";
import { AppDataSource } from "../data-source.js";
import { GraphQLError } from "graphql"; 
import { User } from "../entity/User.js";
import { AuthMiddleware } from "../middleware/auth.middleware.js";

@Resolver()
export class GetUserId {

    @Query(() => User)
    @UseMiddleware(AuthMiddleware)    
    async getUserById(
        @Arg("id", () => Number) id: number,
        @Arg("token", () => String) token: string,
    ): Promise<User | null> {
        console.log("TOKEN............." + token);
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