// same solution works for both parts, just change input.txt -> input2.txt for part2.

import fs from "fs";

const [times, distances] = fs
  .readFileSync("input.txt", "utf-8")
  .split("\n")
  .map((line) =>
    line
      .replace(/\w+:\s+/i, "")
      .split(/\s+/)
      .map((s) => Number.parseInt(s))
  );

const results = [];

const calcDistance = (buttonHoldDuration, raceDuration) => {
  if (buttonHoldDuration >= raceDuration) {
    return 0;
  }
  return (raceDuration - buttonHoldDuration) * buttonHoldDuration;
};

for (let i = 0; i < times.length; i++) {
  const time = times[i];
  const record = distances[i];
  const optimalDuration = Math.floor(time / 2);

  let minDuration = optimalDuration;
  let maxDuration = optimalDuration;
  let minFound = false;
  let maxFound = false;

  while (true) {
    if (!minFound) {
      if (calcDistance(minDuration - 1, time) > record) {
        minDuration--;
      } else {
        minFound = true;
      }
    }

    if (!maxFound) {
      if (calcDistance(maxDuration + 1, time) > record) {
        maxDuration++;
      } else {
        maxFound = true;
      }
    }

    if (minFound && maxFound) {
      break;
    }
  }

  results.push(maxDuration - minDuration + 1);
}

console.log(results.reduce((a, b) => a * b, 1));
