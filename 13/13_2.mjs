import fs from "fs";

// A little messy code but requirements for part 2 wasn't clear to me.
// I struggled mostly with understanding what should be actually done here
// Probably could be refactored, but at least it's working...

const input = fs.readFileSync("input.txt", "utf8");
const patterns = input.split("\n\n").map((pattern) => pattern.split("\n"));

console.time("execution time");
let vertical = patterns.map((pattern) => findReflection(transpose(pattern)));
let horizontal = patterns.map((pattern) => findReflection(pattern));
let smudgedVertical = patterns.map((pattern, i) =>
  findReflection(transpose(pattern), vertical[i], true)
);
let smudgedHorizontal = patterns.map((pattern, i) =>
  findReflection(pattern, horizontal[i], true)
);

let part1 = 0;
let part2 = 0;
for (let i = 0; i < patterns.length; i++) {
  if (vertical[i] !== 0) {
    part1 += vertical[i];
  } else {
    part1 += horizontal[i] * 100;
  }

  if (smudgedVertical[i] !== 0 && smudgedVertical[i] !== vertical[i]) {
    part2 += smudgedVertical[i];
  } else {
    part2 += smudgedHorizontal[i] * 100;
  }
}

console.log("Part 1:", part1);
console.log("Part 2:", part2);

console.timeEnd("execution time");

function transpose(arr) {
  const result = [];
  for (let column = 0; column < arr[0].length; column++) {
    let transposedColumn = "";
    for (let row = 0; row < arr.length; row++) {
      transposedColumn += arr[row][column];
    }
    result.push(transposedColumn);
  }
  return result;
}

function findReflection(pattern, original = 0, enableSmudgeLogic = false) {
  let smudge = false;
  let isValid = true;
  let reflectionLine = 1;
  for (let i = reflectionLine; i < pattern.length; i++) {
    const distanceFromReflectionLine = i - reflectionLine;
    const backwardIndex = reflectionLine - distanceFromReflectionLine - 1;

    // skip original refelction point
    if (reflectionLine === i && reflectionLine === original) {
      i = reflectionLine;
      reflectionLine++;
      continue;
    }

    // reached the start, reflection is correct
    if (backwardIndex < 0) {
      break;
    }

    if (pattern[backwardIndex] !== pattern[i]) {
      if (enableSmudgeLogic) {
        if (getDiffCount(pattern[backwardIndex], pattern[i]) <= 1) {
          if (!smudge) {
            smudge = true;
            continue;
          }
        }
        smudge = false;
        i = reflectionLine;
        reflectionLine++;
      } else {
        i = reflectionLine;
        reflectionLine++;
      }
    }
  }

  // reflection line not found
  if (reflectionLine === pattern.length) {
    isValid = false;
  }
  return isValid ? reflectionLine : original;
}

function getDiffCount(upper, lower) {
  let diffs = 0;
  for (let i = 0; i < upper.length; i++) {
    if (upper.charAt(i) !== lower.charAt(i)) {
      diffs++;
    }
  }

  return diffs;
}
