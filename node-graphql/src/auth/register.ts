import { Resolver, Mutation, Arg, Query, ObjectType, Field } from "type-graphql";
import { AppDataSource } from "../data-source.js";
import { User } from "../entity/User.js";
import * as bcrypt from 'bcrypt';

@ObjectType()
class signupResponse {
    @Field(() => String, { nullable: true })
    message: string
}

@Resolver()
export class UserRegistration {


    @Mutation(() => signupResponse)
    async createUser(
        @Arg("firstname", () => String) firstname: string,
        @Arg("lastname", () => String) lastname: string,
        @Arg("email", () => String) email: string,
        @Arg("mobile", () => String) mobile: string,
        @Arg("username", () => String) username: string,
        @Arg("password", () => String) password: string,

    ): Promise<signupResponse> {
        const userRepository = AppDataSource.getRepository(User);
        
        const existingUserEmail = await userRepository.findOneBy({ email });
        if (existingUserEmail) {
            throw new Error('Email Address is already taken.');
        }

        const existingUsername = await userRepository.findOneBy({ username });
        if (existingUsername) {
            throw new Error('Username is already taken.');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = userRepository.create({
            firstname,
            lastname,
            email,
            mobile,
            username,
            password: hashedPassword,
        });

        await userRepository.save(newUser); 
        return { message: 'You have registered successfully, please login now.'}
    }
}