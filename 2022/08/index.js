#!/usr/bin/env node
import fs from "fs";
import process from "process";
import { getArgs, colorize } from "../../shared/utils.js";

const argv = getArgs(process.argv.slice(2), "2022", "08");

const verbose = argv.v;
const file = argv.f;

// Main function to calculate and display part one
const partOne = (data) => {
  const cleaned = processData(data);
  let visible = 0;

  for (let r = 0; r < cleaned.length; r++) {
    for (let c = 0; c < cleaned[0].length; c++) {
      if (
        r === 0 ||
        c === 0 ||
        r === cleaned.length - 1 ||
        c === cleaned[0].length - 1
      ) {
        // edge trees are always visible
        visible++;
        continue;
      }

      const col = cleaned.map((r) => r[c]);

      // look left
      const left = cleaned[r].slice(0, c).every((i) => i < cleaned[r][c]);

      // look right
      const right = cleaned[r].slice(c + 1).every((i) => i < cleaned[r][c]);

      // look up
      const up = col.slice(0, r).every((i) => i < cleaned[r][c]);

      // look down
      const down = col.slice(r + 1).every((i) => i < cleaned[r][c]);

      if (left || right || up || down) visible++;
    }
  }

  return visible;
};

// Main function to calculate and display part two
const partTwo = (data) => {
  const cleaned = processData(data);

  const scores = [];

  for (let r = 0; r < cleaned.length; r++) {
    for (let c = 0; c < cleaned[0].length; c++) {
      if (
        r === 0 ||
        c === 0 ||
        r === cleaned.length - 1 ||
        c === cleaned[0].length - 1
      ) {
        // edge trees have a view score of 0
        scores.push(0);
        continue;
      }

      const col = cleaned.map((r) => r[c]);
      const height = cleaned[r][c];

      // look left
      const left = cleaned[r]
        .slice(0, c)
        .reverse()
        .findIndex((i) => i >= height);

      // look right
      const right = cleaned[r].slice(c + 1).findIndex((i) => i >= height);

      // look up
      const up = col
        .slice(0, r)
        .reverse()
        .findIndex((i) => i >= height);

      // look down
      const down = col.slice(r + 1).findIndex((i) => i >= height);

      let ls = 1;
      let rs = 1;
      let us = 1;
      let ds = 1;

      if (left === -1) ls = cleaned[r].slice(0, c).length;
      else ls = left + 1;

      if (right === -1) rs = cleaned[r].slice(c + 1).length;
      else rs = right + 1;

      if (up === -1) us = col.slice(0, r).length;
      else us = up + 1;

      if (down === -1) ds = col.slice(r + 1).length;
      else ds = down + 1;

      scores.push(ls * rs * us * ds);
    }
  }

  return Math.max(...scores);
};

// Read the input data
const processData = (data) =>
  data
    .trim()
    .split("\n")
    .map((n) => n.split("").map((n) => +n));

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
