#!/usr/bin/env node
import fs from "fs";
import process from "process";
import { getArgs } from "../../shared/utils.js";

const argv = getArgs(process.argv.slice(2), "2019", "01");

const verbose = argv.v;
const file = argv.f;

const sum = (a) => a.reduce((acc, cur) => acc + cur, 0);

const calculateFuel = (m) => Math.floor(+m / 3) - 2;

// Main function to calculate and display part one
const partOne = (data) => {
  const cleaned = processData(data);
  return sum(cleaned.map((n) => calculateFuel(n)));
};

// Main function to calculate and display part two
const partTwo = (data) => {
  const cleaned = processData(data);
  const total = cleaned.map((m) => {
    let r = m;
    let acc = [];
    while (calculateFuel(r) > 0) {
      r = calculateFuel(r);
      acc.push(r);
    }
    return sum(acc);
  });
  return sum(total);
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
