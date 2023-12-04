import { createInterface } from "readline";
import { createReadStream } from "fs";

const reader = createInterface({
  input: createReadStream("input.txt"),
});

const whitespaceRegex = /\s+/;
const cards = {};
let sum = 0;

reader.on("line", (line) => {
  const [card, table] = line.split(":");
  const currentCardIndex = Number.parseInt(card.split(whitespaceRegex)[1]);
  const [myNumbers, winningNumbers] = table
    .split("|")
    .map((str) => str.trim().split(whitespaceRegex));

  addCards(currentCardIndex, 1);
  let indexOfCardToCopy = currentCardIndex;
  myNumbers.forEach((number) => {
    if (winningNumbers.includes(number)) {
      addCards(++indexOfCardToCopy, cards[currentCardIndex]);
    }
  });

  sum += cards[currentCardIndex];
  delete cards[currentCardIndex];
});

reader.on("close", () => console.log(sum));

const addCards = (index, count) => (cards[index] = cards[index] + count || count);
