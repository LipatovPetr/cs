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

vec.push(1);
vec.push(2);
vec.push(3);
vec.push(4);
vec.push(5);
vec.push(6);

console.log(vec.getLength());
console.log(vec.getCapacity());

console.log(vec.getLength());
console.log(vec.getCapacity());
console.log(vec.getByteLength());

vec.shrinkToFit();

console.log(vec.getLength());
console.log(vec.getCapacity());
console.log(vec.getByteLength());

const i = vec.values();

console.log(i.next());
console.log(i.next());
console.log(i.next());
console.log(i.next());
console.log(i.next());
console.log(i.next());
console.log(i.next());
console.log(i.next());
