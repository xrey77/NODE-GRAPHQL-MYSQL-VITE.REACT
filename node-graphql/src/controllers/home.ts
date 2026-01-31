import {Request, Response} from 'express';
import path from 'path';
import * as fs from 'fs';

// const currentDir = __dirname; 
const currentDir = import.meta.dirname;


export async function getHome(req: Request, res: Response) {
    const filePath = path.join(currentDir, '..', 'public', 'index.html'); 
    fs.readFile(filePath, 'utf8', (err: any, data: any) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        }
    });
}