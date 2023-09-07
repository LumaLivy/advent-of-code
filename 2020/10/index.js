#!/usr/bin/env node
import fs from "fs";
import process from "process";
import { getArgs, colorize } from "../../shared/utils.js";

const argv = getArgs(process.argv.slice(2), "2020", "10");

const verbose = argv.v;
const file = argv.f;

// Main function to calculate and display part one
const partOne = (data) => {
  const cleaned = processData(data);
  cleaned.sort((a, b) => a - b);
  let last = 0;

  return [0, ...cleaned, cleaned[cleaned.length - 1] + 3]
    .reduce(
      (acc, c) => {
        if (c - last === 1) acc[0]++;
        if (c - last === 3) acc[1]++;
        last = c;
        return acc;
      },
      [0, 0]
    )
    .reduce((a, c) => a * c, 1);
};

// Main function to calculate and display part two
const partTwo = (data) => {
  const cleaned = processData(data);
  cleaned.sort((a, b) => a - b);
  // algo - find length of longest, then shortest
  // number of combos = 2^(long.length - short.length)

  let cursor = 0;
  let window = 4;

  let shortest = [0, 1];
  while (cursor + window < cleaned.length) {
    const sl = cleaned.slice(cursor, cursor + window);

    const short = sl.map((i) => i - sl[0]).map((i) => (i <= 3 ? i : null));
    const shortIndex = short.findIndex((i) => i === Math.max(...short));

    console.log({ sl, short, shortIndex });

    shortest.push(sl[shortIndex]);
    cursor += shortIndex;
  }
  shortest.push(cleaned[cleaned.length - 1], cleaned[cleaned.length - 1] + 3);

  const longest = [0, ...cleaned, cleaned[cleaned.length - 1] + 3];

  console.log(shortest);
  console.log(shortest.length);
  console.log(longest);
  console.log(longest.length);

  console.log(longest.filter((i) => !shortest.includes(i)));

  const res = Math.pow(2, longest.length - shortest.length);
  return res;
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
