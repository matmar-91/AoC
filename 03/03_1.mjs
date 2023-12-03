import { createInterface } from "readline";
import { createReadStream } from "fs";

const reader = createInterface({
  input: createReadStream("input.txt"),
});

const numberRegex = /\d+/g;
const symbolRegex = /[^\d\.\n]/;

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
  let [upper, current, lower] = lines;
  if (current === null) {
    return 0;
  }

  const matches = [...current.matchAll(numberRegex)];
  const regions = matches.map((match) => ({
    start: match["index"],
    end: match["index"] + match[0].length,
    value: Number.parseInt(match[0]),
  }));

  return regions
    .map((region) => {
      const isValid =
        isAdjacent(region, upper) ||
        isAdjacent(region, current) ||
        isAdjacent(region, lower);

      if (isValid) {
        return region.value;
      }

      return 0;
    })
    .reduce((a, b) => a + b, 0);
};

const isAdjacent = (region, line) => {
  if (line === null) {
    return false;
  }
  return symbolRegex.test(line.substring(region.start - 1, region.end + 1));
};
