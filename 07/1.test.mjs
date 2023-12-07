import assert from "node:assert";
import test from "node:test";
import { Hand, figures } from "./07_1.mjs";

test("high card identification", () => {
  const highCardHand = new Hand("AKQJT");
  assert.strictEqual(highCardHand.figure, figures.HIGH_CARD);
});

test("one pair identification", () => {
  const onePairHand = new Hand("AKQAT");
  assert.strictEqual(onePairHand.figure, figures.ONE_PAIR);
});

test("two pair identification", () => {
  const twoPairHand = new Hand("23432");
  assert.strictEqual(twoPairHand.figure, figures.TWO_PAIR);
});

test("three of a kind identifiaction", () => {
  const threeOfAKindHand = new Hand("23242");
  assert.strictEqual(threeOfAKindHand.figure, figures.THREE_OF_A_KIND);
});

test("full house identification", () => {
  const fullHouseHand = new Hand("23232");
  assert.strictEqual(fullHouseHand.figure, figures.FULL_HOUSE);
});

test("four of a kind", () => {
  const fourOfAKindHand = new Hand("23222");
  assert.strictEqual(fourOfAKindHand.figure, figures.FOUR_OF_A_KIND);
});

test("five of a kind identification", () => {
  const fiveOfAKindHand = new Hand("55555");
  assert.strictEqual(fiveOfAKindHand.figure, figures.FIVE_OF_A_KIND);
});

test("compare two hands with same figure", () => {
  const h1 = new Hand("34342");
  const h2 = new Hand("34545");

  assert.strictEqual(h1.compare(h2) < 0, true);
  assert.strictEqual(h2.compare(h1) > 0, true);
});

test("compare two hands with different figures", () => {
  const h1 = new Hand("33444");
  const h2 = new Hand("33334");

  assert.strictEqual(h1.compare(h2) < 0, true);
  assert.strictEqual(h2.compare(h1) > 0, true);
});

test("compare same hands", () => {
  const h1 = new Hand("55555");
  const h2 = new Hand("55555");

  assert.strictEqual(h1.compare(h2) === 0, true);
})
