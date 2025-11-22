// domain/interfaces/ICloudStorage.ts

export type UploadResult = {
  secure_url: string;
  public_id?: string;
};

export interface ICloudStorage {
  upload(file: Express.Multer.File): Promise<UploadResult>;
}
