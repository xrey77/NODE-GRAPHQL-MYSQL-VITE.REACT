import { Resolver, Arg, Query, Mutation, ObjectType, Field, Int} from "type-graphql";
import { AppDataSource } from "../data-source.js";
import { GraphQLError } from "graphql"; 
import { User } from "../entity/User.js";
import * as bcrypt from 'bcrypt';

@ObjectType()
class changeResponse {
    @Field(() => String, { nullable: true })
    message: string;

    @Field(() => Number, { nullable: true }) // Added this to match your frontend query
    id?: number;
}

@Resolver()
export class ChangePassword {
    @Mutation(() => changeResponse)
    async updateUserPassword(
        @Arg("id", () => Int) id: number, // Use Int for database IDs
        @Arg("password", () => String) password: string 
    ): Promise<changeResponse> {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOneBy({ id });

        if (!user) {
            // Throwing errors in TypeGraphQL: https://typegraphql.com
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