#!/usr/bin/env node
import chalk from "chalk";
import fs from "fs";
import process from "process";
import { getArgs } from "../../shared/utils.js";

const argv = getArgs(process.argv.slice(2), "2021", "11");

const verbose = argv.v;
const file = argv.f;

function octopus(energy, neighbours) {
  this.energy = energy;
  this.neighbours = neighbours;
  this.hasFlashed = false;

  this.flashCount = 0;

  this.flash = function () {
    if (this.energy < 10) return;
    if (!this.hasFlashed) this.flashCount++;
    this.hasFlashed = true;
    this.energy = 0;
    this.neighbours.forEach((o) => {
      if (!o.hasFlashed) o.energy++;
      if (o.energy > 9 && !o.hasFlashed) {
        o.flash();
      }
    });
  };

  this.toString = function () {
    return this.energy === 0
      ? chalk.bold(chalk.blue(this.energy))
      : this.energy;
  };
}

// Main function to calculate and display part one
const partOne = (data) => {
  const [grid, octopi] = processData(data);
  for (let step = 0; step < 100; step++) {
    for (let i = 0; i < octopi.length; i++) {
      const octo = octopi[i];
      octo.hasFlashed = false;
      octo.energy++;
    }
    for (let i = 0; i < octopi.length; i++) {
      const octo = octopi[i];
      octo.flash();
    }

    if (verbose && (step + 1) % 10 === 0) {
      console.log(`Step ${step + 1}`);
      console.log(`${grid.map((r) => r.join("")).join("\n")}`);
      console.log("---");
    }
  }

  const res = octopi.reduce((t, c) => t + c.flashCount, 0);
  console.log(`Octopi flashed ${res} time(s)`);
  return res;
};

// Main function to calculate and display part two
const partTwo = (data) => {
  // 235 too low
  const [grid, octopi] = processData(data);
  let step = 0;
  while (octopi.some((o) => o.energy !== 0)) {
    for (let i = 0; i < octopi.length; i++) {
      const octo = octopi[i];
      octo.hasFlashed = false;
      octo.energy++;
    }
    for (let i = 0; i < octopi.length; i++) {
      const octo = octopi[i];
      octo.flash();
    }

    step++;

    if (verbose) {
      console.log(`After step ${step}`);
      console.log(`${grid.map((r) => r.join("")).join("\n")}`);
      console.log("---");
    }
  }

  console.log(`Octopi synchronized on step ${step}`);
  return step;
};

// Read the input data
const processData = (data) => {
  const grid = data
    .trim()
    .split("\n")
    .map((n) => n.split("").map((e) => new octopus(e, [])));
  // populate neighbours
  grid.forEach((r, y) => {
    r.forEach((o, x) => {
      const upperEdge = y === 0;
      const bottomEdge = y === grid.length - 1;
      const leftEdge = x === 0;
      const rightEdge = x === r.length - 1;

      if (!upperEdge) {
        if (!leftEdge) {
          o.neighbours.push(grid[y - 1][x - 1]);
        }
        o.neighbours.push(grid[y - 1][x]);
        if (!rightEdge) {
          o.neighbours.push(grid[y - 1][x + 1]);
        }
      }
      if (!bottomEdge) {
        if (!leftEdge) {
          o.neighbours.push(grid[y + 1][x - 1]);
        }
        o.neighbours.push(grid[y + 1][x]);
        if (!rightEdge) {
          o.neighbours.push(grid[y + 1][x + 1]);
        }
      }

      if (!leftEdge) {
        o.neighbours.push(grid[y][x - 1]);
      }
      if (!rightEdge) {
        o.neighbours.push(grid[y][x + 1]);
      }
    });
  });

  const octopi = grid.reduce((acc, cur) => {
    acc.push(...cur);
    return acc;
  }, []);

  return [grid, octopi];
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
