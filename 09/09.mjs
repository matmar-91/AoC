import { createInterface } from "readline";
import { createReadStream } from "fs";
console.time("test");
let sum1 = 0;
let sum2 = 0;

const reader = createInterface({
  input: createReadStream("input.txt"),
});

reader.on("line", (line) => {
  const numbers = line.split(" ").map((number) => Number.parseInt(number));
  part1([...numbers]);
  part2([...numbers]);
});

reader.on("close", () => {
  console.log("Part 1: ", sum1);
  console.log("Part 2: ", sum2);
  console.timeEnd("test");
});

const part1 = function (numbers) {
  const lastNumbers = [];
  while (undefined !== numbers.find((n) => n !== 0)) {
    let tmp = [];
    for (let i = 0; i < numbers.length - 1; i++) {
      tmp.push(numbers[i + 1] - numbers[i]);
    }
    lastNumbers.unshift(numbers.pop());
    numbers = tmp;
  }

  sum1 += lastNumbers.reduce((a, b) => a + b);
};

const part2 = function (numbers) {
  const firstNumbers = [];
  while (undefined !== numbers.find((n) => n !== 0)) {
    let tmp = [];
    for (let i = 0; i < numbers.length - 1; i++) {
      tmp.push(numbers[i + 1] - numbers[i]);
    }
    firstNumbers.unshift(numbers.shift());
    numbers = tmp;
  }

  sum2 += firstNumbers.reduce((a, b) => b - a);
};
