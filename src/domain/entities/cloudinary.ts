// domain/interfaces/ICloudStorage.ts

export interface ICloudStorage {
  upload(file: any): Promise<string>;
}
