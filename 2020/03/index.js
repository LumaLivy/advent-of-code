#!/usr/bin/env node
import chalk from "chalk";
import fs from "fs";
import process from "process";
import { getArgs, colorize } from "../../shared/utils.js";

const argv = getArgs(process.argv.slice(2), "2020", "03");

const verbose = argv.v;
const file = argv.f;

// Main function to calculate and display part one
const partOne = (data) => {
  const cleaned = processData(data);
  let next = 0;
  return cleaned.reduce((acc, c) => {
    if (!acc && acc !== 0) acc = 0;
    const res = acc + +(c[next] === "#");
    if (verbose) {
      let cp = [...c];
      const t = cp.splice(next, 1)[0];
      cp.splice(next, 0, t === "#" ? chalk.red("X") : chalk.red("O"));
      cp = cp.map((i) => (i === "#" ? chalk.green("#") : i));
      console.log(cp.join(""));
    }
    next += 3;
    next = next % c.length;
    return res;
  }, 0);
};

// Main function to calculate and display part two
const partTwo = (data) => {
  const cleaned = processData(data);
  const res = [
    [1, 1],
    [3, 1],
    [5, 1],
    [7, 1],
    [1, 2],
  ].map((slope) => {
    let next = 0;
    if (verbose) console.log(`---\nSlope: ${slope}\n---`);
    return cleaned.reduce((acc, c, ci) => {
      if (!acc && acc !== 0) acc = 0;

      if (verbose) {
        let cp = [...c];
        if (ci % slope[1] === 0) {
          const t = cp.splice(next, 1)[0];
          cp.splice(next, 0, t === "#" ? chalk.red("X") : chalk.red("O"));
        }
        cp = cp.map((i) => (i === "#" ? chalk.green("#") : i));
        console.log(cp.join(""));
      }

      if (ci % slope[1] !== 0) return acc;
      const res = acc + +(c[next] === "#");

      next += slope[0];
      next = next % c.length;
      return res;
    }, 0);
  });

  return res.reduce((acc, c) => acc * c, 1);
};

// Read the input data
const processData = (data) =>
  data
    .trim()
    .split("\n")
    .map((n) => n.split(""));

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
