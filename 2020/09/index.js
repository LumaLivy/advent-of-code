#!/usr/bin/env node
import fs from "fs";
import process from "process";
import { getArgs, colorize } from "../../shared/utils.js";

const argv = getArgs(process.argv.slice(2), "2020", "09");

const verbose = argv.v;
const file = argv.f;

// Main function to calculate and display part one
const partOne = (data) => {
  const cleaned = processData(data);
  let cursor = 25;
  while (cursor < cleaned.length) {
    let op = cleaned.slice(cursor - 25, cursor);
    if (!op.some((a) => op.some((b) => a !== b && a + b === cleaned[cursor])))
      break;
    cursor++;
  }
  return cursor > cleaned.length - 1 ? null : cleaned[cursor];
};

// Main function to calculate and display part two
const partTwo = (data) => {
  const cleaned = processData(data);
  const target = partOne(data);

  let res = [];

  let windowSize = 2;
  let cursor = 0;

  const targetIndex = cleaned.indexOf(target);

  let sum = 0;

  while (sum !== target) {
    if (
      cursor + windowSize > cleaned.length - 1 ||
      cursor + windowSize >= targetIndex
    ) {
      cursor = 0;
      windowSize++;
    }
    res = cleaned.slice(cursor, cursor + windowSize);
    sum = res.reduce((a, c) => a + c, 0);

    cursor++;
  }
  res.sort((a, b) => a - b);
  return res[0] + res[res.length - 1];
};

// Read the input data
const processData = (data) =>
  data
    .trim()
    .split("\n")
    .map((n) => +n);

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
