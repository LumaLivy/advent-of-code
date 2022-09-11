#!/usr/bin/env node
import fs from "fs";
import process from "process";
import { getArgs, colorize } from "../../shared/utils.js";

const argv = getArgs(process.argv.slice(2), "2020", "01");

const verbose = argv.v;
const file = argv.f;

// Main function to calculate and display part one
const partOne = (data) => {
  const cleaned = processData(data);
  let res;
  cleaned.forEach((x, xi) =>
    cleaned.forEach((y, yi) => {
      if (xi === yi || res) return;
      if (x + y === 2020) {
        res = x * y;
      }
    })
  );
  return res;
};

// Main function to calculate and display part two
const partTwo = (data) => {
  const cleaned = processData(data);
  let res;
  cleaned.forEach((x, xi) =>
    cleaned.forEach((y, yi) => {
      cleaned.forEach((z, zi) => {
        if (xi === yi || xi === zi || yi === zi || res) return;
        if (x + y + z === 2020) {
          res = x * y * z;
        }
      });
    })
  );
  return res;
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
