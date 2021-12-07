#!/usr/bin/env node
import fs from "fs";
import process from "process";
import { getArgs, colorize } from "../shared/utils.js";

const argv = getArgs(process.argv.slice(2), "07");

const verbose = argv.v;
const file = argv.f;

// Main function to calculate and display part one
const partOne = (data) => {
  const maxH = Math.max(...data[0]);
  const totals = [];
  for (let h = 0; h < maxH; h++) {
    const costs = data[0].map((p) => Math.abs(p - h));
    totals.push(costs.reduce((t, c) => t + c, 0));
  }
  const min = Math.min(...totals);
  console.log(colorize(`Lowest cost: ${min}`));
  return min;
};

// Main function to calculate and display part two
const partTwo = (data) => {
  const maxH = Math.max(...data[0]);
  const totals = [];
  for (let h = 0; h < maxH; h++) {
    const costs = data[0].map((p) => {
      const n = Math.abs(p - h);
      return (n * n + n) / 2; // we have to use factorials this time
    });
    totals.push(costs.reduce((t, c) => t + c, 0));
  }
  const min = Math.min(...totals);
  console.log(colorize(`Lowest cost: ${min}`));
  return min;
};

// Read the input data
const processData = (data) =>
  data
    .trim()
    .split("\n")
    .map((n) => n.split(",").map((n) => parseInt(n)));

const main = () => {
  fs.readFile(file, "utf8", (err, data) => {
    if (err) return console.log(err);
    const cleaned = processData(data);
    if (verbose) console.log("---\nBeginning calcuation of part one:\n---");
    const res1 = partOne(cleaned, verbose);
    if (verbose) console.log("---\nBeginning calcuation of part two:\n---");
    const res2 = partTwo(cleaned, verbose);

    if (verbose) console.log("---\nResults:\n---");
    console.log("Part One:", res1);
    console.log("Part Two:", res2);
  });
};

if (!argv.h) main();
