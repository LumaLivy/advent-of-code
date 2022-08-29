#!/usr/bin/env node
import fs from "fs";
import process from "process";
import { getArgs, colorize, pluralize } from "../../shared/utils.js";

const argv = getArgs(process.argv.slice(2), "2021", "01");

const verbose = argv.v;
const file = argv.f;

// Reducer to check if an array value increased compared to the previous
const countIncreases = (ints = [], verbose = false) =>
  ints.reduce((count, current, index) => {
    if (index == 0) return count;
    const previous = ints[index - 1];
    if (current > previous) {
      ++count;
    }
    if (verbose) {
      const formatted = colorize(
        `${current} -> ${previous} : ${
          current > previous
            ? "increased"
            : current === previous
            ? "no change"
            : "decreased"
        }`
      );
      console.log(formatted);
    }
    return count;
  }, 0);

// Reducer that returns an array of sums in an (n) sized window from the original.
const sumWindow = (ints = [], size = 3, verbose = false) =>
  ints.reduce((sums, current, index) => {
    if (index + size > ints.length) return sums;

    const sum = ints
      .slice(index, index + size)
      .reduce((prev, cur) => prev + cur, 0);

    if (verbose) {
      const values = ints.slice(index, index + size).join(", ");
      const formatted = colorize(`Window: [ ${values} ] | Sum: ${sum}`);
      console.log(formatted);
    }
    return [...sums, sum];
  }, []);

// Main function to calculate and display part one
const partOne = (depths, verbose, logResult = false) => {
  const result = countIncreases(depths, verbose);
  if (logResult) {
    const times = pluralize("time", result);
    const log = `The depth increased ${result} ${times}.`;
    console.log(colorize(log));
  }
  return result;
};

// Main function to calculate and display part two
const partTwo = (depths, windowSize, verbose, logResult = false) => {
  const result = partOne(sumWindow(depths, windowSize, verbose), verbose);
  if (logResult) {
    const times = pluralize("time", result);
    const log = `The sliding sum increased ${result} ${times}.`;
    console.log(colorize(log));
  }
  return result;
};

// Read the input data
const processData = (data) =>
  data
    .trim()
    .split("\n")
    .map((n) => parseInt(n));

const main = () => {
  fs.readFile(file, "utf8", (err, data) => {
    if (err) return console.log(err);
    const depths = processData(data);
    if (verbose) console.log("---\nBeginning calcuation of part one:\n---");
    const res1 = partOne(depths, verbose);
    if (verbose) console.log("---\nBeginning calcuation of part two:\n---");
    const res2 = partTwo(depths, 3, verbose);

    if (verbose) console.log("---\nResults:\n---");
    console.log("Part One:", res1);
    console.log("Part Two:", res2);
  });
};

if (!argv.h) main();
