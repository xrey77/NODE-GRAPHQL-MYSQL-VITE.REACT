import { Resolver, Arg, Query, Mutation, ObjectType, Field, Int, UseMiddleware } from "type-graphql";
import { AppDataSource } from "../data-source.js";
import { GraphQLError } from "graphql"; 
import { User } from "../entity/User.js";
import { verify } from 'otplib';
import { AuthMiddleware } from "../middleware/auth.middleware.js";

@ObjectType()
class MFAResponse { 
    @Field(() => String, { nullable: true })
    message: string;

    @Field(() => String, { nullable: true })
    username: string;

    @Field(() => Int, { nullable: true })
    id?: number;
}

@Resolver()
export class VerifyMFA {
    @Mutation(() => MFAResponse)
    @UseMiddleware(AuthMiddleware)    
    async mfaVerification(
        @Arg("id", () => Int) id: number,
        @Arg("token", () => String) token: string,
        @Arg("otp", () => String) otp: string
    ): Promise<MFAResponse> {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOneBy({ id });

        if (!user) {
            throw new GraphQLError(`User with ID ${id} not found`);
        }
        console.log("OTP CODE : " + otp);
        console.log("SECRET : " + user.secret);
        
        const isValid = await verify({ 
            token: otp, 
            secret: user.secret! 
        });

        if (isValid.valid) {
            return {
                id: user.id, 
                username: user.username,
                message: 'OTP code has been verified successfully.'                
            };

        } else {

            throw new GraphQLError('Invalid OTP Code, please try again.');

        }
    }   
}
