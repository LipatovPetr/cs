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
  public length: number;
  private dimensions: number[];
  private buffer: T;

  constructor(arrayType: new (len: number) => T, ...dimensions: number[]) {
    this.dimensions = dimensions;
    this.length = dimensions.reduce((acc, cur) => acc * cur, 1);
    this.buffer = new arrayType(this.length);
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
    this.validateArgumentsLength(args);
    this.validateDimensions(args);

    let index = 0;

    for (let i = 0; i < args.length; i++) {
      const currentElement = args[i];
      const elementsToTheLeftFromCurrent = this.dimensions.slice(i + 1);

      const elementsToTheLeftMultiplied = elementsToTheLeftFromCurrent.reduce(
        (accumulator, currentValue) => accumulator * currentValue,
        1
      );

      index += currentElement * elementsToTheLeftMultiplied;
    }

    return index;
  }

  public set(...args) {
    const coordinats = args.slice(0, args.length - 1);
    const value = args.pop();

    this.validateArgumentsLength(coordinats);
    this.validateDimensions(coordinats);

    const index = this.getIndex(...coordinats);

    return (this.buffer[index] = value);
  }

  private validateArgumentsLength(args: number[]): void {
    if (args.length !== this.dimensions.length) {
      throw new RangeError(
        `The matrix has ${this.dimensions.length} coordinates dimensions`
      );
    }
  }

  private validateDimensions(args) {
    for (let i = 0; i < this.dimensions.length; i++) {
      if (this.dimensions[i] - 1 < args[i]) {
        throw new RangeError(
          `Coordinates are out of bounds of the matrix (index: ${i}, value:  ${args[i]})`
        );
      }
    }
  }

  *values() {
    for (let i = 0; i < this.length; i++) {
      yield this.buffer[i];
    }
  }

  [Symbol.iterator]() {
    return this.values();
  }
}

const matrix = new Matrix(Int32Array, 2, 3, 3);

console.log(matrix.getBuffer());

console.log(matrix.set(1, 2, 2, 6));
console.log(matrix.set(1, 2, 1, 5));
console.log(matrix.set(1, 2, 0, 4));
console.log(matrix.set(1, 1, 2, 3));
console.log(matrix.set(1, 1, 1, 2));
console.log(matrix.set(1, 1, 0, 1));

console.log(matrix.getBuffer());

let j = matrix.values();

for (let val of matrix) {
  console.log(val);
}
