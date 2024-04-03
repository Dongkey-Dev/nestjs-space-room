import { randomUUID } from 'crypto';

export type IUUIDTransable = string | Buffer | T_UUID;
export class T_UUID {
  private uuid: Buffer;
  constructor(input?: IUUIDTransable) {
    if (input == undefined) {
      this.fromString(randomUUID());
    } else if (typeof input == 'string') {
      this.fromString(input);
    } else if (input instanceof T_UUID) {
      this.uuid = input.exportBuffer();
    } else if (input instanceof Buffer) {
      this.uuid = input;
    } else this.uuid = Buffer.from(input);
  }

  exportString(): string {
    return this.uuid.toString('hex');
  }

  exportBuffer(): Buffer {
    return Buffer.from(this.uuid);
  }

  isEqual(destination: IUUIDTransable) {
    return this.compareWith(destination) === 0;
  }

  private fromString(text: string) {
    this.uuid = Buffer.from(text.replace(/\-/g, ''), 'hex');
  }

  private compareWith(destination: IUUIDTransable) {
    const destUUID = new T_UUID(destination);
    return Buffer.compare(this.uuid, destUUID.exportBuffer());
  }
}
