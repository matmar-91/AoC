import * as readline from "node:readline";
import * as fs from "node:fs";

const reader = readline.createInterface({
  input: fs.createReadStream("input.txt"),
});

let sum = 0;

reader.on("line", (line) => {
  const digits = line.match(/\d/g);
  
  if (digits === null) {
    return;
  }

  const calibrationValue = digits[0] + digits[digits.length - 1];
  sum += Number.parseInt(calibrationValue);
});

reader.on("close", () => {
  console.log(sum);
});
