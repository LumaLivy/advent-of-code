#!/usr/bin/env node
import fs from "fs";
import process from "process";
import { getArgs, colorize } from "../../shared/utils.js";

import _ from "underscore";

const argv = getArgs(process.argv.slice(2), "2022", "05");

const verbose = argv.v;
const file = argv.f;

// Main function to calculate and display part one
const partOne = (data) => {
  const cleaned = processData(data);
  const [stacks, moves] = cleaned;

  moves.forEach((m) => {
    stacks[m[2]].unshift(...stacks[m[1]].splice(0, m[0]).reverse());
  });

  return stacks.map((r) => r[0]).join("");
};

// Main function to calculate and display part two
const partTwo = (data) => {
  const cleaned = processData(data);
  const [stacks, moves] = cleaned;

  moves.forEach((m) => {
    stacks[m[2]].unshift(...stacks[m[1]].splice(0, m[0]));
  });

  return stacks.map((r) => r[0]).join("");
};

// Read the input data
const processData = (data) => {
  const stacks = [];
  const moves = [];
  let stacksParsed = false;
  data.split("\n").map((n) => {
    if (n.match(/^\s\d\s/g)) {
      // ensure the array can be transposed correctly
      while (stacks.length < stacks[0].length) {
        stacks.unshift([...new Array(stacks[0].length)].map(() => ""));
      }
      stacksParsed = true;
      return;
    }

    if (!stacksParsed) {
      const res = n.match(/(\s\s\s\s?)|(\[\w\]\s?)/g);

      if (res) {
        stacks.push(res.map((b) => b.trim().replace(/\[|\]/g, "")));
      }
    } else {
      const res = [...n.matchAll(/move (\d+) from (\d+) to (\d+)/g)][0];
      if (res) {
        const op = res.slice(1, 4).map((d) => +d);
        op[1]--;
        op[2]--;
        moves.push(op);
      }
    }
  });
  return [_.unzip(stacks).map((r) => r.filter((c) => c !== "")), moves];
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
