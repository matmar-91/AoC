import * as readline from "node:readline";
import * as fs from "node:fs";

const reader = readline.createInterface({
  input: fs.createReadStream("input.txt"),
});

let sum = 0;

reader.on("line", (line) => {
  line = replaceWordsToDigits(line);
  sumCalibrationValues(line);
});

reader.on("close", () => {
  console.log(sum);
});

const replaceWordsToDigits = (line) => {
  const regex = /(?=(one|two|three|four|five|six|seven|eight|nine))/g;
  return line.replaceAll(regex, (_match, p1) => {
    switch (p1) {
      case "one":
        return "1";
      case "two":
        return "2";
      case "three":
        return "3";
      case "four":
        return "4";
      case "five":
        return "5";
      case "six":
        return "6";
      case "seven":
        return "7";
      case "eight":
        return "8";
      case "nine":
        return "9";
    }
  });
};

const sumCalibrationValues = (line) => {
  const digits = line.match(/\d/g);

  if (digits === null) {
    return;
  }

  const calibrationValue = digits[0] + digits[digits.length - 1];
  sum += Number.parseInt(calibrationValue);
};
