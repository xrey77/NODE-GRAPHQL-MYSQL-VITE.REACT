import { Resolver, Arg, Query, Mutation, ObjectType, Field, Int} from "type-graphql";
import { AppDataSource } from "../data-source.js";
import { User } from "../entity/User.js";
import { GraphQLUpload, FileUpload } from "graphql-upload-ts";
import { createWriteStream } from "fs";
import path from "path";

@ObjectType()
class uploadResponse {
    @Field(() => String, { nullable: true })
    message: string;

    @Field(() => Number, { nullable: true })
    id?: number;
}

@Resolver()
export class UploadPicture {
    @Mutation(() => uploadResponse)
    async profilepicUpload(
        @Arg("id", () => Int) id: number,
        @Arg("userpic", () => GraphQLUpload) upload: FileUpload,
    ): Promise<uploadResponse> {
        const { createReadStream, filename } = await upload;

        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOneBy({ id });

        if (!user) {
            throw new Error(`User with ID ${id} not found`);
        }

        const newfile = "00" + id  + path.extname(filename); 
        const uploadPath = path.join(import.meta.dirname, "../../public/users", newfile)

        await new Promise((resolve, reject) =>
            createReadStream()
                .pipe(createWriteStream(uploadPath))
                .on("finish", resolve)
                .on("error", reject)
        );

        await userRepository.update(id, { userpic: newfile });
        return {
            id,
            message: 'You have changed your profile picture successfully.'
        };
    }
}