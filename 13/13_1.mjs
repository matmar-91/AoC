import fs from "fs";

const input = fs.readFileSync("input2.txt", "utf8");
const patterns = input.split("\n\n").map((pattern) => pattern.split("\n"));

console.time("execution time");
const result = patterns
  .map((pattern) => {
    let sum = findReflection(pattern) * 100;
    sum += findReflection(transpose(pattern));
    return sum;
  })
  .reduce((a, b) => a + b);
console.timeEnd("execution time");
console.log(result);

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

function findReflection(pattern) {
  let isValid = true;
  let reflectionLine = 1;
  for (let i = reflectionLine; i < pattern.length; i++) {
    const distanceFromReflectionLine = i - reflectionLine;
    const backwardIndex = reflectionLine - distanceFromReflectionLine - 1;

    // reached the start, reflection is correct
    if (backwardIndex < 0) {
      break;
    }

    if (pattern[backwardIndex] !== pattern[i]) {
      i = reflectionLine;
      reflectionLine++;
    }

    // reflection line not found
    if (reflectionLine === pattern.length) {
      isValid = false;
    }
  }

  return isValid ? reflectionLine : 0;
}
