import { Resolver, Mutation, Arg, Query, ObjectType, Field } from "type-graphql";
import { AppDataSource } from "../data-source.js";
import { User } from "../entity/User.js";
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'; 

@ObjectType()
class LoginResponse {
    @Field(() => String, { nullable: true })
    token?: string;

    @Field(() => User, { nullable: true })
    user?: User;
}


@Resolver()
export class UserLogin {

    @Mutation(() => LoginResponse)
    async signinUser(
        @Arg("username", () => String) username: string,        
        @Arg("password", () => String) password: string,
    ): Promise<LoginResponse> {
        const userRepository = AppDataSource.getRepository(User);
        
        const user = await userRepository.findOneBy({ username });
        
        if (!user) {
            throw new Error('Invalid username, please register.');
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        
        if (!isPasswordMatch) {
            throw new Error('Invalid password, please try again.');
        }

        const token = jwt.sign(
            { userId: user.id }, 
            process.env.JWT_SECRET || "your_temporary_secret", 
            { expiresIn: "1d" }
        );        

        return { token, user};
    }

}
