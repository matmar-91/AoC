import fs from "fs";

// more generic so can be used to solve both part1 and part2

const universe = fs
  .readFileSync("input.txt", "utf8")
  .split("\n")
  .map((line) => line.split(""));

const emptyRows = getEmptyRows(universe);
const emptyColumns = getEmptyColumns(universe);
const galaxies = getGalaxies(universe);

console.log("Part1: ", solve(galaxies, emptyRows, emptyColumns, 2));
console.log("Part2: ", solve(galaxies, emptyRows, emptyColumns, 1000000));

function getEmptyRows(universe) {
  return universe.reduce((acc, line, index) => {
    if (!line.includes("#")) {
      acc.push(index);
    }
    return acc;
  }, []);
}

function getEmptyColumns(universe) {
  const result = [];
  for (let column = 0; column < universe[0].length; column++) {
    let isEmpty = true;
    for (let row = 0; row < universe.length; row++) {
      if (universe[row][column] === "#") {
        isEmpty = false;
        break;
      }
    }

    if (isEmpty) {
      result.push(column);
    }
  }
  return result;
}

function getGalaxies(universe) {
  const result = [];
  for (let row = 0; row < universe.length; row++) {
    for (let column = 0; column < universe[0].length; column++) {
      if (universe[row][column] === "#") {
        result.push([row, column]);
      }
    }
  }
  return result;
}

function getDistance(p1, p2, potenialCrossings, multiplier) {
  const distance = Math.abs(p1 - p2);
  const crossings = potenialCrossings.filter(
    (line) => line > Math.min(p1, p2) && line < Math.max(p1, p2)
  ).length;
  const expanded = crossings > 0 ? crossings * multiplier - crossings : 0;
  return distance + expanded;
}

function solve([...galaxies], emptyRows, emptyColumns, multiplier) {
  let sum = 0;
  while (galaxies.length > 0) {
    const currentGalaxy = galaxies.shift();
    galaxies.forEach((galaxy) => {
      const horizontal = getDistance(currentGalaxy[0], galaxy[0], emptyRows, multiplier);
      const vertical = getDistance(currentGalaxy[1], galaxy[1], emptyColumns, multiplier);
      sum += horizontal + vertical;
    });
  }

  return sum;
}
