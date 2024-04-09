export abstract class DomainManager<T> {
  protected targetDomain: new (obj) => T;
  constructor(targetDomain: new () => T) {
    this.targetDomain = targetDomain;
  }
  createDomain(obj?) {
    return new this.targetDomain(obj);
  }
  protected abstract sendToDatabase(toDomain: T): Promise<boolean>;
  protected abstract getFromDatabase(entityKey: any, condition?): Promise<T>;
  protected abstract getListFromDatabase(entityKey: any, condition?);

  getDomain(entityKey: any): Promise<T> {
    return this.getFromDatabase(entityKey);
  }

  getDomainList(entityKey: any): Promise<T[]> {
    return this.getListFromDatabase(entityKey);
  }

  applyDomain(domain: T): Promise<boolean> {
    return this.sendToDatabase(domain);
  }
}
