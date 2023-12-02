import { createReadStream } from "node:fs";
import { createInterface } from "node:readline";

const reader = createInterface({
  input: createReadStream("input.txt"),
});

let sum = 0;

const regex = /(\d+) (\w+)/g;

reader.on("line", (line) => {
  const cubes = {
    red: 0,
    green: 0,
    blue: 0,
  };

  for (const [_, value, color] of line.matchAll(regex)) {
    const valueAsNumber = Number.parseInt(value);
    if (valueAsNumber > cubes[color]) {
      cubes[color] = valueAsNumber;
    }
  }

  sum += cubes.red * cubes.green * cubes.blue;
});

reader.on("close", () => {
  console.log(sum);
});
