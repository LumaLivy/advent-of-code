#!/usr/bin/env node
import fs from "fs";
import process from "process";
import { getArgs, colorize } from "../../shared/utils.js";

const argv = getArgs(process.argv.slice(2), "2022", "03");

const verbose = argv.v;
const file = argv.f;

const getPriority = (l) =>
  "_abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(l);

const sum = (arr) => arr.reduce((a, c) => a + c, 0);

const chunked = (arr, chunkSize) =>
  arr.reduce((a, c, i) => {
    if (!a) a = [];
    else {
      if (!(i % chunkSize)) a.push([]);
      a[a.length - 1].push(c);
    }
    return a;
  }, []);

// Main function to calculate and display part one
const partOne = (data) => {
  const cleaned = processData(data);
  const shared = cleaned.map(
    (r) => r[0].split("").filter((l) => r[1].indexOf(l) !== -1)[0]
  );
  return sum(shared.map((l) => getPriority(l)));
};

// Main function to calculate and display part two
const partTwo = (data) => {
  const cleaned = processData(data);
  const grouped = chunked(
    cleaned.map((r) => r.join("")),
    3
  );
  const shared = grouped.map(
    (r) =>
      r[0]
        .split("")
        .filter((l) => r[1].indexOf(l) !== -1 && r[2].indexOf(l) !== -1)[0]
  );
  return sum(shared.map((l) => getPriority(l)));
};

// Read the input data
const processData = (data) =>
  data
    .trim()
    .split("\n")
    .map((n) => [n.slice(0, n.length / 2), n.slice(n.length / 2)]);

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
