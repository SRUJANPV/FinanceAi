import multer from 'multer'; import fs from 'fs';
import path from 'path';
const receiptDirectory = 'uploads/receipts'; fs.mkdirSync(receiptDirectory, { recursive: true });
const storage = multer.diskStorage({ destination: receiptDirectory, filename: (req, file, cb) => cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname).toLowerCase()}`) });
export const uploadReceipt = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 }, fileFilter: (req, file, cb) => cb(null, /^image\/(jpeg|png|webp)$/.test(file.mimetype)) }).single('receipt');
export const scanReceipt = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 }, fileFilter: (req, file, cb) => cb(null, /^image\/(jpeg|png|webp)$/.test(file.mimetype)) }).single('receipt');
