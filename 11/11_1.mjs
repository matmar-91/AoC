import fs from "fs";

// part2 can be used to solve part1 also

const expand = (universe) => {
  for (let row = 0; row < universe.length; row++) {
    if (!universe[row].includes("#")) {
      universe.splice(row, 0, [...universe[row]]);
      // skip newly added row
      row++;
    }
  }

  for (let column = 0; column < universe[0].length; column++) {
    let isEmpty = true;
    for (let row = 0; row < universe.length; row++) {
      if (universe[row][column] === "#") {
        isEmpty = false;
        break;
      }
    }

    if (isEmpty) {
      for (let row = 0; row < universe.length; row++) {
        universe[row].splice(column, 0, ".");
      }
      // skip newly added column
      column++;
    }
  }
};

const universe = fs
  .readFileSync("input.txt", "utf8")
  .split("\n")
  .map((line) => line.split(""));

expand(universe);
const galaxies = [];
// universe.forEach((row) => console.log(row.join(" ")));
for (let row = 0; row < universe.length; row++) {
  for (let column = 0; column < universe[0].length; column++) {
    if (universe[row][column] === "#") {
      galaxies.push([row, column]);
    }
  }
}

let sum = 0;
while (galaxies.length > 0) {
  const currentGalaxy = galaxies.shift();
  galaxies.forEach((galaxy) => {
    sum += Math.abs(galaxy[0] - currentGalaxy[0]);
    sum += Math.abs(galaxy[1] - currentGalaxy[1]);
  });
}

console.log(sum);
