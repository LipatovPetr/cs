const jsdom = require("jsdom");
const { JSDOM } = jsdom;

// # ДЗ к лекции База#23

// простейший пример генератора

function* example() {
  for (let i = 0; i < 3; i++) {
    yield i;
  }
}

const g = example();

console.log(g);

console.log(g.next());
console.log(g.next());
console.log(g.next());
console.log(g.next());

// сравнение итератора и генератора
// (без учета разницы неявного вызова return)

function iterarate1(arr) {
  let cursor = 0;
  let done = false;

  return {
    [Symbol.iterator]() {
      return this;
    },

    next() {
      if (done || cursor >= arr.length) {
        return { done: true, value: undefined };
      }

      return { done: false, value: arr[cursor++] };
    },
  };
}

function* iterate2(arr) {
  for (let cursor = 0; cursor < arr.length; cursor++) {
    yield arr[cursor];
  }
}

const i1 = iterarate1([1, 2, 3]);
const i2 = iterate2([1, 2, 3]);

for (const el of i1) {
  console.log(el);
}

for (const el of i2) {
  console.log(el);
}

// еще один пример генератора

function* brighten() {
  let value = 0;
  while (true) {
    const newValue = yield value;

    if (newValue > value) {
      console.log("increase by", newValue);
    } else {
      console.log("decrease by", newValue);
    }
    value = newValue;
  }
}

const lamp = brighten();
lamp.next();
lamp.next(10);
lamp.next(20);
lamp.next(10);
lamp.next(5);

// пример с throw

function* gen() {
  while (true) {
    try {
      for (let i = 0; i < 10; i++) {
        yield i;
      }
    } catch (flag) {
      if (flag === "RESET") {
        continue;
      }
    }
  }
}

const iter = gen();

console.log(iter.next());
console.log(iter.next());
console.log(iter.next());
console.log(iter.throw("RESET"));
console.log(iter.next());
console.log(iter.next());

// пример yield* (со звездочкой)

function* example2() {
  yield* [1, 2, 3];
}

const it = example2();

console.log(it.next());
console.log(it.next());
console.log(it.next());
console.log(it.next());

// ## Необходимо реализовать набор итераторов по DOM дереву

// Должны быть реализованы итераторы для обхода: "вверх по иерархии узлов", "обход сестринских узлов", "обход всех потомков".
// Для тестирования в среде Node.js можно использовать библиотеку https://www.npmjs.com/package/jsdom.
// Итераторы должны быть написаны как С, так и без помощи генераторов.

// ```js
// console.log(...siblings(myNode));
// console.log(...ancestors(myNode));
// console.log(...descendants(myNode));
// ```

const dom = new JSDOM(`
  <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>My Website</title>
  </head>
  <body>
<div id="container">
 <ul class="list">
  <li class="foo1">1</li>
  <li class="foo2">2</li>
  <li id="center" class="foo3">3</li>
  <li class="foo4">4</li>
  <li class="foo5">5</li>
 </ul>
</div>
  </body>
</html>`);

function* siblings(node) {
  let next = node;

  do {
    next = next.previousSibling;

    if (next != null && next.nodeType === node.ELEMENT_NODE) {
      yield next;
    }
  } while (next != null);

  next = node;

  do {
    next = next.nextSibling;

    if (next != null && next.nodeType === node.ELEMENT_NODE) {
      yield next;
    }
  } while (next != null);
}

function* ancestors(node) {
  let next = node;
  do {
    next = next.parentNode;
    if (next != null && next.nodeType === node.ELEMENT_NODE) {
      yield next;
    }
  } while (next != null);
}

// console.log(...siblings(dom.window.document.getElementById("center")));
console.log(...ancestors(dom.window.document.getElementById("center")));
