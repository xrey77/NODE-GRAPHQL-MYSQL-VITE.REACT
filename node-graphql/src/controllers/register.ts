import {Request, Response} from 'express';
//import { AppDataSource } from '../data-source';
import { AppDataSource } from '../data-source.js';
// import { User } from '../entities/user';
//import { User } from '../entities/user.js';
import { User } from '../entity/User.js';
import * as bcrypt from 'bcrypt';

interface registrationForm {
    firstname: string;
    lastname: string;
    email: string;
    mobile: string;
    username: string;
    password: string;
}
export async function userRegistration(req: Request<{}, {}, registrationForm>, res: Response) {
    let { firstname, lastname, email, mobile ,username, password } = req.body;
    const userRepository = AppDataSource.getRepository(User);
    try {

        const saltRounds = 10;
        const hash = await bcrypt.hash(password, saltRounds);
        const userEmail = await userRepository.findOneBy({email: email,});
        if (userEmail) {
            res.status(404).json({
                message: 'Email Address is already taken.'
              });
        }

        const userName = await userRepository.findOneBy({username: username,});
        if (userName) {
            res.status(404).json({
                message: 'Username is already taken.'
              });
        }

        const user = new User();
        user.firstname = firstname;
        user.lastname = lastname;
        user.email = email;
        user.mobile = mobile;
        user.username = username;
        user.password = hash;
        await userRepository.save(user);

        res.status(200).json({
            message: 'Registration successfully completed.'
          });
  
        // const [rows, fields] = await db.promise().query('SELECT * FROM customers');

        // const insertQuery = "INSERT INTO users (username, email) VALUES ($1, $2) RETURNING *";
        // const result =  db.execute(insertQuery, [username, email]);
    
        // Return the created user record
        // return result.rows[0];


        // await db.promise().query('SELECT * FROM customers');
    } catch(error: any) {
        res.status(400).json({
            message: error.message
          });

    }

}

