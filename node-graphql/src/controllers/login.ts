import * as bcrypt from 'bcrypt';
import {Request, Response} from 'express';
import { AppDataSource } from '../data-source.js';
import { User } from '../entity/User.js';
// import { AppDataSource } from '../data-source';
// import { User } from '../entities/user';

// import jwt, { Secret } from 'jsonwebtoken';
// import dotenv from 'dotenv';
//import { generateToken } from '../utils/jwt.utils';
import { generateToken } from '../utils/jwt.utils.js';

interface loginForm {
    username: string;
    password: string;
}

interface JwtPayload {
    id : number,
    email: string,
    // roles: string
}

export async function userLogin(req: Request<{}, {}, loginForm>, res: Response) {

    let {username, password } = req.body;
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({username: username,});
    if (user) {

        const isMatch: boolean = await bcrypt.compare(password, user.password);
        if (isMatch) {
            // console.log('JWT_SECRET' + process.env.JWT_SECRET);
            const userInfo: JwtPayload = {
                id: user.id,
                email: user.email
                // roles: user.roles,
            };
            
              const token = generateToken(userInfo);

            const data = {
                message: 'You have successfully logged-in.',
                id: user['id'],
                firstname: user['firstname'],
                lastname: user['lastname'],
                email: user['email'],
                username: user['username'],
                // roles: user['roles'],
                isactivated: user['isactivated'],
                isblocked: user['isblocked'],
                userpic: user['userpic'],
                qrcodeurl: user['qrcodeurl'],
                token: token
            }
            res.status(200).json(data);    
        } else {
            res.status(404).json({
                message: 'Invalid Password please try again.'
              });    
        }
    
    } else {
        res.status(404).json({
            message: 'Username does not exists, please register.'
          });

    }


}

