import { Router, RequestHandler } from 'express';
import multer, { FileFilterCallback } from 'multer';
import path from 'node:path';
import Hotel from '../models/Hotel.model'; // ajusta o caminho

/* ---------- storage local "uploads/" ---------- */
const storage = multer.diskStorage({
  destination: 'uploads', // pasta
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname); // ".jpg"
    const base = path
      .basename(file.originalname, ext)
      .toLowerCase()
      .replace(/\s+/g, '-'); // slug
    cb(null, `${base}-${Date.now()}${ext}`);
  },
});
const upload = multer({ storage });

/* ---------- handler tipado ---------- */
const uploadPhoto: RequestHandler = async (req, res) => {
  const { id } = req.params;

  if (!req.file) {
    res.status(400).json({ message: 'Sem ficheiro' });
    return;
  }

  const url = `${req.protocol}://${req.get('host')}/uploads/${
    req.file.filename
  }`;

  await Hotel.findByIdAndUpdate(id, { $push: { photos: url } });

  res.json({ url }); // não devolvemos explicitamente a Response
};

const router = Router();

/* field='photo' no form-data */
router.post('/hotel/:id', upload.single('photo'), uploadPhoto);

export default router;
