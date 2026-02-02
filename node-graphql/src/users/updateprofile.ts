import { Resolver, Arg, Query, Mutation, ObjectType, Field, Int, UseMiddleware} from "type-graphql";
import { AppDataSource } from "../data-source.js";
import { GraphQLError } from "graphql"; 
import { User } from "../entity/User.js";
import { AuthMiddleware } from "../middleware/auth.middleware.js";

@ObjectType()
class updateResponse {
    @Field(() => String, { nullable: true })
    message: string;

    @Field(() => Number, { nullable: true }) // Added this to match your frontend query
    id?: number;
}

@Resolver()
export class UpdateProfile {
    @Mutation(() => updateResponse)
    @UseMiddleware(AuthMiddleware)    
    async profileUpdate(
        @Arg("id", () => Int) id: number,
        @Arg("token", () => String) token: string,
        @Arg("firstname", () => String) firstname: string,
        @Arg("lastname", () => String) lastname: string,
        @Arg("mobile", () => String) mobile: string,
    ): Promise<updateResponse> {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOneBy({ id });

        if (!user) {
            throw new GraphQLError(`User with ID ${id} not found`);
        }

        await userRepository.update(id, { firstname: firstname, lastname: lastname, mobile: mobile });

        return {
            id, 
            message: 'You have updated your profile successfully.'
        };
    }   
}