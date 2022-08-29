#!/usr/bin/env node
import fs from "fs";
import process from "process";
import chalk from "chalk";
import { getArgs } from "../../shared/utils.js";

const argv = getArgs(process.argv.slice(2), "2021", "04");

const verbose = argv.v;
const file = argv.f;

const transpose = (rows) => rows[0].map((c, i) => rows.map((r) => r[i]));
const sum = (rows) => rows.reduce((acc, cur) => acc + cur, 0);

function Tile(value) {
  this.value = value;
  this.marked = false;

  function toString() {
    const v = this.value.length === 1 ? ` ${this.value}` : this.value;
    return this.marked ? chalk.bold(chalk.blue(v)) : chalk.green(v);
  }

  this.toString = toString;
}

function Board() {
  function addRow(r) {
    this.rows.push(
      r
        .split(" ")
        .map((rv) => new Tile(rv))
        .filter((t) => t.value)
    );
  }

  function mark(value) {
    this.rows.forEach((r) =>
      r.forEach((t) => {
        if (t.value === value) t.marked = true;
      })
    );
  }

  function check() {
    //horizontal
    const horiz = this.rows.some((r) => r.every((t) => t.marked));
    const vert = transpose(this.rows).some((r) => r.every((t) => t.marked));
    return vert || horiz;
  }

  function score(called) {
    return (
      called *
      sum(
        this.rows.map((r) =>
          sum(r.map((t) => (t.marked ? 0 : parseInt(t.value))))
        )
      )
    );
  }

  function toString() {
    return this.rows
      .map((r) => r.map((t) => t.toString()).join(" "))
      .join("\n");
  }

  this.addRow = addRow;
  this.mark = mark;
  this.toString = toString;
  this.score = score;
  this.check = check;
  this.rows = [];
}

// Main function to calculate and display part one
const partOne = (data, verbose) => {
  const queue = data[0].split(",");
  const boards = [new Board()];

  data.slice(1).forEach((r, i) => {
    if (i > 0 && i % 5 === 0) {
      boards.push(new Board());
    }
    const last = boards[boards.length - 1];
    last.addRow(r);
  });

  let won = false;
  let score = -1;
  queue.forEach((n) =>
    boards.forEach((b, bi) => {
      if (won) return;
      b.mark(n);
      won = b.check();
      if (won) {
        score = b.score(parseInt(n));
        if (verbose) console.log(b.toString());
        if (verbose) console.log(`Board ${bi} won! Score: ${score}`);
      }
    })
  );

  return score;
};

// Main function to calculate and display part two
const partTwo = (data, verbose) => {
  const queue = data[0].split(",");
  const boards = [new Board()];

  data.slice(1).forEach((r, i) => {
    if (i > 0 && i % 5 === 0) {
      boards.push(new Board());
    }
    const last = boards[boards.length - 1];
    last.addRow(r);
  });

  let won = false;
  let winners = [];
  let lastScore = -1;
  queue.forEach((n) =>
    boards.forEach((b, bi) => {
      //if (won) return;
      b.mark(n);
      won = b.check();
      if (won && !winners.includes(bi)) {
        lastScore = b.score(parseInt(n));
        if (verbose) console.log(b.toString());
        if (verbose)
          console.log(`Board ${bi} won on ${n}! Score: ${lastScore}`);
        winners.push(bi);
      }
    })
  );

  return lastScore;
};

// Read the input data
const processData = (data) =>
  data
    .trim()
    .split("\n")
    .filter((n) => n !== "");

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
