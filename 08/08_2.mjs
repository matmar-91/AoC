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

const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
const lcm = (a, b) => (a * b) / gcd(a, b);

const addNodes = (line, nodes) => {
  const currentNodes = line
    .match(/\w+/gi)
    .map((label) => getOrCreateNode(label, nodes));

  currentNodes[0].left = currentNodes[1];
  currentNodes[0].right = currentNodes[2];
};

const lines = fs.readFileSync("input.txt", "utf-8").split("\n");
const moves = lines.shift();
lines.shift();

const nodes = new Map();
lines.forEach((line) => addNodes(line, nodes));
let stepsCount = [...nodes.values()]
  .filter((node) => node.label.endsWith("A"))
  .map((node) => {
    let steps = 0;
    while (!node.label.endsWith("Z")) {
      node = moves[steps % moves.length] === "L" ? node.left : node.right;
      steps++;
    }
    return steps;
  });

console.log(stepsCount.reduce((a, b) => lcm(a, b)));
