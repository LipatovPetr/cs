// преобразование в бинарное представление в строке

function binary(num) {
  const str = new Uint32Array([num])[0].toString(2);
  return "0b" + str.padStart(32, "0").replace(/(.{4})(?!$)/g, "$1_");
}

// преобразование в число

function parseBinary(str) {
  return parseInt(str.replace(/^0b|_/g, ""), 2) >> 0;
}

// пример кодирования в BCD

// console.log(binary(2));
// console.log(binary(9));
// console.log(binary(7));
// console.log(binary((2 << 8) | (9 << 4) | 7));
// console.log((2 << 8) | (9 << 4) | 7);

// реализация класса

class BCD {
  private bcdCodedArray: number[] = [];
  private originalNumber: bigint;
  private digitCount: number;

  constructor(number: bigint) {
    this.originalNumber = number;
    this.digitCount = 0;
    this.initialize();
  }

  public valueOf() {
    return this.bcdCodedArray;
  }

  public get(index) {
    if (index < -this.digitCount || index >= this.digitCount) {
      throw new Error(
        `Индекс для данного числа не может быть больше ${
          this.digitCount - 1
        } и меньше ${-this.digitCount}`
      );
    }

    const bcdPosition = index >= 0 ? this.digitCount - index : -index;

    console.log(index);
    console.log(bcdPosition);

    const bcdArrayElementIndex = Math.floor(bcdPosition / 7);
    const bcdInt31Position = bcdPosition % 7;

    console.log(bcdArrayElementIndex);
    console.log(bcdInt31Position);

    const mask = (~0 << (32 - 4)) >>> (32 - bcdInt31Position * 4);
    const intersection = this.bcdCodedArray[bcdArrayElementIndex] & mask;
    const result = intersection >>> (4 * (bcdInt31Position - 1));

    return result;
  }

  private initialize(): void {
    let processedNumber = Number(this.originalNumber);
    let bcd31bitCollection = 0;
    let bcdPosition = 0;

    while (processedNumber > 0) {
      let rightmostDigit = this.getRightmostDigit(processedNumber);

      bcd31bitCollection = this.addToCollection(
        bcd31bitCollection,
        bcdPosition,
        rightmostDigit
      );

      processedNumber = this.removeRightmostNumber(processedNumber);

      bcdPosition++;
      this.digitCount++;

      if (bcdPosition % 7 === 0) {
        this.bcdCodedArray.push(bcd31bitCollection);
        bcd31bitCollection = 0;
        bcdPosition = 0;
      }

      if (processedNumber === 0) {
        this.bcdCodedArray.push(bcd31bitCollection);
      }
    }
  }

  private getRightmostDigit(number: number): number {
    return number % 10;
  }

  private addToCollection(
    collection: number,
    position: number,
    bcdToAdd: number
  ): number {
    return collection | (bcdToAdd << (0 + 4 * position));
  }

  private removeRightmostNumber(number: number): number {
    return Math.floor(number / 10);
  }
}

const n = new BCD(123456789n);

console.log(n.get(2));
