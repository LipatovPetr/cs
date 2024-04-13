// Vector

class Vector<T extends ArrayBufferView> {
  private capacity: number;
  private length: number;
  private buffer: T;
  private byteLength: number;

  constructor(
    arrayType: new (length: number) => T,
    { capacity }: { capacity: number }
  ) {
    this.capacity = capacity;
    this.buffer = new arrayType(capacity);
    this.length = 0;
    this.byteLength = this.buffer.byteLength;
  }

  public getCapacity() {
    return this.capacity;
  }

  public getLength() {
    return this.length;
  }

  public getByteLength() {
    return this.byteLength;
  }

  public push(value) {
    if (this.length === this.capacity) {
      const tmp = this.buffer;
      const increasedCap = this.capacity * 2;

      this.buffer = new (this.buffer.constructor as new (length: number) => T)(
        increasedCap
      );

      for (let i = 0; i < this.length; i++) {
        this.buffer[i] = tmp[i];
      }

      this.capacity = increasedCap;
      this.byteLength = this.buffer.byteLength;
    }
    this.buffer[this.length] = value;
    this.length++;
  }

  public shrinkToFit() {
    const tmp = this.buffer;

    this.buffer = new (this.buffer.constructor as new (length: number) => T)(
      this.length
    );

    for (let i = 0; i < this.length; i++) {
      this.buffer[i] = tmp[i];
    }

    this.capacity = this.length;
    this.byteLength = this.buffer.byteLength;
  }

  *values() {
    for (let i = 0; i < this.length; i++) {
      yield this.buffer[i];
    }
  }
}

const vec = new Vector(Uint8Array, { capacity: 8 });

// Matrix
class Matrix<T extends ArrayBufferView> {
  private dimensions: number[];
  private buffer: T;

  constructor(arrayType: new (length: number) => T, ...dimensions: number[]) {
    this.dimensions = dimensions;
    const totalLength = dimensions.reduce((acc, cur) => acc * cur, 1);
    this.buffer = new arrayType(totalLength);
  }

  public getBuffer(): T {
    return this.buffer;
  }

  public getByteLength(): number {
    return this.buffer.byteLength;
  }

  public getDimentions(): number[] {
    return this.dimensions;
  }

  public getIndex(...args): number {
    this.validateCoordinates(args);

    let index = 0;

    for (let i = 0; i < args.length; i++) {
      const currentElement = args[i];
      const elementsToTheLeft = this.dimensions.slice(i + 1);

      const elementsToTheLeftMultiplied = elementsToTheLeft.reduce(
        (accumulator, currentValue) => accumulator * currentValue,
        1
      );

      index += currentElement * elementsToTheLeftMultiplied;
    }

    return index;
  }

  private validateCoordinates(args: number[]): void {
    if (args.length < this.dimensions.length) {
      throw new RangeError("Too few arguments provided to the function");
    }
    if (args.length > this.dimensions.length) {
      throw new RangeError("Too many arguments provided to the function");
    }
  }
}

// Пример использования
const matrix3n4n5 = new Matrix(Int32Array, 3, 3, 3, 3); // Создание матрицы 3x4x5 типа Int32Array

console.log(matrix3n4n5.getBuffer());
console.log(matrix3n4n5.getByteLength());
console.log(matrix3n4n5.getDimentions());
console.log(matrix3n4n5.getIndex(2, 2, 2, 2));
