#!/usr/bin/env node
import fs from "fs";
import process from "process";
import { getArgs, colorize } from "../../shared/utils.js";

import path from "ngraph.path";
import graph from "ngraph.graph";

const argv = getArgs(process.argv.slice(2), "2021", "15");

const verbose = argv.v;
const file = argv.f;

// Main function to calculate and display part one
const partOne = (data) => {
  const cleaned = processData(data);

  const grid = graph();

  cleaned.forEach((r, y) => {
    r.forEach((v, x) => {
      grid.addNode(`${x}.${y}`, v);
    });
  });

  grid.forEachNode((n) => {
    const [x, y] = n.id.split(".").map((n) => parseInt(n));
    if (x < cleaned[0].length - 1) {
      grid.addLink(n.id, `${x + 1}.${y}`, { weight: cleaned[y][x + 1] });
    }
    if (y < cleaned.length - 1) {
      grid.addLink(n.id, `${x}.${y + 1}`, { weight: cleaned[y + 1][x] });
    }
    if (x > 0) {
      grid.addLink(n.id, `${x - 1}.${y}`, { weight: cleaned[y][x - 1] });
    }
    if (y > 0) {
      grid.addLink(n.id, `${x}.${y - 1}`, { weight: cleaned[y - 1][x] });
    }
  });

  const aStar = path.aStar(grid, {
    distance(f, t) {
      return t.data;
    },
  });

  const res = aStar
    .find("0.0", `${cleaned[0].length - 1}.${cleaned.length - 1}`)
    .reverse()
    .slice(1)
    .reduce((t, c) => {
      if (!c.data) return t;
      return t + c.data;
    }, 0);

  console.log(colorize(`Shortest path found with cost: ${res}`));

  return res;
};

// Main function to calculate and display part two
const partTwo = (data) => {
  const orig = processData(data);

  const grid = graph();

  const ow = orig[0].length;
  const oh = orig.length;

  const w = orig[0].length * 5;
  const h = orig.length * 5;

  const cleaned = [...new Array(h)].map(() => [...new Array(w)]);

  for (let yi = 0; yi < 5; yi++) {
    for (let xi = 0; xi < 5; xi++) {
      orig.forEach((r, y) => {
        r.forEach((v, x) => {
          const nv = (v + 1 * (xi + yi)) % 10;
          cleaned[y + oh * yi][x + ow * xi] = nv < v ? 1 + nv : nv;
        });
      });
    }
  }

  cleaned.forEach((r, y) => {
    r.forEach((v, x) => {
      grid.addNode(`${x}.${y}`, v);
    });
  });

  grid.forEachNode((n) => {
    const [x, y] = n.id.split(".").map((n) => parseInt(n));
    if (x < cleaned[0].length - 1) {
      grid.addLink(n.id, `${x + 1}.${y}`, { weight: cleaned[y][x + 1] });
    }
    if (y < cleaned.length - 1) {
      grid.addLink(n.id, `${x}.${y + 1}`, { weight: cleaned[y + 1][x] });
    }
    if (x > 0) {
      grid.addLink(n.id, `${x - 1}.${y}`, { weight: cleaned[y][x - 1] });
    }
    if (y > 0) {
      grid.addLink(n.id, `${x}.${y - 1}`, { weight: cleaned[y - 1][x] });
    }
  });

  const aStar = path.aStar(grid, {
    distance(f, t) {
      return t.data;
    },
  });

  const res = aStar
    .find("0.0", `${cleaned[0].length - 1}.${cleaned.length - 1}`)
    .reverse()
    .slice(1)
    .reduce((t, c) => {
      if (!c.data) return t;
      return t + c.data;
    }, 0);

  console.log(colorize(`Shortest path found with cost: ${res}`));

  return res;
};

// Read the input data
const processData = (data) =>
  data
    .trim()
    .split("\n")
    .map((n) => n.split("").map((n) => parseInt(n)));

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
