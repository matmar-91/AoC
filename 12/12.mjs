import { createInterface } from "readline";
import { createReadStream } from "fs";

const reader = createInterface({ input: createReadStream("input.txt") });
let part1 = 0;
let part2 = 0;
console.time("execution time");
reader.on("line", (line) => {
  part1 += new Record(line).getCombinationsCount();
  part2 += new Record(line, 5).getCombinationsCount();
});

reader.on("close", () => {
  console.timeEnd("execution time");
  console.log("Part 1: ", part1);
  console.log("Part 2: ", part2);
});

class Record {
  static cache = new Map();
  record = "";
  groups = [];

  constructor(line, multiplier = 1) {
    const [record, groups] = line.split(" ");
    let parsedGroups = groups.split(",").map((value) => Number.parseInt(value));
    let records = [];

    for (let i = 0; i < multiplier; i++) {
      records.push(record);
      this.groups = this.groups.concat(parsedGroups);
    }

    this.record = records.join("?");
  }

  getCombinationsCount(record = this.record, groups = this.groups) {
    let total = 0;
    let longestGroup = Math.max(...groups);
    const currentGroupIndex = groups.indexOf(longestGroup);
    const groupsToTheLeft = groups.slice(0, currentGroupIndex);
    const groupsToTheRight = groups.slice(currentGroupIndex + 1);
    const cacheKey =
      groupsToTheLeft.join(",") +
      "_" +
      record +
      "|" +
      groups.join(",") +
      "_" +
      groupsToTheRight.join(",");

    if (Record.cache.has(cacheKey)) {
      return Record.cache.get(cacheKey);
    }

    for (let i = 0; i <= record.length - longestGroup; i++) {
      // group doesn't fit
      if (record.substring(i, i + longestGroup).includes(".")) {
        continue;
      }

      // touch another group left
      if (record[i - 1] === "#") {
        continue;
      }

      // touch another group right
      if (record[i + longestGroup] === "#") {
        continue;
      }

      // orphaned group left
      if (
        record.substring(0, i).includes("#") &&
        groupsToTheLeft.length === 0
      ) {
        continue;
      }

      // orphaned group right
      if (
        record.substring(i + longestGroup).includes("#") &&
        groupsToTheRight.length === 0
      ) {
        continue;
      }

      if (groups.length === 1) {
        // last level count permutation
        total++;
      } else {
        // not last level, count subtrees
        let left = 1;
        let right = 1;

        // process left subtree
        if (groupsToTheLeft.length > 0) {
          left = this.getCombinationsCount(
            record.substring(0, i - 1),
            groupsToTheLeft
          );
          // not valid subtree
          if (left === 0) {
            continue;
          }
        }
        // process right subtree
        if (groupsToTheRight.length > 0) {
          right = this.getCombinationsCount(
            record.substring(i + longestGroup + 1),
            groupsToTheRight
          );
          // not valid subtree
          if (right === 0) {
            continue;
          }
        }

        // calculate permutations from subtrees
        total += left * right;
      }
    }

    Record.cache.set(cacheKey, total);
    return total;
  }
}
