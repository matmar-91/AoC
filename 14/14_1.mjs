import fs from "fs";

let grid = fs
  .readFileSync("input.txt", "utf-8")
  .split("\n")
  .map((line) => line.split(""));
console.time("execution time");
grid = transform(grid);
console.log(countRocks(grid));
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
