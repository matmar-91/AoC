import fs from "fs";

export const figures = {
  HIGH_CARD: 0,
  ONE_PAIR: 1,
  TWO_PAIR: 2,
  THREE_OF_A_KIND: 3,
  FULL_HOUSE: 4,
  FOUR_OF_A_KIND: 5,
  FIVE_OF_A_KIND: 6,
};

export class Hand {
  cards;
  _figure = null;

  constructor(cards) {
    if (cards.length !== 5) {
      throw new Error("Hand must contain exactly 5 cards");
    }
    this.cards = cards.split("").map((card) => {
      switch (card) {
        case "T":
          card = 10;
          break;
        case "J":
          card = 11;
          break;
        case "Q":
          card = 12;
          break;
        case "K":
          card = 13;
          break;
        case "A":
          card = 14;
          break;
        default:
          break;
      }

      return Number.parseInt(card);
    });
  }

  get figure() {
    if (this._figure === null) {
      const counts = {};
      for (let card of this.cards) {
        counts[card] = counts[card] + 1 || 1;
      }
      const countsList = Object.values(counts).sort((a, b) => b - a);

      switch (countsList.length) {
        case 1:
          this._figure = figures.FIVE_OF_A_KIND;
          break;
        case 2:
          if (countsList[0] === 4) {
            this._figure = figures.FOUR_OF_A_KIND;
          } else {
            this._figure = figures.FULL_HOUSE;
          }
          break;
        case 3:
          if (countsList[0] === 3) {
            this._figure = figures.THREE_OF_A_KIND;
          } else {
            this._figure = figures.TWO_PAIR;
          }
          break;
        case 4:
          this._figure = figures.ONE_PAIR;
          break;
        case 5:
          this._figure = figures.HIGH_CARD;
          break;
      }
    }

    return this._figure;
  }

  compare(hand) {
    if (this.figure === hand.figure) {
      for (let i = 0; i < 5; i++) {
        if (this.cards[i] === hand.cards[i]) {
          continue;
        }

        return this.cards[i] - hand.cards[i];
      }

      return 0;
    }

    return this.figure - hand.figure;
  }
}

if (import.meta.url.endsWith(process.argv[1])) {
  const result = fs
    .readFileSync("input.txt", "utf-8")
    .split("\n")
    .map((line) => {
      const [cards, bid] = line.split(" ");
      return { hand: new Hand(cards), bid: Number.parseInt(bid) };
    })
    .sort((h1, h2) => h1.hand.compare(h2.hand))
    .map((hand, index) => hand.bid * (index + 1))
    .reduce((a, b) => a + b);

  console.log(result);
}
