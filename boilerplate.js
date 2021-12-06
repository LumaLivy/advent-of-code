#!/usr/bin/env node
import fs from "fs";
import process from "process";
import { getArgs, colorize } from "../shared/utils.js";

const argv = getArgs(process.argv.slice(2), "00");

const verbose = argv.v;
const file = argv.f;

// Main function to calculate and display part one
const partOne = (data) => {
  console.log("Todo");
};

// Main function to calculate and display part two
const partTwo = (data) => {
  console.log("Todo");
};

// Read the input data
const processData = (data) =>
  data
    .trim()
    .split("\n")
    .map((n) => {});

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
