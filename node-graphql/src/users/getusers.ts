import { Resolver, Mutation, Arg, Query, ObjectType, Field } from "type-graphql";
import { AppDataSource } from "../data-source.js";
import { User } from "../entity/User.js";

@Resolver()
export class GetUsers {

    @Query(() => [User])
    async getAllUsers(): Promise<User[]> {
        return await AppDataSource.getRepository(User).find();        
    }

}