// Common loop

for (let i = 1n; i <= 16n; i++) {
  let output = "";
  if (i % 3n === 0n) output += "Fizz";
  if (i % 5n === 0n) output += "Buzz";
  console.log(output || i);
}

// Custom Generator via Closure

function fizzBuzzGenerator() {
  let i = 1n;
  return {
    next: function () {
      let result = "";
      if (i % 3n === 0n) result += "Fizz";
      if (i % 5n === 0n) result += "Buzz";
      i++;
      return result || i - 1n;
    },
  };
}

const myFizzBuzz = fizzBuzzGenerator();

console.log(myFizzBuzz.next());
console.log(myFizzBuzz.next());
console.log(myFizzBuzz.next());
console.log(myFizzBuzz.next());
console.log(myFizzBuzz.next());
console.log(myFizzBuzz.next());
console.log(myFizzBuzz.next());
console.log(myFizzBuzz.next());
console.log(myFizzBuzz.next());
console.log(myFizzBuzz.next());
console.log(myFizzBuzz.next());
console.log(myFizzBuzz.next());
console.log(myFizzBuzz.next());
console.log(myFizzBuzz.next());
console.log(myFizzBuzz.next());
console.log(myFizzBuzz.next());
console.log(myFizzBuzz.next());
console.log(myFizzBuzz.next());
console.log(myFizzBuzz.next());
console.log(myFizzBuzz.next());
console.log(myFizzBuzz.next());
console.log(myFizzBuzz.next());
console.log(myFizzBuzz.next());
console.log(myFizzBuzz.next());
console.log(myFizzBuzz.next());
console.log(myFizzBuzz.next());
console.log(myFizzBuzz.next());
console.log(myFizzBuzz.next());
console.log(myFizzBuzz.next());
console.log(myFizzBuzz.next());
