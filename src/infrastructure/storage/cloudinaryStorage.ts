import { ICloudStorage } from "@/domain/entities/cloudinary";
import { v2 as cloudinary } from "cloudinary";

export class CloudinaryService implements ICloudStorage {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.CLOUD_KEY,
      api_secret: process.env.CLOUD_SECRET,
    });
  }

  async upload(file: any): Promise<string> {
    const result = await cloudinary.uploader.upload(file.path);
    return result.secure_url;
  }
}
