#!/usr/bin/env node
import fs from "fs";
import process from "process";
import { getArgs, colorize } from "../../shared/utils.js";

const argv = getArgs(process.argv.slice(2), "2022", "13");

const verbose = argv.v;
const file = argv.f;

// Main function to calculate and display part one
const partOne = (data) => {
  const cleaned = processData(data);
  console.log(cleaned);

  const compare = (a, b, depth = 0) => {
    const pad = [...new Array(depth * 2)].map(() => " ").join("");

    if (a !== undefined && b !== undefined)
      console.log(
        pad + `- Compare ${JSON.stringify(a)} vs ${JSON.stringify(b)}`
      );

    if (typeof a === "number" && typeof b === "number") {
      //console.log(pad + `- Compare ${a} vs ${b}`);
      if (a < b)
        console.log(
          pad + `- Left side is smaller, so inputs are in the right order`
        );
      if (a > b)
        console.log(
          pad + `- Right side is smaller, so inputs are not in the right order`
        );
      return a < b ? true : a > b ? "fail" : false;
    }

    if (typeof a !== typeof b) {
      if (a === undefined) {
        console.log(
          pad + "- Left side ran out of items, so inputs are in the right order"
        );
        return true;
      }
      if (b === undefined) {
        console.log(
          pad +
            "- Right side ran out of items, so inputs are not in the right order"
        );
        return "fail";
      }
      console.log(pad + `- Mixed types; converting and retrying`);
      if (typeof a === "number") {
        console.log(
          pad + `- Compare ${JSON.stringify([a])} vs ${JSON.stringify(b)}`
        );
        return compare([a], b, depth + 1);
      }
      if (typeof b === "number") {
        console.log(
          pad + `- Compare ${JSON.stringify(a)} vs ${JSON.stringify([b])}`
        );
        return compare(a, [b], depth + 1);
      }
    }

    if (typeof a === "object" && typeof b === "object") {
      let res;
      if (a.length > b.length) {
        res = a.every((ac, aci) => compare(ac, b[aci], depth + 1) !== "fail");
      } else {
        res = b.every((bc, bci) => compare(a[bci], bc, depth + 1) !== "fail");
      }
      return res ? true : "fail";
    }
  };

  const correct = [];

  cleaned.map((pair, pairNum) => {
    const [a, b] = pair;
    console.log(`== Pair ${pairNum + 1} ==`);
    if (compare(a, b) !== "fail") correct.push(pairNum + 1);
  });

  console.log(correct);
};

// Main function to calculate and display part two
const partTwo = (data) => {
  const cleaned = processData(data);
  console.log("Todo");
};

// Read the input data
const processData = (data) => {
  const pairs = [[]];
  data
    .trim()
    .split("\n")
    .map((n) =>
      n ? pairs[pairs.length - 1].push(JSON.parse(n)) : pairs.push([])
    );
  return pairs;
};

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
