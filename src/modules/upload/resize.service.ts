import { Injectable } from "@nestjs/common";
import sharp from "sharp";

@Injectable()
export class ResizeService {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  public async withBuffer(
    buffer: Buffer,
    width: number,
    height: number
  ): Promise<Buffer> {
    return sharp(buffer).resize(width, height).toBuffer();
  }

  public async withPath(
    path: string,
    width: number,
    height: number
  ): Promise<Buffer> {
    return sharp(path).resize(width, height).toBuffer();
  }
}
