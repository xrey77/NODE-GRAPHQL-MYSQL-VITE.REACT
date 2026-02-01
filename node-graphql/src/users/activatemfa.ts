import { Resolver, Arg, Query, Mutation, ObjectType, Field, Int} from "type-graphql";
import { AppDataSource } from "../data-source.js";
import { GraphQLError } from "graphql"; 
import { User } from "../entity/User.js";
import * as otplib from 'otplib';
import * as QRCode from 'qrcode';

@ObjectType()
class mfaResponse {
    @Field(() => String, { nullable: true })
    message: string;

    @Field(() => String, { nullable: true })
    qrcodeurl: string;

    @Field(() => Number, { nullable: true })
    id?: number;
}

@Resolver()
export class ActivateMFA {
    @Mutation(() => mfaResponse)
    async mfaActivation(
        @Arg("id", () => Int) id: number,
        @Arg("TwoFactorEnabled", () => Boolean) TwoFactorEnabled: boolean
    ): Promise<mfaResponse> {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOneBy({ id });

        if (!user) {
            throw new GraphQLError(`User with ID ${id} not found`);
        }

        if (TwoFactorEnabled) {
            const secret = otplib.generateSecret();
            const otpauth = otplib.generateURI({
            label: user.email,          // Corresponds to user identification
            issuer: 'BARCLAYS-BANK',   // Your service name
            secret: secret             // The shared secret
            });
            const qrurl = await QRCode.toDataURL(otpauth);
            await userRepository.update(id, { secret: secret, qrcodeurl: qrurl });
            return {
                id, 
                qrcodeurl: qrurl,
                message: 'Multi-Factor Authenticator has successfully enabled.'
            };

        } else {
            await userRepository.update(id, {secret: null, qrcodeurl: null });
            throw new GraphQLError('Multi-Factor Authenticator has successfully disabled.');
        }

    }   
}