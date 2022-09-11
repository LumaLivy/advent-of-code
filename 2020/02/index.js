#!/usr/bin/env node
import fs from "fs";
import process from "process";
import { getArgs, colorize } from "../../shared/utils.js";

const argv = getArgs(process.argv.slice(2), "2020", "02");

const verbose = argv.v;
const file = argv.f;

// Main function to calculate and display part one
const partOne = (data) => {
  const cleaned = processData(data);
  return cleaned.filter((l) => {
    const [[min, max], letter, pass] = l;
    const count = pass.split("").filter((c) => c === letter).length;
    return count >= min && count <= max;
  }).length;
};

// Main function to calculate and display part two
const partTwo = (data) => {
  const cleaned = processData(data);
  return cleaned.filter((l) => {
    const [[pos1, pos2], letter, pass] = l;
    const split = pass.split("");
    const c1 = split[pos1 - 1] === letter;
    const c2 = split[pos2 - 1] === letter;
    return c1 && c2 ? false : c1 || c2;
  }).length;
};

// Read the input data
const processData = (data) =>
  data
    .trim()
    .split("\n")
    .map((n) => {
      let [range, letter, pass] = n.split(" ");
      return [range.split("-").map((n) => +n), letter.substring(0, 1), pass];
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
