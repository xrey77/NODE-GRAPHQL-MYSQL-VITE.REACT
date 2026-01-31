import {Request, Response} from 'express';
import { AppDataSource } from '../data-source.js';
import { User } from '../entity/User.js';
// import { AppDataSource } from '../data-source';
// import { User } from '../entities/user';
// import { authenticator } from 'otplib';
import * as otplib from 'otplib';

//import { authenticator } from 'otplib/otplib-browser';

import * as QRCode from 'qrcode';

interface mfaForm {
    id: number,
    Twofactorenabled: boolean
}

interface verifyForm {
  id: number,
  otp: string
}

export async function activateMfa(req: Request<{}, {}, mfaForm>, res: Response) {
    let { id, Twofactorenabled } = req.body;

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({id: id,});
    if (user) {
      if (Twofactorenabled === true) {
  
        const secret = otplib.generateSecret();
        // const secret = authenticator.generateSecret(); 
        // const otpauth = authenticator.keyuri(user['email'], 'BARCLAYS-BANK', secret);
        const otpauth = otplib.generateURI({
          label: user['email'],      // Corresponds to user identification
          issuer: 'BARCLAYS-BANK',   // Your service name
          secret: secret             // The shared secret
        });
        const qrCodeUrl = await QRCode.toDataURL(otpauth);

        await userRepository.update(id, { secret: secret, qrcodeurl: qrCodeUrl, });
        res.status(200).json({
            qrcodeurl: qrCodeUrl,
            message: 'Multi-Factor Authenticator is enabled.',
          });
    
    } else {

        // await userRepository.update(id, { qrcodeurl: null, });
        res.status(200).json({
            message: 'Multi-Factor Authenticator is disabled.',
          });    
    }
  
  
    } else {
      res.status(404).json({
        message: 'User not found.',
      });
    }
  
  }
  
  // async function checkToken(token, secret) {
  //   const { valid } = await otplib.verify({ token, secret });
  //   return valid;
  // }

  export async function verifyMfa(req: Request<{}, {}, verifyForm>, res: Response) {
    let { id, otp } = req.body;
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({id: id,});

    if (user) {
      const token: any = otp;
      const secret: any = user['secret'];
      try {
        const { valid } = await otplib.verify({ token, secret });        
        if (valid) {

          res.status(200).json({
            message: 'OTP Code is successfully validated.',
            username: user['username']
          });    

        } else {

          res.status(400).json({
            message: 'Invalid OTP Code, please try again.',
          });    

        }
      } catch(error) {
        res.status(400).json({
          message: error,
        });    

      }

    }
  }
