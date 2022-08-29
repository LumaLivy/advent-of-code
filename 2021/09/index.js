#!/usr/bin/env node
import fs from "fs";
import process from "process";
import { getArgs, colorize } from "../../shared/utils.js";

const argv = getArgs(process.argv.slice(2), "2021", "09");

const verbose = argv.v;
const file = argv.f;

// Main function to calculate and display part one
const partOne = (data) => {
  const lowPoints = data.reduce((acc, row, y) => {
    const lp = row.reduce((pAcc, p, x) => {
      //              ww  aa  ss  dd
      const around = [10, 10, 10, 10];
      if (y > 0) {
        around[0] = data[y - 1][x];
      }
      if (x > 0) {
        around[1] = data[y][x - 1];
      }
      if (y < data.length - 1) {
        around[2] = data[y + 1][x];
      }
      if (x < row.length - 1) {
        around[3] = data[y][x + 1];
      }
      if (around.every((v) => p < v)) {
        if (verbose)
          console.log(colorize(`[LP] Height: ${p}, (x: ${x}, y: ${y})`));
        pAcc.push(p);
      }
      return pAcc;
    }, []);
    acc.push(...lp);
    return acc;
  }, []);
  const res = lowPoints.reduce((t, c) => t + c + 1, 0);
  return res;
};

// Main function to calculate and display part two
const partTwo = (data) => {
  const basins = [];
  const recurse = ({ x, y }, path) => {
    if (y < 0 || y === data.length || x < 0 || x === data[y].length) return;
    //              ww  aa  ss  dd
    const around = [10, 10, 10, 10];
    if (y > 0) {
      around[0] = data[y - 1][x];
    }
    if (x > 0) {
      around[1] = data[y][x - 1];
    }
    if (y < data.length - 1) {
      around[2] = data[y + 1][x];
    }
    if (x < data[y].length - 1) {
      if (data[y][x] === 9) return recurse({ x: x + 1, y }, []);
      around[3] = data[y][x + 1];
    } else {
      if (y + 1 === data.length) return;
      if (data[y + 1][0] === 9 && y < data.length - 1)
        return recurse({ x: 0, y: y + 1 }, []);
    }

    const nextPath = [...path, { x, y }];

    if (around.every((v) => data[y][x] < v)) {
      const basin = basins.find(({ lp }) => lp.x === x && lp.y === y);
      if (basin === undefined) {
        basins.push({
          lp: { x, y },
          points: path,
        });
      } else {
        nextPath.forEach((p) => {
          if (!basin.points.some((bp) => bp.x === p.x && bp.y === p.y)) {
            basin.points.push(p);
          }
        });
      }
    }

    if (around[0] < data[y][x]) recurse({ x, y: y - 1 }, nextPath);
    if (around[1] < data[y][x]) recurse({ x: x - 1, y }, nextPath);
    if (around[2] < data[y][x]) recurse({ x, y: y + 1 }, nextPath);
    if (around[3] < data[y][x]) recurse({ x: x + 1, y }, nextPath);
  };

  data.forEach((row, y) => {
    row.forEach((col, x) => {
      recurse({ x, y }, []);
    });
  });

  basins.sort(
    (a, b) =>
      b.points.length - a.points.length || a.lp.x - b.lp.x || a.lp.y - b.lp.y
  );

  if (verbose)
    basins.forEach((b) => {
      console.log(
        colorize(
          `Found Basin @ (${b.lp.x}, ${b.lp.y}) with size ${b.points.length}`
        )
      );
    });

  const [b0, b1, b2] = basins;

  return b0.points.length * b1.points.length * b2.points.length;
};

// Read the input data
const processData = (data) =>
  data
    .trim()
    .split("\n")
    .map((l) => l.split("").map((n) => parseInt(n)));

const main = () => {
  fs.readFile(file, "utf8", (err, data) => {
    if (err) return console.log(err);
    const cleaned = processData(data);
    if (verbose) console.log("---\nBeginning calcuation of part one:\n---");
    const res1 = partOne(cleaned, verbose);
    if (verbose) console.log("---\nBeginning calcuation of part two:\n---");
    const res2 = partTwo(cleaned, verbose);

    if (verbose) console.log("---\nResults:\n---");
    console.log("Part One:", res1);
    console.log("Part Two:", res2);
  });
};

if (!argv.h) main();
