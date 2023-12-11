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
    ["S".charCodeAt(0)]: [Path.UP, Path.DOWN, Path.LEFT, Path.RIGHT],
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
  steps = 0;

  constructor(currentPosition, nextMove, board) {
    this.currentPosition = currentPosition;
    this.nextMove = nextMove;
    this.board = board;
  }

  move() {
    if (this.nextMove === null) {
      return;
    }

    const newPosition = [
      this.currentPosition[0] + this.nextMove[0],
      this.currentPosition[1] + this.nextMove[1],
    ];
    const newField = board[newPosition[0]][newPosition[1]];

    if (this.isOutsideBoard(newPosition)) {
      this.nextMove = null;
      return;
    }

    if (!this.isValidMove(newField, this.nextMove)) {
      this.nextMove = null;
      return;
    }

    this.previousPosition = this.currentPosition;
    this.currentPosition = newPosition;
    this.steps++;
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
}

const getStepsToCollisionPoint = (paths) => {
  for (let i = 0; i < paths.length; i++) {
    for (let j = i + 1; j < paths.length; j++) {
      if (
        (paths[i].currentPosition[0] === paths[j].currentPosition[0] &&
          paths[i].currentPosition[1] === paths[j].currentPosition[1]) ||
        (paths[i].currentPosition[0] === paths[j].previousPosition[0] &&
          paths[i].currentPosition[1] === paths[j].previousPosition[1])
      ) {
        return paths[i].steps;
      }
    }
  }

  return -1;
};

const lines = fs.readFileSync("input.txt", "utf-8").split("\n");
const board = [];
let startingPosition;

for (let i = 0; i < lines.length; i++) {
  let start = lines[i].indexOf("S");
  if (start >= 0) {
    startingPosition = [i, start];
  }

  board.push(lines[i]);
}

let paths = [
  new Path([...startingPosition], Path.UP, board),
  new Path([...startingPosition], Path.DOWN, board),
  new Path([...startingPosition], Path.LEFT, board),
  new Path([...startingPosition], Path.RIGHT, board),
];

let result = -1;
while (result < 0) {
  let containsFinishedPaths = false;
  for (let i = 0; i < paths.length; i++) {
    paths[i].move();
    containsFinishedPaths = paths[i].nextMove === null || containsFinishedPaths;
  }
  if (containsFinishedPaths) {
    paths = paths.filter((path) => path.nextMove !== null);
  }

  result = getStepsToCollisionPoint(paths);
}

console.log(result);
