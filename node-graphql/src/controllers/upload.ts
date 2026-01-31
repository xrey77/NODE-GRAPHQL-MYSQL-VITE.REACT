import { Request, Response } from 'express';
import { User } from '../entity/User.js';
import { AppDataSource } from '../data-source.js';
import upload from '../config/multerConfig.js';
// import upload from './config/multerConfig';
// import { AppDataSource } from '../data-source';
// import { User } from '../entities/user';

interface MulterRequest extends Request {
  file: Express.Multer.File;
}

export const uploadFile = async (req: Request, res: Response) => {
    let id: any =  req.params.id; 
    const typedReq = req as MulterRequest;

  if (!typedReq.file) {
    res.status(400).json({
        message: 'There is no file uploaded, please select your picture.',
      });    
  }

  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOneBy({id: id,});
  if (user) {

      const imagefile = 'http://localhost:3000/users/' + typedReq.file.filename;  
      await userRepository.update(id, {
        userpic: imagefile
      });

      res.status(200).json({
        userpic: imagefile,
        message: 'You have changed your profile picture successfully',
      });
    
  }

};

export const uploadMiddleware = upload.single('userpic');
