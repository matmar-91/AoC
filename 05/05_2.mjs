import { createInterface } from "readline";
import { createReadStream } from "fs";

class Range {
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }

  get length() {
    return this.end - this.start + 1;
  }

  static ofLength(start, length) {
    return new Range(start, start + length - 1);
  }
}

const reader = createInterface({
  input: createReadStream("input.txt"),
});

let state, mappingList = [];

reader.once("line", (line) => {
  state = calculateSeedRanges(line);
  reader.on("line", (line) => {
    if (line.length === 0) {
      return;
    }
    if (line.endsWith("map:")) {
      state = mapRegions(state, mappingList);
      mappingList = [];
      return;
    }
    let [destinationStart, sourceStart, length] = toIntArray(line);
    mappingList.push({
      source: Range.ofLength(sourceStart, length),
      destination: Range.ofLength(destinationStart, length),
    });
  });
});

reader.on("close", () => {
  state = mapRegions(state, mappingList);
  console.log(state.reduce((a, b) => a.start < b.start ? a : b).start)
});

const mapRegions = (state, mappingList) => {
  if (mappingList.length === 0) {
    return state;
  }

  const toProcess = [...state];
  const result = [];
  
  let region;
  while ((region = toProcess.shift()) !== undefined) {
    let isMapped = false;
    for (let mappingRegion of mappingList) {
      // if ranges overlap
      if (
        region.start <= mappingRegion.source.end &&
        region.end >= mappingRegion.source.start
      ) {
        // if start doesn't fit
        if (region.start < mappingRegion.source.start) {
          toProcess.push(new Range(region.start, mappingRegion.source.start - 1));
          region = new Range(mappingRegion.source.start, region.end);
        }
        // if end doesn't fit
        if (region.end > mappingRegion.source.end) {
          toProcess.push(new Range(mappingRegion.source.end + 1, region.end));
          region = new Range(region.start, mappingRegion.source.end);
        }
        result.push(mapSingleRegion(region, mappingRegion));
        isMapped = true;
        break;
      }
    }
    if (!isMapped) {
      // mapping not found, push unchanged region to result
      result.push(region);
    }
  }

  return result;
};

const toIntArray = (line) =>
  line.split(" ").map((value) => Number.parseInt(value));

const calculateSeedRanges = (line) => {
  const input = toIntArray(line.replace("seeds: ", ""));
  const seedRanges = [];

  for (let i = 0; i < input.length; i += 2) {
    let start = input[i];
    let length = input[i + 1];
    seedRanges.push(Range.ofLength(start, length));
  }

  return seedRanges;
};

const mapSingleRegion = (regionToMap, mappingRegion) => {
  const shift = mappingRegion.destination.start - mappingRegion.source.start;
  return new Range(regionToMap.start + shift, regionToMap.end + shift);
};
