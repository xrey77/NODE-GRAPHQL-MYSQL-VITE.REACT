import { Resolver, Mutation, Arg, Query, ObjectType, Field } from "type-graphql";
import { AppDataSource } from "../data-source.js";
import { User } from "../entity/User.js";
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'; 
// import { generateToken } from "../utils/jwt.utils.js";

@ObjectType()
class LoginResponse {
    @Field(() => String, { nullable: true })
    token?: string;

    @Field(() => User, { nullable: true })
    user?: User;
}

interface JwtPayload {
    id : number,
    email: string,
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

        // const userInfo: JwtPayload = {
        //     id: user.id,
        //     email: user.email
        // };

        // const token = generateToken(userInfo);
        const token = jwt.sign(
            { userId: user.id }, 
            process.env.JWT_SECRET || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9", 
            { expiresIn: "1d" }
        );        

        return { token, user};
    }

}
