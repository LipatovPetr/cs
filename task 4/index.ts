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

console.log(binary(2));
console.log(binary(9));
console.log(binary(7));
console.log(binary((2 << 8) | (9 << 4) | 7));
console.log((2 << 8) | (9 << 4) | 7);

// реализация класса

class BCD {
  private number: bigint;
  private numbers: number[] = [];

  constructor(number: bigint) {
    this.number = number;
  }

  valueOf(): bigint {
    return 234n;
  }
}

const test = new BCD(12n);

console.log(test.valueOf());

let num = 1212121212;
let numbers: number[] = [];
let bcdCollection31bit = 0;
let bcdPosition = 0;

while (num > 0) {
  let rightmostDigit = getRightmostDigit(num);

  bcdCollection31bit = addToCollection(
    bcdCollection31bit,
    bcdPosition,
    rightmostDigit
  );

  num = removeRightmostNumber(num);
  bcdPosition++;

  if (bcdPosition % 7 === 0) {
    numbers.push(bcdCollection31bit);
    bcdCollection31bit = 0;
    bcdPosition = 0;
  }

  if (num === 0) {
    numbers.push(bcdCollection31bit);
  }
}

function getRightmostDigit(number) {
  return number % 10;
}

function addToCollection(collection, position, bcdToAdd) {
  return collection | (bcdToAdd << (0 + 4 * position));
}

function removeRightmostNumber(number) {
  return Math.floor(number / 10);
}

console.log(numbers);

console.log(binary(numbers[0]));
console.log(binary(numbers[1]));
console.log(binary(numbers[2]));
