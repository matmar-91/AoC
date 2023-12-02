import { createReadStream } from "node:fs";
import { createInterface } from "node:readline";

const reader = createInterface({
  input: createReadStream("input.txt"),
});

const bag = {
  red: 12,
  green: 13,
  blue: 14,
};

let sum = 0;

const regex = /(\d+) (\w+)/g;

reader.on("line", (line) => {
  const game = line.split(":")[0].substring(5);
  for (const [_, value, color] of line.matchAll(regex)) {
    if (bag[color] < value) {
      return;
    }
  }
  sum += Number.parseInt(game);
});

reader.on("close", () => {
  console.log(sum);
});
