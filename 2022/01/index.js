#!/usr/bin/env node
import fs from "fs";
import process from "process";
import { getArgs } from "../../shared/utils.js";

const argv = getArgs(process.argv.slice(2), "2022", "01");

const verbose = argv.v;
const file = argv.f;

const sum = (arr) => arr.reduce((acc, cur) => acc + cur, 0);

// Main function to calculate and display part one
const partOne = (data) => {
  const cleaned = processData(data);
  const sums = cleaned.map((elf) => sum(elf));
  return Math.max(...sums);
};

// Main function to calculate and display part two
const partTwo = (data) => {
  const cleaned = processData(data);
  const sums = cleaned.map((elf) => sum(elf));
  const topThree = sums.sort((a, b) => a - b).slice(sums.length - 3);
  return sum(topThree);
};

// Read the input data
const processData = (data) => {
  const res = [[]];
  data
    .trim()
    .split("\n")
    .map((n) => {
      if (n) {
        res[res.length - 1].push(+n);
      } else {
        res.push([]);
      }
    });
  return res;
};

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
