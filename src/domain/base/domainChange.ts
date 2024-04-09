export interface IDomainChange {
  setToBeSaved<U>(data: U): void;
  setToBeRemoved<U>(data: U): void;
  setToBeUpdated<U>(data: U): void;
  exportToBeSaved<T>(): T | false;
  exportToBeRemoved<T>(): T | false;
  exportToBeUpdated<T>(): T | false;
}
