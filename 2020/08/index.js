#!/usr/bin/env node
import fs from "fs";
import process from "process";
import { getArgs, colorize } from "../../shared/utils.js";

const argv = getArgs(process.argv.slice(2), "2020", "08");

const verbose = argv.v;
const file = argv.f;

// Main function to calculate and display part one
const partOne = (data) => {
  const cleaned = processData(data);

  let acc = 0;
  let cursor = 0;
  let visited = [];

  const operate = (line) => {
    const [ins, num] = line;
    visited.push(cursor);

    switch (ins) {
      case "acc":
        acc += num;
        cursor++;
        break;
      case "jmp":
        cursor += num;
        break;
      case "nop":
        cursor++;
        break;
    }
  };

  let line = cleaned[cursor];
  while (!visited.includes(cursor)) {
    operate(line);
    line = cleaned[cursor];
  }
  return acc;
};

// Main function to calculate and display part two
const partTwo = (data) => {
  const cleaned = processData(data);

  const operate = (line) => {
    const [ins, num] = line;
    visited.push(cursor);

    switch (ins) {
      case "acc":
        acc += num;
        cursor++;
        break;
      case "jmp":
        cursor += num;
        break;
      case "nop":
        cursor++;
        break;
    }
  };

  let acc = 0;
  let cursor = 0;
  let visited = [];

  const insList = cleaned
    .map((l, li) => (l[0] !== "acc" ? li : null))
    .filter((i) => i !== null);

  let insSwapCounter = 0;

  const results = [];

  while (cursor !== cleaned.length) {
    const newCleaned = [...processData(data)];
    newCleaned[insList[insSwapCounter]][0] =
      newCleaned[insList[insSwapCounter]][0] === "jmp" ? "nop" : "jmp";
    acc = 0;
    cursor = 0;
    visited = [];
    let line = newCleaned[cursor];
    while (line && !visited.includes(cursor)) {
      operate(line);
      line = newCleaned[cursor];
    }
    insSwapCounter++;
    results.push([visited.length, cleaned.length]);
  }

  return acc;
};

// Read the input data
const processData = (data) =>
  data
    .trim()
    .split("\n")
    .map((n) => {
      const [ins, num] = n.split(" ");
      return [ins, +num];
    });

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
