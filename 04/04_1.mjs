import { createInterface } from "readline";
import { createReadStream } from "fs";

const reader = createInterface({
  input: createReadStream("input.txt"),
});

const whitespaceRegex = /\s+/;
let sum = 0;

reader.on("line", (line) => {
  let result = 0;
  const [myNumbers, winningNumbers] = line
    .split(":")[1]
    .split("|")
    .map((str) => str.trim().split(whitespaceRegex));

  myNumbers.forEach((number) => {
    if (winningNumbers.includes(number)) {
      result = result === 0 ? 1 : result * 2;
    }
  });

  sum += result;
});

reader.on("close", () => console.log(sum));
