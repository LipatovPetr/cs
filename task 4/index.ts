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
  private maxIndex: number;

  constructor(number: bigint) {
    this.originalNumber = number;
    this.maxIndex = -1;
    this.initialize();
  }

  public valueOf() {
    return this.bcdCodedArray;
  }

  public get(index) {
    if (index < -this.maxIndex - 1 || index > this.maxIndex) {
      throw new Error(
        `Индекс для данного числа не может быть больше ${
          this.maxIndex
        } и меньше ${-this.maxIndex - 1}`
      );
    }

    const reversedIndex = index >= 0 ? this.maxIndex - index : -index - 1;
    const bcdArrayIndex = Math.floor(reversedIndex / 7);
    const bcdInt31Index = reversedIndex % 7;

    const mask = (~0 << (32 - 4)) >>> (32 - (bcdInt31Index + 1) * 4);
    const intersection = this.bcdCodedArray[bcdArrayIndex] & mask;
    const result = intersection >>> (4 * bcdInt31Index);

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
      this.maxIndex++;

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
console.log(n.get(0));
