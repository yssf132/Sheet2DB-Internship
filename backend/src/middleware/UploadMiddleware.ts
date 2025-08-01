import multer from 'multer';
import path from 'path';

// Destination et nom de fichier
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // stocké dans /uploads
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    const timestamp = Date.now();
    const uniqueName = `${baseName}_${timestamp}${ext}`;
    cb(null, uniqueName);
  }
});

// Filtrer les formats autorisés
const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowed = ['.xlsx', '.xls', '.csv'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Unauthorized format. Use .xlsx, .xls, or .csv.'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
  fileSize: 10 * 1024 * 1024, // Max file size: 10MB
  files: 1                    // Max number of files per request
  }
  
});

export default upload;
