#!/usr/bin/env node
import fs from "fs";
import process from "process";
import { getArgs, colorize } from "../shared/utils.js";

const argv = getArgs(process.argv.slice(2), "13");

const verbose = argv.v;
const file = argv.f;

// Main function to calculate and display part one
const partOne = (data) => {
  const cleaned = processData(data);

  const dots = cleaned.filter((p) => typeof p[0] === "number");
  const folds = cleaned.filter((p) => typeof p[0] !== "number");

  const folded = [dots];

  folds.forEach((f) => {
    const latest = folded[folded.length - 1];
    const [dir, place] = f;
    const next = [];
    if (dir === "x") {
      latest.forEach((d) => {
        let nx = 0;
        let ny = 0;
        if (d[0] < place) {
          nx = d[0];
          ny = d[1];
        } else {
          nx = place - (d[0] - place);
          ny = d[1];
        }
        const exists = next.some((n) => n[0] === nx && n[1] === ny);
        if (!exists) next.push([nx, ny]);
      });
    }
    if (dir === "y") {
      latest.forEach((d) => {
        let nx = 0;
        let ny = 0;
        if (d[1] < place) {
          nx = d[0];
          ny = d[1];
        } else {
          nx = d[0];
          ny = place - (d[1] - place);
        }
        const exists = next.some((n) => n[0] === nx && n[1] === ny);
        if (!exists) next.push([nx, ny]);
      });
    }
    folded.push(next);
  });

  const res = folded[1].length;
  console.log(`${res} dot(s) visible after the first iteration.`);
  return res;
};

// Main function to calculate and display part two
const partTwo = (data) => {
  const cleaned = processData(data);

  const dots = cleaned.filter((p) => typeof p[0] === "number");
  const folds = cleaned.filter((p) => typeof p[0] !== "number");

  const folded = [dots];

  folds.forEach((f) => {
    const latest = folded[folded.length - 1];
    const [dir, place] = f;
    const next = [];
    if (dir === "x") {
      latest.forEach((d) => {
        let nx = 0;
        let ny = 0;
        if (d[0] < place) {
          nx = d[0];
          ny = d[1];
        } else {
          nx = place - (d[0] - place);
          ny = d[1];
        }
        const exists = next.some((n) => n[0] === nx && n[1] === ny);
        if (!exists) next.push([nx, ny]);
      });
    }
    if (dir === "y") {
      latest.forEach((d) => {
        let nx = 0;
        let ny = 0;
        if (d[1] < place) {
          nx = d[0];
          ny = d[1];
        } else {
          nx = d[0];
          ny = place - (d[1] - place);
        }
        const exists = next.some((n) => n[0] === nx && n[1] === ny);
        if (!exists) next.push([nx, ny]);
      });
    }
    folded.push(next);
  });

  const last = folded[folded.length - 1];

  const maxX = last.reduce((m, c) => (c[0] > m ? c[0] : m), 0) + 1;
  const maxY = last.reduce((m, c) => (c[1] > m ? c[1] : m), 0) + 1;

  const grid = [...new Array(maxY)].map((r, y) => {
    return [...new Array(maxX)].map((c, x) => {
      return +last.some((p) => p[0] === x && p[1] === y);
    });
  });

  const secret = grid
    .map((r) => r.join("").replace(/0/g, " ").replace(/1/g, "█"))
    .join("\n");

  if (verbose) console.log(secret);

  return `\n${secret}`;
};

// Read the input data
const processData = (data) =>
  data
    .trim()
    .split("\n")
    .filter((n) => n !== "")
    .map((n) =>
      n.startsWith("fold")
        ? n
            .split(" ")[2]
            .split("=")
            .map((e, ei) => (ei === 1 ? parseInt(e) : e))
        : n.split(",").map((e) => parseInt(e))
    );

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
