#!/usr/bin/env node
import fs from "fs";
import process from "process";
import { getArgs, colorize } from "../../shared/utils.js";

const argv = getArgs(process.argv.slice(2), "2020", "07");

const verbose = argv.v;
const file = argv.f;

// Main function to calculate and display part one
const partOne = (data) => {
  const cleaned = processData(data);

  const explore = (rules, bag) => {
    const bags = Object.keys(rules).filter((k) => rules[k].includes(bag));
    return [
      ...bags,
      ...(bags.length ? bags.map((b) => explore(rules, b)) : [bag]),
    ];
  };

  const rules = {};

  cleaned.map((r) => {
    if (!rules[r[0]]) {
      rules[r[0]] = [];
    }
    rules[r[0]] = [
      ...rules[r[0]],
      ...r[1].map((i) => i.split(" ").slice(1).join(" ")),
    ];
  });

  const set = new Set(explore(rules, "shiny gold").flat(Infinity));

  return set.size;
};

// Main function to calculate and display part two
const partTwo = (data) => {
  const cleaned = processData(data);

  const explore = (rules, bag, mult = 1) => {
    const [count, bagName] = bag;
    const bags = rules[bagName].map((b) => explore(rules, b, mult * count));
    return count * mult + bags.reduce((acc, c) => acc + c, 0);
  };

  const rules = {};

  cleaned.map((r) => {
    if (!rules[r[0]]) {
      rules[r[0]] = [];
    }
    rules[r[0]] = [
      ...rules[r[0]],
      ...r[1].map((i) => {
        const split = i.split(" ");
        const count = +split[0];
        const type = split.slice(1).join(" ");

        return [count, type];
      }),
    ];
  });

  return explore(rules, [1, "shiny gold"]) - 1;
};

// Read the input data
const processData = (data) =>
  data
    .trim()
    .split("\n")
    .map((n) => {
      let [[bag], contains] = n.split("contain").map((c) =>
        c
          .replace(/bags/g, "")
          .replace(/bag/g, "")
          .replace(/\./g, "")
          .trim()
          .split(",")
          .map((i) => i.trim())
      );

      if (contains[0] === "no other") contains = [];
      return [bag, contains];
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
