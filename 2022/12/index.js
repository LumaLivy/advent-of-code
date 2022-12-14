#!/usr/bin/env node
import chalk from "chalk";
import fs from "fs";
import process from "process";
import { getArgs, colorize } from "../../shared/utils.js";

const argv = getArgs(process.argv.slice(2), "2022", "12");

const verbose = argv.v;
const file = argv.f;

// Main function to calculate and display part one
const partOne = (data) => {
  const cleaned = processData(data);

  const map = cleaned;

  const eMap = "abcdefghijklmnopqrstuvwxyz";

  const startRow = map.findIndex((r) => r.some((n) => n.h === "S"));
  const startColumn = map[startRow].findIndex((n) => n.h === "S");

  const paths = [[map[startRow][startColumn]]];

  const maxX = map[0].length - 1;
  const maxY = map.length - 1;

  const canClimb = (a, b) => {
    const ah = a.h === "S" ? "a" : a.h === "E" ? "z" : a.h;
    const bh = b.h === "S" ? "a" : b.h === "E" ? "z" : b.h;
    const diff = eMap.indexOf(bh) - eMap.indexOf(ah);
    return diff <= 1;
  };

  let sol = 0;

  while (paths.length) {
    const path = paths.shift();
    const tail = path[path.length - 1];

    tail.v = true;

    // left
    if (tail.x > 0 && !map[tail.y][tail.x - 1].v) {
      const left = map[tail.y][tail.x - 1];
      if (canClimb(tail, left)) {
        left.v = true;
        paths.push([...path, left]);
      }
    }

    // right
    if (tail.x < maxX && !map[tail.y][tail.x + 1].v) {
      const right = map[tail.y][tail.x + 1];
      if (canClimb(tail, right)) {
        right.v = true;
        paths.push([...path, right]);
      }
    }

    // up
    if (tail.y > 0 && !map[tail.y - 1][tail.x].v) {
      const up = map[tail.y - 1][tail.x];
      if (canClimb(tail, up)) {
        up.v = true;
        paths.push([...path, up]);
      }
    }

    // down
    if (tail.y < maxY && !map[tail.y + 1][tail.x].v) {
      const down = map[tail.y + 1][tail.x];
      if (canClimb(tail, down)) {
        down.v = true;
        paths.push([...path, down]);
      }
    }

    if (path.some((n) => n.h === "E") || tail.h === "E") {
      sol = path.length - 1;
      break;
    }
  }

  return sol;
};

// Main function to calculate and display part two
const partTwo = (data) => {
  const cleaned = processData(data);

  const map = cleaned;

  const eMap = "abcdefghijklmnopqrstuvwxyz";

  const maxX = map[0].length - 1;
  const maxY = map.length - 1;

  const solutions = [];

  const canClimb = (a, b) => {
    const ah = a.h === "S" ? "a" : a.h === "E" ? "z" : a.h;
    const bh = b.h === "S" ? "a" : b.h === "E" ? "z" : b.h;
    const diff = eMap.indexOf(bh) - eMap.indexOf(ah);
    return diff <= 1;
  };

  const startRow = map.findIndex((r) => r.some((n) => n.h === "S"));
  const startColumn = map[startRow].findIndex((n) => n.h === "S");

  // reset given startpoint from S to a
  map[startRow][startColumn].h = "a";

  const startPoints = map
    .map((r) => r.filter((n) => n.h === "a"))
    .reduce((a, c) => [...a, ...c], []);

  startPoints.forEach((sp) => {
    cleaned.forEach((r) => r.forEach((n) => (n.v = false)));

    let sol = 0;

    const paths = [[sp]];

    while (paths.length) {
      const path = paths.shift();
      const tail = path[path.length - 1];

      tail.v = true;

      // left
      if (tail.x > 0 && !map[tail.y][tail.x - 1].v) {
        const left = map[tail.y][tail.x - 1];
        if (canClimb(tail, left)) {
          left.v = true;
          paths.push([...path, left]);
        }
      }

      // right
      if (tail.x < maxX && !map[tail.y][tail.x + 1].v) {
        const right = map[tail.y][tail.x + 1];
        if (canClimb(tail, right)) {
          right.v = true;
          paths.push([...path, right]);
        }
      }

      // up
      if (tail.y > 0 && !map[tail.y - 1][tail.x].v) {
        const up = map[tail.y - 1][tail.x];
        if (canClimb(tail, up)) {
          up.v = true;
          paths.push([...path, up]);
        }
      }

      // down
      if (tail.y < maxY && !map[tail.y + 1][tail.x].v) {
        const down = map[tail.y + 1][tail.x];
        if (canClimb(tail, down)) {
          down.v = true;
          paths.push([...path, down]);
        }
      }

      if (path.some((n) => n.h === "E") || tail.h === "E") {
        sol = path.length - 1;
        solutions.push(sol);
        break;
      }
    }
  });

  return Math.min(...solutions);
};

// Read the input data
const processData = (data) =>
  data
    .trim()
    .split("\n")
    .map((n, y) => n.split("").map((h, x) => ({ x, y, h, v: false })));

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
