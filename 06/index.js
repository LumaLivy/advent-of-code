#!/usr/bin/env node
import fs from "fs";
import process from "process";
import { getArgs } from "../shared/utils.js";

const argv = getArgs(process.argv.slice(2), "06");

const verbose = argv.v;
const file = argv.f;

// Main function to calculate and display part one
const partOne = (data) => {
  const school = [...data];
  for (let i = 0; i < 80; i++) {
    school.forEach((f, fi) => {
      if (f === 0) {
        school[fi] = 6;
        school.push(8);
      } else {
        school[fi]--;
      }
    });
  }
  if (verbose)
    console.log({ original: data.length, now: school.length, days: 80 });
  return school.length;
};

// Main function to calculate and display part two
const partTwo = (data) => {
  // need a different approach, partOne crashes the heap on too many list items
  const school = data.reduce(
    (acc, cur) => {
      acc[cur] += 1;
      return acc;
    },
    [0, 0, 0, 0, 0, 0, 0, 0, 0]
  );
  for (let i = 0; i < 256; i++) {
    const regen = [...school];
    school[0] = regen[1];
    school[1] = regen[2];
    school[2] = regen[3];
    school[3] = regen[4];
    school[4] = regen[5];
    school[5] = regen[6];
    school[6] = regen[7] + regen[0];
    school[7] = regen[8];
    school[8] = regen[0];
  }
  const res = school.reduce((total, cur) => total + cur, 0);
  if (verbose) console.log({ original: data.length, now: res, days: 256 });
  return res;
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
    const cleaned = processData(data)[0];
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
