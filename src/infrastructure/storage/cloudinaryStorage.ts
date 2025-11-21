// src/infrastructure/storage/CloudinaryService.ts
import { ICloudStorage, UploadResult } from "@/domain/entities/cloudinary";
import { v2 as cloudinary } from "cloudinary";

export class CloudinaryService implements ICloudStorage {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.CLOUD_KEY,
      api_secret: process.env.CLOUD_SECRET,
    });
  }

  async upload(file: Express.Multer.File): Promise<UploadResult> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "ed-tech-ai/docs", resource_type: "auto" },
        (error, result) => {
          if (error) {
            console.log("error --->", error);
            return reject(error);
          }
          resolve({
            secure_url: result!.secure_url,
            public_id: result!.public_id,
          });
        }
      );
      stream.end(file.buffer);
    });
  }
}
