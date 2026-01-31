import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../public/users'));
  },
  filename: (req, file, cb) => {
    const newfile = "00" + req.params.id  + path.extname(file.originalname);
    cb(null, newfile);

  },
});

const upload = multer({ storage: storage });

export default upload;
