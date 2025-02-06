export interface deleteFileQueue {
  filename: string;
  filePath: string;
  isFolder: boolean;
}

export interface ReSizeFileQueue {
  filePath: string;
  width: number;
  height: number;
}
