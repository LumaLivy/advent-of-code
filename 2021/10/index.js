#!/usr/bin/env node
import fs from "fs";
import process from "process";
import { getArgs, colorize } from "../../shared/utils.js";

const argv = getArgs(process.argv.slice(2), "2021", "10");

const verbose = argv.v;
const file = argv.f;

const open = ["(", "<", "{", "["];
const close = [")", ">", "}", "]"];
const failureScores = {
  ")": 3,
  "]": 57,
  "}": 1197,
  ">": 25137,
};

const completionScores = {
  ")": 1,
  "]": 2,
  "}": 3,
  ">": 4,
};

// Main function to calculate and display part one
const partOne = (data) => {
  const failures = [];
  data.forEach((l, ln) => {
    const openers = [];
    let failed = false;
    l.forEach((c, cn) => {
      if (failed) return;
      const oi = open.indexOf(c);
      const ci = close.indexOf(c);

      if (oi !== -1) {
        openers.push(c);
        //console.log(openers);
      }
      if (ci !== -1) {
        const latest = openers.pop();
        if (latest !== open[ci]) {
          if (verbose)
            console.log(
              colorize(
                `Found Corruption @ ${ln}:${cn} : Expected ${
                  close[open.indexOf(openers.slice(-1).join(""))]
                }, found ${close[ci]}`
              )
            );
          failures.push(c);
          failed = true;
        }
      }
    });
  });
  console.log("Calculating score...");
  const res = failures.reduce((t, c) => t + failureScores[c], 0);
  console.log(colorize(`Achieved score of ${res}`));
  return res;
};

// Main function to calculate and display part two
const partTwo = (data) => {
  const completions = [];
  data.forEach((l, ln) => {
    const openers = [];
    let failed = false;
    l.forEach((c) => {
      if (failed) return;
      const oi = open.indexOf(c);
      const ci = close.indexOf(c);

      if (oi !== -1) {
        openers.push(c);
      }
      if (ci !== -1) {
        const latest = openers.pop();
        if (latest !== open[ci]) {
          failed = true;
        }
      }
    });

    if (!failed) {
      if (verbose) console.log(colorize(`Found incomplete line @ ${ln}`));
      const completion = openers.reverse().map((c) => close[open.indexOf(c)]);
      completions.push(completion);
      console.log(
        colorize(`Added ${completion.length} characters to close the line.`)
      );
    }
  });
  console.log("Calculating score...");
  const scores = completions
    .map((c) => c.reduce((t, c) => t * 5 + completionScores[c], 0))
    .sort((a, b) => a - b);

  const res = scores[Math.floor(scores.length / 2)];
  console.log(colorize(`Median score of ${res}`));
  return res;
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
