import multer from "multer";
import { Request } from "express";

// Configure multer for memory storage
const storage = multer.memoryStorage();

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  //   console.log("file", file);
  // Check if file is an image
  if (file.mimetype.includes("/pdf")) {
    cb(null, true);
  } else {
    console.log("Only pdf file are allowed!");
    cb(new Error("Only pdf files are allowed!"));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});
