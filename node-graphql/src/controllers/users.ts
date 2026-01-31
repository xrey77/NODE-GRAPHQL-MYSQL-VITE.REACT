import {Request, Response} from 'express';
// import { AppDataSource } from '../data-source';
// import { User } from '../entities/user';
import { AppDataSource } from '../data-source.js';
import { User } from '../entity/User.js';
import * as bcrypt from 'bcrypt';

interface passwordForm {
  id: number,
  password: string
}

interface profileForm {
  id: number,
  firstname: string,
  lastname: string,
  mobile: string
}


export async function getUserbyid(req: Request, res: Response) {
    let id: any =  req.params.id; 
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({id: id,});
    if (user) {
      res.status(200).json({
        user,
        message: 'Data has been retrieved successfully',
      });
    } else {
      res.status(404).json({
        message: 'User not found.',
      });
    }
}

export async function changePassword(req: Request<{}, {}, passwordForm>, res: Response) {
  let { id, password } = req.body;
  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOneBy({id: id,});
  if (user) {
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    await userRepository.update(id, {
      password: hash
    });
    res.status(200).json({
      user,
      message: 'Your password has been changed successfully',
    });
    
  } else {
    res.status(404).json({
      message: 'User not found.',
    })
  }
}

export async function getAllusers(req: Request, res: Response) { 
  const userRepository = AppDataSource.getRepository(User);
  const users = await userRepository.find();
  const data = [
    {
      id: users[0].id,
      firstname: users[0].firstname,
      lastname: users[0].lastname,
      email: users[0].email,
      username: users[0].username,
      secret: users[0].secret,
      userpic: users[0].userpic,
      // roles: users[0].roles,
      qrcodeurl: users[0].qrcodeurl
    }
  ]
  res.status(200).json(data);
}

export async function updateProfile(req: Request<{}, {}, profileForm>, res: Response) {
  let { id, firstname, lastname, mobile} = req.body;
  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOneBy({id: id,});
  if (user) {

    await userRepository.update(id, {
      firstname: firstname,
      lastname: lastname,
      mobile: mobile
    });

    res.status(200).json({
      message: 'You updated your profile successfully',
    });

  } else {
    res.status(404).json({
      message: 'User not found.',
    });
  }

}



