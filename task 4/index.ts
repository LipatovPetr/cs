// преобразование в бинарное представление в строке

function binary(num) {
  const str = new Uint32Array([num])[0].toString(2);
  return "0b" + str.padStart(32, "0").replace(/(.{4})(?!$)/g, "$1_");
}

//  преобразование в число

function parseBinary(str) {
  return parseInt(str.replace(/^0b|_/g, ""), 2) >> 0;
}

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
    const bigint1 = BigInt(this.bcdCodedArray[0]);
    const bigint2 = BigInt(this.bcdCodedArray[1]);

    console.log(bigint1);
    console.log(bigint2);

    return binary(2);
  }

  public get(index) {
    if (index < -this.maxIndex - 1 || index > this.maxIndex) {
      throw new Error(
        `Индекс для данного числа не может быть больше ${
          this.maxIndex
        } и меньше ${-this.maxIndex - 1}`
      );
    }

    const bcdFullReversedIndex =
      index >= 0 ? this.maxIndex - index : -index - 1;
    const bcdContainerReversedIndex = Math.floor(bcdFullReversedIndex / 7);
    const bcdReversedIndex = bcdFullReversedIndex % 7;

    const mask = this.createMask(4, bcdReversedIndex);
    const intersection = this.bcdCodedArray[bcdContainerReversedIndex] & mask;
    const result = intersection >>> (4 * bcdReversedIndex);

    return result;
  }

  private createMask(len, bcdReversedIndex) {
    let r = ~0;
    r <<= 32 - len;
    r >>>= 32 - (bcdReversedIndex + 1) * 4;
    return r;
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
console.log(n.valueOf());
console.log(n.get(-4));
