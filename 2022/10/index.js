#!/usr/bin/env node
import fs from "fs";
import process from "process";
import { getArgs, colorize } from "../../shared/utils.js";
import chalk from "chalk";

const argv = getArgs(process.argv.slice(2), "2022", "10");

const verbose = argv.v;
const file = argv.f;

// Main function to calculate and display part one
const partOne = (data) => {
  const cleaned = processData(data);
  let x = 1;

  let values = [];

  cleaned.forEach((ins) => {
    const [op, value] = ins;
    const cycles = op === "noop" ? 1 : 2;
    for (let i = 0; i < cycles; i++) {
      values.push(x);
      if (i === 1) x += value;
    }
  });

  console.log(
    values[19],
    values[59],
    values[99],
    values[139],
    values[179],
    values[219]
  );

  return (
    20 * values[19] +
    60 * values[59] +
    100 * values[99] +
    140 * values[139] +
    180 * values[179] +
    220 * values[219]
  );
};

// Main function to calculate and display part two
const partTwo = (data) => {
  const cleaned = processData(data);
  let x = 1;

  const values = [];

  const screen = [];

  let line = "";

  cleaned.forEach((ins) => {
    const [op, value] = ins;
    const cycles = op === "noop" ? 1 : 2;
    for (let i = 0; i < cycles; i++) {
      line += [x - 1, x, x + 1].includes(line.length) ? "#" : ".";
      values.push(x);
      if (i === 1) x += value;
      if (line.length === 40) {
        screen.push(line);
        line = "";
      }
    }
  });
  return `\n${screen.join("\n")}`
    .replace(/#/g, chalk.red("#"))
    .replace(/\./g, chalk.green("."));
};

// Read the input data
const processData = (data) =>
  data
    .trim()
    .split("\n")
    .map((n) => {
      const ins = n.split(" ");
      if (ins.length === 2) {
        ins[1] = +ins[1];
      }
      return ins;
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
