import { ZodObject, z } from 'zod';
import { IDomainChange } from './domainChange';
import { T_UUID } from '../../util/uuid';

type TrueMap<T> = {
  [P in keyof T]?: T[P] extends object ? TrueMap<T[P]> : true;
};

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

  exportJsonWithOmitSchema(
    omitSchema: TrueMap<Partial<z.infer<typeof this.zodSchema>>>,
  ): any {
    const currentData = this.exportJson();
    this.deleteKeys(currentData, omitSchema);
    return currentData;
  }

  private deleteKeys(data: any, schema: TrueMap<any> | any) {
    Object.keys(schema).forEach((key) => {
      if (schema[key] === true) {
        delete data[key];
      } else if (typeof schema[key] === 'object' && data[key] !== undefined) {
        this.deleteKeys(data[key], schema[key]);
        if (Object.keys(data[key]).length === 0) {
          delete data[key];
        }
      }
    });
  }

  import(data: z.input<typeof this.zodSchema>): any {
    Object.assign(this, this.zodSchema.parse(data));
  }

  importPartial(data: Partial<z.infer<typeof this.zodSchema>>): any {
    Object.assign(this, this.zodSchema.partial().parse(data));
  }
}
