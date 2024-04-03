import { ZodObject, z } from 'zod';
import { IDomainChange } from './domainChange';
import { T_UUID } from 'src/util/uuid';

export abstract class BaseDomain<T extends ZodObject<any>> {
  protected zodSchema: T;
  protected changes?: IDomainChange;
  constructor(zodObject: T) {
    this.zodSchema = zodObject;
  }

  isValid(): boolean {
    const result = this.zodSchema.safeParse(this);
    return result.success;
  }

  exportJson() {
    const recursiveExport = (obj: any, schemaShape: any): any => {
      return Object.keys(schemaShape).reduce((acc, key) => {
        const value = obj[key];
        if (value instanceof T_UUID) {
          acc[key] = value.exportString();
        } else if (value instanceof ZodObject) {
          acc[key] = recursiveExport(value, schemaShape[key].shape);
        } else {
          acc[key] = value;
        }
        return acc;
      }, {});
    };
    return recursiveExport(this, this.zodSchema.shape);
  }

  import(data: z.input<typeof this.zodSchema>): any {
    Object.assign(this, this.zodSchema.parse(data));
  }
}
