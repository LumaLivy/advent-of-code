#!/usr/bin/env node
import fs from "fs";
import process from "process";
import { getArgs, colorize } from "../../shared/utils.js";

const argv = getArgs(process.argv.slice(2), "2022", "07");

const verbose = argv.v;
const file = argv.f;

const sum = (arr) => arr.reduce((a, c) => a + c, 0);

function System() {
  this.root = null;
  this.cwd = null;

  this.cd = function (to) {
    if (to === "/") this.cwd = this.root;
    else if (to === "..") this.cwd = this.cwd.parentDirectory;
    else {
      this.cwd = this.cwd.directories.find((d) => d.name === to);
    }
  };
}

function File(name, size) {
  this.name = name;
  this.size = size;

  this.getString = function () {
    return `- ${this.name} (file, size=${this.size})\n`;
  };
}

function Directory(name, parentDirectory) {
  this.name = name;
  this.directories = [];
  this.files = [];
  this.size = 0;

  this.parentDirectory = parentDirectory;

  this.getSize = function () {
    return (
      sum(this.files.map((f) => f.size)) +
      sum(this.directories.map((d) => d.getSize()))
    );
  };

  this.getSizeString = function (depth = 1) {
    let output = `- ${this.name} (dir) (size=${this.getSize()})\n`;
    const pad = [...new Array(depth * 2)].map(() => " ").join("");

    this.directories.forEach((d) => {
      output += pad + d.getSizeString(depth + 1);
      +"\n";
    });

    this.files.forEach((f) => {
      output += pad + f.getString(depth + 1);
      +"\n";
    });
    return output;
  };

  this.getString = function (depth = 1) {
    let output = `- ${this.name} (dir)\n`;
    const pad = [...new Array(depth * 2)].map(() => " ").join("");

    this.directories.forEach((d) => {
      output += pad + d.getString(depth + 1);
      +"\n";
    });

    this.files.forEach((f) => {
      output += pad + f.getString(depth + 1);
      +"\n";
    });
    return output;
  };
}

// Main function to calculate and display part one
const partOne = (data) => {
  const cleaned = processData(data);
  const system = cleaned;
  if (verbose) console.log("Tree of root:");
  if (verbose) console.log(system.root.getString());

  // rather than parsing through the tree,
  // it's probably easier to just print the tree
  // and extract sizes for the final summation
  const rep = system.root
    .getSizeString()
    .split("\n")
    .map((s) => s.trim())
    .filter((s) => s.match(/dir/g));

  return sum(
    rep.map((s) => {
      // extract the file size and count it
      // for the sum if it's less than 100000
      const size = +[...s.matchAll(/size=(\d*)/g)][0][1];
      return size <= 100000 ? size : 0;
    })
  );
};

// Main function to calculate and display part two
const partTwo = (data) => {
  const cleaned = processData(data);
  const system = cleaned;
  if (verbose) console.log("Tree of root:");
  if (verbose) console.log(system.root.getString());

  // See partOne() for reasoning extracting dir sizes
  const rep = system.root
    .getSizeString()
    .split("\n")
    .map((s) => s.trim())
    .filter((s) => s.match(/dir/g))
    .map((s) => +[...s.matchAll(/size=(\d*)/g)][0][1])
    .sort((a, b) => a - b);

  // hardcoded numbers provided by puzzle --
  // 70mb filesystem, 30mb needed for update
  const freeSpace = 70000000 - system.root.getSize();
  const amountToBeFreed = 30000000 - freeSpace;

  return rep.find((r) => r > amountToBeFreed);
};

// Read the input data
const processData = (data) => {
  const system = new System();
  system.root = new Directory("/");
  data
    .trim()
    .split("\n")
    .map((n) => {
      // running a command
      if (n[0] === "$") {
        const [, command, argument] = n.split(" ");
        if (command === "cd") {
          if (verbose) console.log(`cd into ${argument}`);
          system.cd(argument);
        } else if (command === "ls") {
          return;
        }
      } else {
        const info = n.split(" ");
        if (n.match(/dir (.*)/g)) {
          if (verbose) console.log(`creating directory ${info[1]}`);
          system.cwd.directories.push(new Directory(info[1], system.cwd));
        } else if (n.match(/\d* .*/g)) {
          if (verbose) console.log(`creating file ${info[1]}`);
          system.cwd.files.push(new File(info[1], +info[0]));
        }
      }
    });

  return system;
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
