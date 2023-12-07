import assert from "node:assert";
import test from "node:test";
import { Hand, figures } from "./07_2.mjs";

test("basic identification", async (t) => {
  await t.test("high card", () => {
    const highCardHand = new Hand("AKQ9T");
    assert.strictEqual(highCardHand.figure, figures.HIGH_CARD);
  });

  await t.test("one pair", () => {
    const onePairHand = new Hand("AKQAT");
    assert.strictEqual(onePairHand.figure, figures.ONE_PAIR);
  });

  await t.test("two pair", () => {
    const twoPairHand = new Hand("23432");
    assert.strictEqual(twoPairHand.figure, figures.TWO_PAIR);
  });

  await t.test("three of a kind", () => {
    const threeOfAKindHand = new Hand("23242");
    assert.strictEqual(threeOfAKindHand.figure, figures.THREE_OF_A_KIND);
  });

  await t.test("full house", () => {
    const fullHouseHand = new Hand("23232");
    assert.strictEqual(fullHouseHand.figure, figures.FULL_HOUSE);
  });

  await t.test("four of a kind", () => {
    const fourOfAKindHand = new Hand("23222");
    assert.strictEqual(fourOfAKindHand.figure, figures.FOUR_OF_A_KIND);
  });

  await t.test("five of a kind", () => {
    const fiveOfAKindHand = new Hand("55555");
    assert.strictEqual(fiveOfAKindHand.figure, figures.FIVE_OF_A_KIND);
  });
});

test("comparison", async (t) => {
  await t.test("compare two hands with same figure", () => {
    const h1 = new Hand("34342");
    const h2 = new Hand("34545");

    assert.strictEqual(h1.compare(h2) < 0, true);
    assert.strictEqual(h2.compare(h1) > 0, true);
  });

  await t.test("compare two hands with different figures", () => {
    const h1 = new Hand("33444");
    const h2 = new Hand("33334");

    assert.strictEqual(h1.compare(h2) < 0, true);
    assert.strictEqual(h2.compare(h1) > 0, true);
  });

  await t.test("compare same hands", () => {
    const h1 = new Hand("55555");
    const h2 = new Hand("55555");

    assert.strictEqual(h1.compare(h2) === 0, true);
  });

  await t.test("joker is lower than other cards", () => {
    const h1 = new Hand("J2345");
    const h2 = new Hand("22334");

    assert.strictEqual(h1.compare(h2) < 0, true);
  });
});

test("substitution", async (t) => {
  await t.test("one pair", () => {
    const hand = new Hand("2345J");
    assert.strictEqual(hand.figure, figures.ONE_PAIR);
  });

  await t.test("only jokers", () => {
    const hand = new Hand("JJJJJ");
    assert.strictEqual(hand.figure, figures.FIVE_OF_A_KIND);
  });

  await t.test("three of a kind", () => {
    const hand = new Hand("234JJ");
    assert.strictEqual(hand.figure, figures.THREE_OF_A_KIND);
  });

  await t.test("full house", () => {
    const hand = new Hand("2233J");
    assert.strictEqual(hand.figure, figures.FULL_HOUSE);
  });

  await t.test("four of a kind", () => {
    const hand = new Hand("23JJJ");
    assert.strictEqual(hand.figure, figures.FOUR_OF_A_KIND);
  });

  await t.test("five of a kind", () => {
    const hand = new Hand("2JJJJ");
    assert.strictEqual(hand.figure, figures.FIVE_OF_A_KIND);
  });
});
