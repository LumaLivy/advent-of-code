#!/usr/bin/env node
import fs from "fs";
import process from "process";
import { getArgs, colorize } from "../../shared/utils.js";

const argv = getArgs(process.argv.slice(2), "2020", "05");

const verbose = argv.v;
const file = argv.f;

// Main function to calculate and display part one
const partOne = (data) => {
  const cleaned = processData(data);
  return cleaned.reduce((acc, c) => {
    if (!acc && acc !== 0) acc = 0;

    const [rowId, colId] = c;

    const row = rowId.split("").reduce(
      (rAcc, rCur, rCurInd) => {
        const n = Math.pow(2, 7 - rCurInd - 1);
        if (rCur === "F") rAcc[1] -= n;
        else rAcc[0] += n;
        return rAcc;
      },
      [0, 127]
    )[0];

    const col = colId.split("").reduce(
      (rAcc, rCur, rCurInd) => {
        const n = Math.pow(2, 3 - rCurInd - 1);
        if (rCur === "L") rAcc[1] -= n;
        else rAcc[0] += n;
        return rAcc;
      },
      [0, 7]
    )[1];

    const seatId = row * 8 + col;

    if (verbose) console.log({ c, row, col, seatId });

    return Math.max(acc, seatId);
  }, 0);
};

// Main function to calculate and display part two
const partTwo = (data) => {
  const cleaned = processData(data);
  const seats = cleaned.reduce((acc, c) => {
    if (!acc || !acc.length) acc = [];

    const [rowId, colId] = c;

    const row = rowId.split("").reduce(
      (rAcc, rCur, rCurInd) => {
        const n = Math.pow(2, 7 - rCurInd - 1);
        if (rCur === "F") rAcc[1] -= n;
        else rAcc[0] += n;
        return rAcc;
      },
      [0, 127]
    )[0];

    const col = colId.split("").reduce(
      (rAcc, rCur, rCurInd) => {
        const n = Math.pow(2, 3 - rCurInd - 1);
        if (rCur === "L") rAcc[1] -= n;
        else rAcc[0] += n;
        return rAcc;
      },
      [0, 7]
    )[1];

    const seatId = row * 8 + col;

    if (verbose) console.log({ c, row, col, seatId });

    acc.push(seatId);
    return acc;
  }, []);

  seats.sort((a, b) => a - b);

  const min = seats[0];
  const max = seats[seats.length - 1];

  return [...new Array(max - min)]
    .map((_, i) => min + i)
    .filter((i) => !seats.includes(i))[0];
};

// Read the input data
const processData = (data) =>
  data
    .trim()
    .split("\n")
    .map((n) => [n.slice(0, 7), n.slice(7)]);

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
