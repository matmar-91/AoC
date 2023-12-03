import { createInterface } from "readline";
import { createReadStream } from "fs";

const reader = createInterface({
  input: createReadStream("input.txt"),
});

const numberRegex = /\d+/g;

let sum = 0;

const lines = [null, null, null];

reader.on("line", (line) => {
  scroll(lines, line);
  sum += calculateSum(lines);
});

reader.on("close", () => {
  scroll(lines, null);
  sum += calculateSum(lines);
  console.log(sum);
});

const scroll = (lines, line) => {
  lines[0] = lines[1];
  lines[1] = lines[2];
  lines[2] = line;
};

const calculateSum = (lines) => {
  let subtotal = 0;
  let [upper, current, lower] = lines;

  if (current === null) {
    return 0;
  }

  for (let i = 0; i < current.length; i++) {
    if (current[i] === "*") {
      const adjacents = [
        ...getAdjacents(upper, i),
        ...getAdjacents(current, i),
        ...getAdjacents(lower, i),
      ];
      subtotal += adjacents.length === 2 ? adjacents[0] * adjacents[1] : 0;
    }
  }

  return subtotal;
};

const getAdjacents = (line, position) => {
  const matches = [...line.matchAll(numberRegex)];
  return matches
    .map((match) => ({
      start: match["index"],
      end: match["index"] + match[0].length,
      value: Number.parseInt(match[0]),
    }))
    .filter((region) => position >= region.start - 1 && position <= region.end)
    .map((region) => region.value);
};
