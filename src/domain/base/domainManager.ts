export abstract class DomainManager<T> {
  protected targetDomain: new () => T;
  constructor(targetDomain: new () => T) {
    this.targetDomain = targetDomain;
  }
  createDomain(): T {
    return new this.targetDomain();
  }
  protected abstract sendToDatabase(toDomain: T): Promise<boolean>;
  protected abstract getFromDatabase(entityKey: any, condition?): Promise<T>;
  protected abstract getListFromDatabase(
    entityKey: any,
    condition?,
  ): Promise<T[]>;

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
