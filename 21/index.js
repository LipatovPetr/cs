// first iterator

const arr = [1, 3, 2, 5];

function arrayForEach(array) {
  let i = 0;
  return {
    next() {
      const done = i >= array.length;

      if (done) {
        return { value: undefined, done };
      }

      return { value: array[i++], done };
    },
  };
}

// iterator in for loop

const iter = arrayForEach(arr);

// for (let i = iter.next(); !i.done; i = iter.next()) {
//   console.log(i.value);
// }

// iterator called manualy

console.log(iter.next());
console.log(iter.next());
console.log(iter.next());
console.log(iter.next());
console.log(iter.next());
console.log(iter.next());

// iterable object

const obj = {
  [Symbol.iterator]() {
    return arrayForEach(arr);
  },
};

console.log(...obj);

for (el of obj) {
  console.log(el);
}

// 1. Необходимо написать итератор для генерации случайных чисел по заданным параметрам

// const randomInt = random(0, 100);

// console.log(randomInt.next());
// console.log(randomInt.next());
// console.log(randomInt.next());
// console.log(randomInt.next());

function random(min, max) {
  return {
    next() {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
  };
}

const getRandomInt = random(1000, 1013);

// 2. Необходимо написать функцию take, которая принимает любой Iterable объект
// и возвращает итератор по заданному количеству его элементов

// function take(iterable, max) {
//   if (!iterable[Symbol.iterator]) {
//     throw new Error("First argument has to be an iterable");
//   }

//   return {
//     [Symbol.iterator]() {
//       let count = 0;
//       return {
//         next() {
//           const done = count >= max;

//           if (done) {
//             return { value: undefined, done };
//           }

//           return { value: iterable[count++], done };
//         },
//       };
//     },
//   };
// }

function take(iterable, max) {
  if (typeof iterable[Symbol.iterator] !== "function") {
    throw new Error("First argument has to be an iterable");
  }

  return {
    [Symbol.iterator]() {
      const iterator = iterable[Symbol.iterator]();
      let count = 0;

      return {
        next() {
          if (count >= max) {
            return { value: undefined, done: true };
          }

          const result = iterator.next();
          if (result.done) {
            return result;
          }

          count++;
          return { value: result.value, done: false };
        },
      };
    },
  };
}

console.log([...take([1, 2, 3, 4, 5, 6], 2)]);

// ## Необходимо написать функцию filter, которая принимает любой Iterable
// объект и функцию-предикат. И возвращает итератор по элементам
// которые удовлетворяют предикату.

function filter(iterable, predicate) {
  if (!iterable[Symbol.iterator]) {
    throw new Error("First argument has to be an iterable");
  }

  return {
    [Symbol.iterator]() {
      const iterator = iterable[Symbol.iterator]();

      return {
        next() {
          let result = iterator.next();

          while (!result.done) {
            if (predicate(result.value)) {
              return { value: result.value, done: false };
            }
            result = iterator.next();
          }

          return { value: undefined, done: true };
        },
      };
    },
  };
}

console.log([...take(filter([1, 2, 3, 4, 5, 6], (el) => el >= 3))]);

// ## Необходимо написать функцию enumerate, которая принимает любой Iterable объект
// и возвращает итератор по парам (номер итерации, элемент)

// ```js
// const randomInt = random(0, 100);

// console.log([...take(enumerate(randomInt), 3)]); // [[0, ...], [1, ...], [2, ...]]
// ```;

function enumerate(iterable) {
  if (!iterable[Symbol.iterator]) {
    throw new Error("First argument has to be an iterable");
  }

  const iterator = iterable[Symbol.iterator]();
  let count = 0;

  return {
    [Symbol.iterator]() {
      return {
        next() {
          const result = iterator.next();

          if (result.done) {
            return result;
          }

          return { value: [count++, result.value], done: false };
        },
      };
    },
  };
}

console.log([...take(enumerate([1, 2, 3]), 1)]);

// ## Необходимо написать функцию seq, которая бы принимала множество
// Iterable объектов и возвращала итератор по их элементам

function seq() {
  const iterables = arguments;
  let currentIterableIndex = 0;
  let currentIterator = iterables[currentIterableIndex][Symbol.iterator]();

  return {
    next() {
      let result = currentIterator.next();

      if (result.done && currentIterableIndex < iterables.length - 1) {
        currentIterableIndex++;
        currentIterator = iterables[currentIterableIndex][Symbol.iterator]();
        result = currentIterator.next();
      }

      return result;
    },
    [Symbol.iterator]() {
      return this;
    },
  };
}

const testI = seq([1, 2], new Set([3, 4]), "bla");

// ## Необходимо написать класс Range, который бы позволял создавать диапазоны чисел или символов,
// а также позволял обходить элементы Range с любого конца
