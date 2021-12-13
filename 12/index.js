#!/usr/bin/env node
import fs from "fs";
import process from "process";
import { getArgs, colorize } from "../shared/utils.js";

const argv = getArgs(process.argv.slice(2), "12");

const verbose = argv.v;
const file = argv.f;

const CaveTypes = {
  Big: 0,
  Small: 1,
};

function Cave(name) {
  this.type = name.toUpperCase() === name ? CaveTypes.Big : CaveTypes.Small;
  this.name = name;

  this.toString = function () {
    return `${this.name}${this.visited ? "(v)" : ""}`;
  };
}

function Tunnel(from, to) {
  this.from = from;
  this.to = to;

  this.toString = function () {
    return `${this.from} <-> ${this.to}`;
  };

  this.includes = function (cave) {
    return this.from.name === cave.name || this.to.name === cave.name;
  };

  this.getOther = function (cave) {
    return this.includes(cave)
      ? [this.from, this.to].filter((c) => c.name !== cave.name)[0]
      : undefined;
  };
}

// Main function to calculate and display part one
const partOne = (data) => {
  const cleaned = processData(data);
  const caves = [];
  const tunnels = [];
  cleaned.forEach(([c1, c2]) => {
    let from = caves.find((c) => c.name === c1);
    let to = caves.find((c) => c.name === c2);

    if (from === undefined) {
      const newCave = new Cave(c1);
      caves.push(newCave);
      from = newCave;
    }
    if (to === undefined) {
      const newCave = new Cave(c2);
      caves.push(newCave);
      to = newCave;
    }
    tunnels.push(new Tunnel(from, to));
  });

  const start = caves.find((c) => c.name === "start");
  if (start === undefined)
    return console.log("No starting cave found in the input.");

  const paths = [];
  const recurse = (cave, path) => {
    const newPath = [...path, cave];
    if (verbose) console.log(`Visited ${cave}`);
    if (cave.name === "end") {
      if (verbose) console.log(`Arrived. | ${newPath.join(",")}`);
      paths.push(newPath);
    } else {
      const search = tunnels.filter((t) => t.includes(cave));
      search.forEach((t) => {
        const other = t.getOther(cave);
        const canVisit = !(
          other.type === CaveTypes.Small && newPath.includes(other)
        );
        if (verbose) console.log({ canVisit }, `${other}`);
        if (canVisit) {
          if (verbose) console.log(`Traversing | ${t} | ${newPath.join(",")}`);
          recurse(other, newPath);
        }
      });
    }
  };

  recurse(start, []);

  if (verbose)
    paths.forEach((p) => {
      console.log(p.join(" -> "));
    });

  const res = paths.length;
  console.log(`Found ${res} unique paths to the end.`);
  return res;
};

// Main function to calculate and display part two
const partTwo = (data) => {
  const cleaned = processData(data);
  const caves = [];
  const tunnels = [];
  cleaned.forEach(([c1, c2]) => {
    let from = caves.find((c) => c.name === c1);
    let to = caves.find((c) => c.name === c2);

    if (from === undefined) {
      const newCave = new Cave(c1);
      caves.push(newCave);
      from = newCave;
    }
    if (to === undefined) {
      const newCave = new Cave(c2);
      caves.push(newCave);
      to = newCave;
    }
    tunnels.push(new Tunnel(from, to));
  });

  const start = caves.find((c) => c.name === "start");
  if (start === undefined)
    return console.log("No starting cave found in the input.");

  const paths = [];
  const recurse = (cave, path) => {
    const newPath = [...path, cave];
    if (verbose) console.log(`Visited ${cave}`);
    if (cave.name === "end") {
      if (verbose) console.log(`Arrived. | ${newPath.join(",")}`);
      paths.push(newPath);
    } else {
      const search = tunnels.filter((t) => t.includes(cave));
      const counts = newPath.reduce((acc, c) => {
        if (c.type !== CaveTypes.Small || c.name === "start") return acc;
        if (!acc[c.name]) {
          acc[c.name] = 1;
        } else {
          acc[c.name]++;
        }
        return acc;
      }, {});
      const m = Math.max(...Object.keys(counts).map((k) => counts[k]));
      search.forEach((t) => {
        const other = t.getOther(cave);
        const canVisit =
          other.name !== "start" &&
          ((other.type === CaveTypes.Small && m < 2) ||
            (other.type === CaveTypes.Small && !counts[other.name]) ||
            other.type !== CaveTypes.Small);
        if (verbose) console.log({ canVisit }, `${other}`);
        if (canVisit) {
          if (verbose) console.log(`Traversing | ${t} | ${newPath.join(",")}`);
          recurse(other, newPath);
        }
      });
    }
  };

  recurse(start, []);

  if (verbose)
    paths.forEach((p) => {
      console.log(p.join(" -> "));
    });

  const res = paths.length;
  console.log(`Found ${res} unique paths to the end.`);
  return res;
};

// Read the input data
const processData = (data) =>
  data
    .trim()
    .split("\n")
    .map((n) => n.split("-"));

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
