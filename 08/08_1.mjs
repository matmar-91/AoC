import fs from "fs";

class Node {
  constructor(label, left = null, right = null) {
    this.label = label;
    this.left = left;
    this.right = right;
  }
}

const getOrCreateNode = (label, nodes) => {
  let node = nodes.get(label);
  if (!node) {
    node = new Node(label);
    nodes.set(label, node);
  }

  return node;
};

const navigate = (currentNode, moves) => {
  let step = 0;
  while (step < moves.length) {
    if (currentNode.label === "ZZZ") {
      break;
    }
    currentNode = moves[step] === "L" ? currentNode.left : currentNode.right;
    step++;
  }

  return currentNode.label === "ZZZ"
    ? step
    : step + navigate(currentNode, moves);
};

const lines = fs.readFileSync("input.txt", "utf-8").split("\n");
const moves = lines.shift();
lines.shift();

const nodes = new Map();
lines.forEach((line) => {
  const currentNodes = line
    .match(/\w+/gi)
    .map((label) => getOrCreateNode(label, nodes));

  currentNodes[0].left = currentNodes[1];
  currentNodes[0].right = currentNodes[2];
});

const currentNode = nodes.get("AAA");
console.log(navigate(currentNode, moves));
