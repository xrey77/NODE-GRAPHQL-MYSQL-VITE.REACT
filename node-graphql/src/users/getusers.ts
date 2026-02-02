import { Resolver, Query, UseMiddleware, Arg} from "type-graphql";
import { AppDataSource } from "../data-source.js";
import { User } from "../entity/User.js";
import { AuthMiddleware } from "../middleware/auth.middleware.js"; 

@Resolver()
export class GetUsers {
    @Query(() => [User])
    @UseMiddleware(AuthMiddleware)    
    async getAllUsers(
        @Arg("token", () => String) token: string,
    ): Promise<User[]> {
        return await AppDataSource.getRepository(User).find();        
    }
}
