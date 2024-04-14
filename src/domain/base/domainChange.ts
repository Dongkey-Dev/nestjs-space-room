export interface IDomainChange {
  setToBeSaved<U>(data: U): void;
  setToBeRemoved<U>(data: U): void;
  setToBeUpdated<U>(data: U): void;
  exportToBeSaved<T>(): T | false;
  exportToBeRemoved<T>(): T | false;
  exportToBeUpdated<T>(): T | false;
}

export class DomainChange implements IDomainChange {
  private toBeSaved: any = false;
  private toBeRemoved: any = false;
  private toBeUpdated: any = false;

  setToBeSaved<U>(data: U): void {
    this.toBeSaved = data;
  }
  setToBeRemoved<U>(data: U): void {
    this.toBeRemoved = data;
  }
  setToBeUpdated<U>(data: U): void {
    this.toBeUpdated = data;
  }

  exportToBeSaved<T>(): T | false {
    return this.toBeSaved;
  }
  exportToBeRemoved<T>(): T | false {
    return this.toBeRemoved;
  }
  exportToBeUpdated<T>(): T | false {
    return this.toBeUpdated;
  }
}
