import fs from "fs";

const cache = new Map();
let cacheKey;
let cycle = 0;

let grid = fs
  .readFileSync("input.txt", "utf-8")
  .split("\n")
  .map((line) => line.split(""));

console.time("execution time");
while (true) {
  for (let i = 0; i < 4; i++) {
    grid = transform(grid);
    grid = transpose(grid);
  }

  cacheKey = getGridAsString(grid);
  if (cache.has(cacheKey)) {
    break;
  }
  cache.set(cacheKey, JSON.parse(JSON.stringify(grid)));
  cycle++;
}

const cachedPatterns = [...cache.keys()];
const firstPatternOccurence = cachedPatterns.indexOf(cacheKey);
const cycleLength = cycle - firstPatternOccurence - 1;
const indexInCycle = cycleLength - ((1000000000 - firstPatternOccurence) % cycleLength);
const resultIndex = indexInCycle + firstPatternOccurence - 1;
console.log(countRocks(cache.get(cachedPatterns[resultIndex])));
console.timeEnd("execution time");

function transform(grid) {
  const positionInColumn = new Array(grid[0].length).fill(0);
  grid.forEach((line, row) => {
    line.forEach((char, column) => {
      if (char === "O") {
        grid[row][column] = "."; // move rock away from current position
        grid[positionInColumn[column]][column] = "O"; // move rock to new position
        positionInColumn[column]++;
      } else if (char === "#") {
        positionInColumn[column] = row + 1;
      }
    });
  });
  return grid;
}

function countRocks(grid) {
  return grid
    .map((line, index) => {
      let multiplier = grid.length - index;
      let rocks = line
        .filter((char) => char === "O")
        .reduce((a, b) => a + 1, 0);
      return rocks * multiplier;
    })
    .reduce((a, b) => a + b);
}

function transpose(grid) {
  const result = Array.from(new Array(grid[0].length), () => new Array());
  for (let row = 0; row < grid.length; row++) {
    for (let column = 0; column < grid[0].length; column++) {
      result[column].unshift(grid[row][column]);
    }
  }
  return result;
}

function getGridAsString(grid) {
  return grid.map((line) => line.join("")).join("\n");
}
