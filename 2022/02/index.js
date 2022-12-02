#!/usr/bin/env node
import fs from "fs";
import process from "process";
import { getArgs } from "../../shared/utils.js";

const argv = getArgs(process.argv.slice(2), "2022", "02");

const verbose = argv.v;
const file = argv.f;

const sum = (arr) => arr.reduce((a, c) => a + c, 0);

// Main function to calculate and display part one
const partOne = (data) => {
  const rockPaperScissorsScore = (opponent, player) => {
    const shapeScores = { X: 1, Y: 2, Z: 3 }; // rock, paper, scissors
    const conditionScores = {
      X: { A: 3, B: 0, C: 6 }, // 0 = loss, 3 = draw, 6 = win
      Y: { A: 6, B: 3, C: 0 },
      Z: { A: 0, B: 6, C: 3 },
    };

    return shapeScores[player] + conditionScores[player][opponent];
  };

  const cleaned = processData(data);
  return sum(cleaned.map((game) => rockPaperScissorsScore(...game)));
};

// Main function to calculate and display part two
const partTwo = (data) => {
  const rockPaperScissorsScore = (opponent, condition) => {
    const shapeScores = { X: 1, Y: 2, Z: 3 }; // rock, paper, scissors
    const conditionScores = { X: 0, Y: 3, Z: 6 }; // loss, draw, win

    const playerChoice = {
      A: ["Z", "X", "Y"], // loss, draw, win
      B: ["X", "Y", "Z"],
      C: ["Y", "Z", "X"],
    };

    const strategies = {
      X: playerChoice[opponent][0], // loss
      Y: playerChoice[opponent][1], // draw
      Z: playerChoice[opponent][2], // win
    };

    return conditionScores[condition] + shapeScores[strategies[condition]];
  };

  const cleaned = processData(data);
  return sum(cleaned.map((game) => rockPaperScissorsScore(...game)));
};

// Read the input data
const processData = (data) =>
  data
    .trim()
    .split("\n")
    .map((n) => n.split(" "));

const main = () => {
  fs.readFile(file, "utf8", (err, data) => {
    if (err) return console.log(err);
    if (verbose) console.log("---\nBeginning calcuation of part one:\n---");
    const res1 = partOne(data);
    if (verbose) console.log("---\nBeginning calcuation of part two:\n---");
    const res2 = partTwo(data);

    if (verbose) console.log("---\nResults:\n---");
    console.log("Part One:", res1);
    console.log("Part Two:", res2);
  });
};

if (!argv.h) main();
