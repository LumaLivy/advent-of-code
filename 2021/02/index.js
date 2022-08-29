#!/usr/bin/env node
import fs from "fs";
import process from "process";
import { getArgs, colorize } from "../../shared/utils.js";

const argv = getArgs(process.argv.slice(2), "2021", "02");

const verbose = argv.v;
const file = argv.f;

// Main function to calculate and display part one
const partOne = (directions, verbose) => {
  const position = directions.reduce(
    (xy, current) => {
      const [dir, dist] = current;
      const [x, y] = xy;
      if (verbose)
        console.log(colorize(`Moving ${dir} ${dist} from (${x}, ${y})`));
      switch (dir) {
        case "forward":
          return [x + dist, y];
        case "down":
          return [x, y + dist];
        case "up":
          return [x, y - dist];
      }
    },
    [0, 0]
  );
  return [position, position[0] * position[1]];
};

// Main function to calculate and display part two
const partTwo = (directions, verbose) => {
  const position = directions.reduce(
    (xyAim, current) => {
      const [dir, dist] = current;
      const [x, y, aim] = xyAim;
      const verboseString = (dx, dy, aim) =>
        colorize(
          `${dir} ${dist} | Aim: ${aim} | Moving: (${dx}, ${dy}) from (${x}, ${y})`
        );
      switch (dir) {
        case "forward":
          if (verbose) console.log(verboseString(dist, aim * dist, aim));
          return [x + dist, y + aim * dist, aim];
        case "down":
          if (verbose) console.log(verboseString(0, 0, aim + dist));
          return [x, y, aim + dist];
        case "up":
          if (verbose) console.log(verboseString(0, 0, aim - dist));
          return [x, y, aim - dist];
      }
    },
    [0, 0, 0]
  );
  return [position, position[0] * position[1]];
};

// Read the input data
const processData = (data) =>
  data
    .trim()
    .split("\n")
    .map((n) => {
      const [dir, dist] = n.split(" ").map((w) => w.trim());
      return [dir, parseInt(dist)];
    });

const main = () => {
  fs.readFile(file, "utf8", (err, data) => {
    if (err) return console.log(err);
    const directions = processData(data);
    if (verbose) console.log("---\nBeginning calcuation of part one:\n---");
    const [coords1, res1] = partOne(directions, verbose);
    if (verbose) console.log("---\nBeginning calcuation of part two:\n---");
    const [coords2, res2] = partTwo(directions, verbose);

    if (verbose) console.log("---\nResults:\n---");
    console.log("Part One:\n[x, y] =", coords1, "\nsubmission =", res1);
    console.log("Part Two:\n[x, y, aim] =", coords2, "\nsubmission =", res2);
  });
};

if (!argv.h) main();
