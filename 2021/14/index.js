#!/usr/bin/env node
import fs from "fs";
import process from "process";
import chalk from "chalk";
import { getArgs, colorize } from "../../shared/utils.js";

const argv = getArgs(process.argv.slice(2), "2021", "14");

const verbose = argv.v;
const file = argv.f;

// Main function to calculate and display part one
const partOne = (data) => {
  const cleaned = processData(data);
  const [template, rules] = cleaned;

  console.log(`Starting with template ${chalk.green(template)}`);

  const seqs = [template];
  for (let i = 0; i < 10; i++) {
    let next = "";
    const last = seqs[seqs.length - 1];
    const pairs = [...last.matchAll(/(?=(\w\w))/g)].map((m) => m[1]);
    pairs.forEach((p) => {
      const a = rules.filter((r) => r[0] === p)[0];
      if (!a) return;
      next += `${a[0][0]}${a[1]}`;
    });
    seqs.push(next + last.substring(last.length - 1));
    if (verbose) console.log(`Completed step ${i + 1}`);
  }

  const last = seqs[seqs.length - 1];

  const counts = last.split("").reduce((acc, c) => {
    if (!(c in acc)) {
      acc[c] = 1;
    } else {
      acc[c]++;
    }
    return acc;
  }, {});

  const countsList = Object.keys(counts).map((k) => [counts[k], k]);
  if (verbose) console.log("---\nOverall:");
  if (verbose)
    console.log(colorize(countsList.map((e) => `${e[1]}: ${e[0]}`).join("\n")));
  const most = countsList.reduce(
    (max, c) => {
      if (c[0] > max[0]) {
        max = c;
      }
      return max;
    },
    [0]
  );
  const least = countsList.reduce(
    (min, c) => {
      if (c[0] < min[0]) {
        min = c;
      }
      return min;
    },
    [Infinity]
  );

  const res = most[0] - least[0];
  if (verbose) console.log(colorize(`---\nSolution: ${res}`));
  return res;
};

// Main function to calculate and display part two
const partTwo = (data) => {
  const cleaned = processData(data);
  const [template, rules] = cleaned;

  console.log(`Starting with template ${chalk.green(template)}`);

  const countPairs = (s) => {
    const pairs = [...s.matchAll(/(?=(\w\w))/g)].map((m) => m[1]);
    const next = {};
    pairs.forEach((p) => {
      const a = rules.filter((r) => r[0] === p)[0];
      if (!a) return;
      if (!(a[0] in next)) {
        next[a[0]] = 1;
      } else {
        next[a[0]]++;
      }
    });
    return next;
  };

  const seqs = [countPairs(template)];

  for (let i = 0; i < 40; i++) {
    const last = seqs[seqs.length - 1];
    const pairs = Object.keys(last).map((k) => [k, last[k]]);
    if (verbose) console.log(pairs);
    pairs
      .filter((p) => p[1] !== 0)
      .forEach((p) => {
        const a = rules.filter((r) => r[0] === p[0])[0];
        if (!a) return;
        const p1 = `${a[0][0] + a[1]}`;
        const p2 = `${a[1] + a[0][1]}`;
        if (verbose) console.log({ p1, p2 });
        if (!(p1 in last)) {
          last[p1] = p[1];
        } else {
          last[p1] += p[1];
        }
        if (!(p2 in last)) {
          last[p2] = p[1];
        } else {
          last[p2] += p[1];
        }
        last[a[0]] -= p[1];
      });
    seqs.push(last);
    if (verbose) console.log(`Completed step ${i + 1}`);
  }

  const last = seqs[seqs.length - 1];

  const squash = Object.keys(last).reduce((acc, k) => {
    const [k1, k2] = k.split("");
    // I do not like this
    if (!(k1 in acc)) {
      acc[k1] = last[k] / 2;
    } else {
      acc[k1] += last[k] / 2;
    }
    if (!(k2 in acc)) {
      acc[k2] = last[k] / 2;
    } else {
      acc[k2] += last[k] / 2;
    }

    return acc;
  }, {});

  const squashList = Object.keys(squash).map((k) => [squash[k], k]);

  if (verbose) console.log("---\nOverall:");
  if (verbose)
    console.log(colorize(squashList.map((e) => `${e[1]}: ${e[0]}`).join("\n")));
  const most = squashList.reduce(
    (max, c) => {
      if (c[0] > max[0]) {
        max = c;
      }
      return max;
    },
    [0]
  );
  const least = squashList.reduce(
    (min, c) => {
      if (c[0] < min[0]) {
        min = c;
      }
      return min;
    },
    [Infinity]
  );

  const res = Math.round(most[0] - least[0]); // I do not like this either
  if (verbose) console.log(colorize(`---\nSolution: ${res}`));
  return res;
};

// Read the input data
const processData = (data) => [
  data.split("\n")[0],
  data
    .trim()
    .split("\n")
    .slice(1)
    .filter((n) => n !== "")
    .map((n) => n.split("->").map((t) => t.trim())),
];

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
