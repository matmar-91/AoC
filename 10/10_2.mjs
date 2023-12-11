// initially had no idea how to identify if field is inside or outside the loop until found this:
// https://www.youtube.com/live/TEeoM0hE9yY?si=tZgLznlpYojKwSpo&t=3333
// https://en.wikipedia.org/wiki/Point_in_polygon

import fs from "fs";

class Path {
  static UP = [-1, 0];
  static DOWN = [1, 0];
  static LEFT = [0, -1];
  static RIGHT = [0, 1];

  static validMoves = {
    ["|".charCodeAt(0)]: [Path.UP, Path.DOWN],
    ["-".charCodeAt(0)]: [Path.LEFT, Path.RIGHT],
    ["L".charCodeAt(0)]: [Path.UP, Path.RIGHT],
    ["J".charCodeAt(0)]: [Path.UP, Path.LEFT],
    ["7".charCodeAt(0)]: [Path.DOWN, Path.LEFT],
    ["F".charCodeAt(0)]: [Path.DOWN, Path.RIGHT],
    [".".charCodeAt(0)]: [],
  };

  static reverse(move) {
    switch (move) {
      case Path.UP:
        return Path.DOWN;
      case Path.DOWN:
        return Path.UP;
      case Path.LEFT:
        return Path.RIGHT;
      case Path.RIGHT:
        return Path.LEFT;
      default:
        throw new Error("Invalid input");
    }
  }

  previousPosition;
  currentPosition;
  nextMove;
  board;
  points;
  possibleFirstTile;

  constructor(currentPosition, nextMove, board) {
    this.currentPosition = currentPosition;
    this.nextMove = nextMove;
    this.board = board;
    this.points = Array.from(new Array(board.length), () => new Set());
    this.points[currentPosition[0]].add(currentPosition[1]);

    switch (nextMove) {
      case Path.UP:
        this.possibleFirstTile = ["|", "L", "J"];
        break;
      case Path.DOWN:
        this.possibleFirstTile = ["|", "7", "F"];
        break;
      case Path.LEFT:
        this.possibleFirstTile = ["-", "J", "7"];
        break;
      case Path.RIGHT:
        this.possibleFirstTile = ["-", "L", "F"];
    }
  }

  move() {
    if (this.nextMove === null) {
      return;
    }

    const newPosition = [
      this.currentPosition[0] + this.nextMove[0],
      this.currentPosition[1] + this.nextMove[1],
    ];

    if (this.isOutsideBoard(newPosition)) {
      this.nextMove = null;
      return;
    }

    const newField = board[newPosition[0]][newPosition[1]];

    if (!this.isValidMove(newField, this.nextMove)) {
      this.nextMove = null;
      return;
    }

    this.previousPosition = this.currentPosition;
    this.currentPosition = newPosition;
    this.points[this.currentPosition[0]].add(this.currentPosition[1]);
    this.nextMove = this.determineNextMove(newField, this.nextMove);
  }

  determineNextMove(field, lastMove) {
    switch (field) {
      case "|":
      case "-":
        return lastMove;
      case "J":
        return lastMove === Path.DOWN ? Path.LEFT : Path.UP;
      case "L":
        return lastMove === Path.DOWN ? Path.RIGHT : Path.UP;
      case "7":
        return lastMove === Path.UP ? Path.LEFT : Path.DOWN;
      case "F":
        return lastMove === Path.UP ? Path.RIGHT : Path.DOWN;
      default:
        return null;
    }
  }

  isOutsideBoard(position) {
    return (
      position[0] < 0 ||
      position[0] >= board.length ||
      position[1] < 0 ||
      position[1] >= board[0].length
    );
  }

  isValidMove(field, lastMove) {
    return Path.validMoves[field.charCodeAt(0)].includes(
      Path.reverse(lastMove)
    );
  }

  merge(path) {
    for (let i = 0; i < board.length; i++) {
      this.points[i] = new Set([...this.points[i], ...path.points[i]]);
    }

    this.possibleFirstTile = this.possibleFirstTile.filter((field) =>
      path.possibleFirstTile.includes(field)
    );
    return this;
  }

  hasPoint(row, col) {
    return this.points[row]?.has(col) || false;
  }
}

const getCycle = (paths) => {
  for (let i = 0; i < paths.length; i++) {
    for (let j = i + 1; j < paths.length; j++) {
      if (
        (paths[i].currentPosition[0] === paths[j].currentPosition[0] &&
          paths[i].currentPosition[1] === paths[j].currentPosition[1]) ||
        (paths[i].currentPosition[0] === paths[j].previousPosition[0] &&
          paths[i].currentPosition[1] === paths[j].previousPosition[1])
      ) {
        return paths[i].merge(paths[j]);
      }
    }
  }

  return null;
};

console.time("parse input");
const lines = fs.readFileSync("input.txt", "utf-8").split("\n");
const board = [];
let startingPosition;

for (let i = 0; i < lines.length; i++) {
  let start = lines[i].indexOf("S");
  if (start >= 0) {
    startingPosition = [i, start];
  }

  board.push(lines[i].split(""));
}
console.timeEnd("parse input");

let paths = [
  new Path([...startingPosition], Path.UP, board),
  new Path([...startingPosition], Path.DOWN, board),
  new Path([...startingPosition], Path.LEFT, board),
  new Path([...startingPosition], Path.RIGHT, board),
];

console.time("find cycle");
let path = null;
while (path === null) {
  let containsFinishedPaths = false;
  for (let i = 0; i < paths.length; i++) {
    paths[i].move();
    containsFinishedPaths = paths[i].nextMove === null || containsFinishedPaths;
  }
  if (containsFinishedPaths) {
    paths = paths.filter((path) => path.nextMove !== null);
  }

  path = getCycle(paths);
}
console.timeEnd("find cycle");

// Replace starting symbol with actual symbol
board[startingPosition[0]][startingPosition[1]] = path.possibleFirstTile[0];

console.time("find area");
let fieldsCount = 0;
for (let i = 0; i < board.length; i++) {
  let pipeCount = 0;
  let row = "";
  for (let j = 0; j < board[0].length; j++) {
    if (path.hasPoint(i, j)) {
      if (!"7F-".includes(board[i][j])) {
        pipeCount++;
      }
      row += ".";
      continue;
    }
    if (pipeCount % 2 > 0) {
      row += "#";
      fieldsCount++;
      continue;
    }
    row += " ";
  }
  console.log(row);
}
console.timeEnd("find area");
console.log(fieldsCount);
