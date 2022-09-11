#!/usr/bin/env node
import fs from "fs";
import process from "process";
import { getArgs, colorize } from "../../shared/utils.js";

const argv = getArgs(process.argv.slice(2), "2020", "06");

const verbose = argv.v;
const file = argv.f;

// Main function to calculate and display part one
const partOne = (data) => {
  const cleaned = processData(data);
  return cleaned.reduce((acc, c) => {
    const set = new Set(c.map((i) => i.split("")).flat());
    return acc + set.size;
  }, 0);
};

// Main function to calculate and display part two
const partTwo = (data) => {
  const cleaned = processData(data);
  return cleaned.reduce((acc, c) => {
    const ans = c.map((i) => i.split("")).flat();

    // filter down the answers to only the answers where the number of occurances (ans.filter(...).length) matches the number of people in the group (c.length), then convert to set to only keep the unique letters
    const set = new Set(
      ans.filter((a) => ans.filter((l) => l === a).length === c.length)
    );

    return acc + set.size;
  }, 0);
};

// Read the input data
const processData = (data) =>
  data
    .trim()
    .split("\n")
    .map((n) => n)
    .reduce((acc, c) => {
      if (!acc || !acc.length) acc = [[]];
      if (c === "") acc.push([]);
      else acc[acc.length - 1].push(c);
      return acc;
    }, []);

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
