import { createInterface } from "readline";
import { createReadStream } from "fs";

class Range {
  constructor(start, length) {
    this.start = start;
    this.end = start + length - 1;
  }
}

const reader = createInterface({
  input: createReadStream("input.txt"),
});

let state,
  mappingList = [];

reader.once("line", (line) => {
  state = toIntArray(line.replace("seeds: ", ""))
  reader.on("line", (line) => {
    if (line.length === 0) {
      return;
    }
    if (line.endsWith("map:")) {
      state = doMapping(state, mappingList);
      mappingList = [];
      return;
    }
    let [destinationStart, sourceStart, length] = toIntArray(line);
    mappingList.push({
      source: new Range(sourceStart, length),
      destination: new Range(destinationStart, length),
    });
  });
});

reader.on("close", () => {
  state = doMapping(state, mappingList);
  console.log(Math.min(...state));
});

const doMapping = (state, mappingList) => {
  if (mappingList.length === 0) {
    return state;
  }

  return state.map((value) => {
    // brute-force, probably could be optimized
    for (let mapping of mappingList) {
      if (value >= mapping.source.start && value <= mapping.source.end) {
        const distance = value - mapping.source.start;
        return mapping.destination.start + distance;
      }
    }

    return value;
  });
};

const toIntArray = (line) =>
  line.split(" ").map((value) => Number.parseInt(value));
