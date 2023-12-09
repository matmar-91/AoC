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
  sum1 += solve([...numbers]);
  sum2 += solve([...numbers].reverse());
});

reader.on("close", () => {
  console.log("Part 1: ", sum1);
  console.log("Part 2: ", sum2);
  console.timeEnd("test");
});

function solve(numbers) {
  const lastNumbers = [];
  while (undefined !== numbers.find((n) => n !== 0)) {
    let tmp = [];
    for (let i = 0; i < numbers.length - 1; i++) {
      tmp.push(numbers[i + 1] - numbers[i]);
    }
    lastNumbers.unshift(numbers.pop());
    numbers = tmp;
  }

  return lastNumbers.reduce((a, b) => a + b);
}
