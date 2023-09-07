#!/usr/bin/env node
import fs from "fs";
import process from "process";
import { getArgs, colorize } from "../../shared/utils.js";

const argv = getArgs(process.argv.slice(2), "2022", "09");

const verbose = argv.v;
const file = argv.f;

const isPulled = (head, tail) =>
  Math.abs(head.x - tail.x) > 1 || Math.abs(head.y - tail.y) > 1;

// Main function to calculate and display part one
const partOne = (data) => {
  const cleaned = processData(data);
  const visited = new Set();
  const tail = { x: 0, y: 0 };
  const head = { x: 0, y: 0 };

  cleaned.forEach((ins) => {
    const [dir, dist] = ins;
    for (let i = 0; i < dist; i++) {
      if (dir === "R") {
        head.x++;
        if (isPulled(head, tail)) {
          tail.x = head.x - 1;
          tail.y = head.y;
        }
      }
      if (dir === "L") {
        head.x--;
        if (isPulled(head, tail)) {
          tail.x = head.x + 1;
          tail.y = head.y;
        }
      }
      if (dir === "U") {
        head.y++;
        if (isPulled(head, tail)) {
          tail.y = head.y - 1;
          tail.x = head.x;
        }
      }
      if (dir === "D") {
        head.y--;
        if (isPulled(head, tail)) {
          tail.y = head.y + 1;
          tail.x = head.x;
        }
      }
      visited.add(`${tail.x},${tail.y}`);
    }
  });

  return visited.size;
};

// Main function to calculate and display part two
const partTwo = (data) => {
  const cleaned = processData(data);
  const visited = new Set();

  const rope = [...new Array(10)].map(() => ({ x: 0, y: 0 }));

  cleaned.forEach((ins) => {
    const [dir, dist] = ins;
    console.log(dir, dist);
    for (let i = 0; i < dist; i++) {
      if (dir === "R") {
        rope[0].x++;
        const delta = { x: 0, y: 0 };
        for (let s = 1; s < rope.length; s++) {
          if (isPulled(rope[s - 1], rope[s])) {
            if (
              delta.x !== 0 &&
              delta.y !== 0 &&
              rope[s - 1].x !== rope[s].x &&
              rope[s - 1].y !== rope[s].y
            ) {
              console.log(delta);
              const old = { x: rope[s].x, y: rope[s].y };
              rope[s].x += Math.sign(delta.x);
              rope[s].y += Math.sign(delta.y);
              delta.x = rope[s].x - old.x;
              delta.y = rope[s].y - old.y;
            } else {
              const old = { x: rope[s].x, y: rope[s].y };
              rope[s].x = rope[s - 1].x - 1;
              rope[s].y = rope[s - 1].y;
              delta.x = rope[s].x - old.x;
              delta.y = rope[s].y - old.y;
            }
          }
        }
      }
      if (dir === "L") {
        rope[0].x--;
        const delta = { x: 0, y: 0 };
        for (let s = 1; s < rope.length; s++) {
          if (isPulled(rope[s - 1], rope[s])) {
            if (
              delta.x !== 0 &&
              delta.y !== 0 &&
              rope[s - 1].x !== rope[s].x &&
              rope[s - 1].y !== rope[s].y
            ) {
              console.log(delta);
              const old = { x: rope[s].x, y: rope[s].y };
              rope[s].x += Math.sign(delta.x);
              rope[s].y += Math.sign(delta.y);
              delta.x = rope[s].x - old.x;
              delta.y = rope[s].y - old.y;
            } else {
              const old = { x: rope[s].x, y: rope[s].y };
              rope[s].x = rope[s - 1].x + 1;
              rope[s].y = rope[s - 1].y;
              delta.x = rope[s].x - old.x;
              delta.y = rope[s].y - old.y;
            }
          }
        }
      }
      if (dir === "U") {
        rope[0].y++;
        const delta = { x: 0, y: 0 };
        for (let s = 1; s < rope.length; s++) {
          if (isPulled(rope[s - 1], rope[s])) {
            if (
              delta.x !== 0 &&
              delta.y !== 0 &&
              rope[s - 1].x !== rope[s].x &&
              rope[s - 1].y !== rope[s].y
            ) {
              console.log(delta);
              const old = { x: rope[s].x, y: rope[s].y };
              rope[s].x += Math.sign(delta.x);
              rope[s].y += Math.sign(delta.y);
              delta.x = rope[s].x - old.x;
              delta.y = rope[s].y - old.y;
            } else {
              const old = { x: rope[s].x, y: rope[s].y };
              rope[s].y = rope[s - 1].y - 1;
              rope[s].x = rope[s - 1].x;
              delta.x = rope[s].x - old.x;
              delta.y = rope[s].y - old.y;
            }
          }
        }
      }
      if (dir === "D") {
        rope[0].y--;
        const delta = { x: 0, y: 0 };
        for (let s = 1; s < rope.length; s++) {
          if (isPulled(rope[s - 1], rope[s])) {
            if (
              delta.x !== 0 &&
              delta.y !== 0 &&
              rope[s - 1].x !== rope[s].x &&
              rope[s - 1].y !== rope[s].y
            ) {
              console.log(delta);
              const old = { x: rope[s].x, y: rope[s].y };
              rope[s].x += Math.sign(delta.x);
              rope[s].y += Math.sign(delta.y);
              delta.x = rope[s].x - old.x;
              delta.y = rope[s].y - old.y;
            } else {
              const old = { x: rope[s].x, y: rope[s].y };
              rope[s].y = rope[s - 1].y + 1;
              rope[s].x = rope[s - 1].x;
              delta.x = rope[s].x - old.x;
              delta.y = rope[s].y - old.y;
            }
          }
        }
      }
      console.log(rope.map((s) => `${s.x},${s.y}`).join(" | "));
      visited.add(`${rope[rope.length - 1].x},${rope[rope.length - 1].y}`);
    }
  });

  return visited.size;
};

// Read the input data
const processData = (data) =>
  data
    .trim()
    .split("\n")
    .map((n) => {
      const instructions = n.split(" ");
      const [dir, dist] = instructions;
      return [dir, +dist];
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
