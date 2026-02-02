import { Resolver, Arg, Query, Mutation, ObjectType, Field, Int, UseMiddleware} from "type-graphql";
import { AppDataSource } from "../data-source.js";
import { GraphQLError } from "graphql"; 
import { User } from "../entity/User.js";
import * as bcrypt from 'bcrypt';
import { AuthMiddleware } from "../middleware/auth.middleware.js";

@ObjectType()
class changeResponse {
    @Field(() => String, { nullable: true })
    message: string;

    @Field(() => Number, { nullable: true }) 
    id?: number;
}

@Resolver()
export class ChangePassword {
    @Mutation(() => changeResponse)
    @UseMiddleware(AuthMiddleware)    
    async updateUserPassword(
        @Arg("id", () => Int) id: number,
        @Arg("token", () => String) token: string,
        @Arg("password", () => String) password: string 
    ): Promise<changeResponse> {
        console.log("TOKEN............." + token);
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOneBy({ id });

        if (!user) {
            throw new GraphQLError(`User with ID ${id} not found`);
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await userRepository.update(id, { password: hashedPassword });

        return {
            id, // Return the ID so the frontend query doesn't fail
            message: 'You have changed your password successfully.'
        };
    }   
}