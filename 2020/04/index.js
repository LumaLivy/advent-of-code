#!/usr/bin/env node
import fs from "fs";
import process from "process";
import { getArgs, colorize } from "../../shared/utils.js";

const argv = getArgs(process.argv.slice(2), "2020", "04");

const verbose = argv.v;
const file = argv.f;

// Main function to calculate and display part one
const partOne = (data) => {
  const cleaned = processData(data);
  return cleaned.reduce(
    (acc, c) =>
      acc +
      +Object.keys(template)
        .filter((k) => k !== "cid")
        .every((k) => c[k] !== null),
    0
  );
};

const validate = (c) => {
  const valuesPresent = Object.keys(template)
    .filter((k) => k !== "cid")
    .every((k) => c[k] !== null);

  if (!valuesPresent) return false;

  const byr = +c.byr >= 1920 && +c.byr <= 2002;
  const iyr = +c.iyr >= 2010 && +c.iyr <= 2020;
  const eyr = +c.eyr >= 2020 && +c.eyr <= 2030;
  const hgt = [
    ["cm", [150, 193]],
    ["in", [59, 76]],
  ].some((m) => {
    const [u, [min, max]] = m;
    if (c.hgt.indexOf(u) === -1) return false;
    const hgtNum = +c.hgt.slice(0, c.hgt.indexOf(u));
    return hgtNum >= min && hgtNum <= max;
  });
  const hcl = !!c.hcl.toLowerCase().match(/^#(?:\d|[a-f]){6}$/);
  const ecl = ["amb", "blu", "brn", "gry", "grn", "hzl", "oth"].includes(c.ecl);
  const pid = !!c.pid.match(/^\d{9}$/);
  return byr && iyr && eyr && hgt && hcl && ecl && pid;
};

// Main function to calculate and display part two
const partTwo = (data) => {
  const cleaned = processData(data);
  return cleaned.reduce((acc, c) => acc + +validate(c), 0);
};

const template = {
  byr: null,
  iyr: null,
  eyr: null,
  hgt: null,
  hcl: null,
  ecl: null,
  pid: null,
  cid: null,
};

// Read the input data
const processData = (data) =>
  data
    .trim()
    .split("\n")
    .map((n) => n)
    .reduce((acc, c) => {
      if (!acc || !acc.length) acc = [{ ...template }];
      if (c === "") acc.push({ ...template });
      else {
        const op = acc[acc.length - 1];
        c.split(" ").map((i) => {
          const [k, v] = i.split(":");
          op[k] = v;
        });
      }
      return acc;
    }, []);

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
