import sharp from "sharp";
import { singleton } from "tsyringe";

interface ProcessorBufferItem {
  blob: Blob;
  optimized: Buffer;
}

@singleton()
export class ImageProcessor {
  private _processedBuffer: Array<ProcessorBufferItem> = [];

  public async processBlob(
    blob: Blob,
    resizeHeight?: number,
    resizeWidth?: number,
  ): Promise<Buffer> {
    const buffered = this._processedBuffer.find((e) => e.blob === blob);
    if (buffered !== undefined) return buffered.optimized;

    const buffer = Buffer.from(await blob.arrayBuffer());
    const optimized = await sharp(buffer)
      .trim()
      .resize({ height: resizeHeight, width: resizeWidth, fit: "cover" })
      .flatten({ background: { r: 255, g: 255, b: 255 } })
      .jpeg()
      .toBuffer();

    return optimized;
  }

  public async blobToBuffer(blob: Blob): Promise<Buffer> {
    const buffered = this._processedBuffer.find((e) => e.blob === blob);
    if (buffered !== undefined) return buffered.optimized;

    const buffer = Buffer.from(await blob.arrayBuffer());

    return buffer;
  }
}
