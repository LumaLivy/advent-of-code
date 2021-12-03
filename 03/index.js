#!/usr/bin/env node
import fs from "fs";
import process from "process";
import { getArgs, colorize } from "../shared/utils.js";
import chalk from "chalk";

const argv = getArgs(process.argv.slice(2), "03");

const verbose = argv.v;
const file = argv.f;

// Main function to calculate and display part one
const partOne = (data = [], verbose = false) => {
  const res = [...new Array(data[0].length)].map(() => [0, 0]);
  data.forEach((b) => {
    b.split("").forEach((d, i) => {
      res[i][parseInt(d)]++;
    });
  });
  const gamma = res
    .map((d) => (Math.max(d[0], d[1]) === d[1] ? 1 : 0))
    .join("");
  const epsilon = res
    .map((d) => (Math.min(d[0], d[1]) === d[0] ? 0 : 1))
    .join("");

  const gDecimal = parseInt(gamma, 2);
  const eDecimal = parseInt(epsilon, 2);

  if (verbose) console.log("Binary representation (γ,ε):", gamma, epsilon);
  if (verbose) console.log("Decimal representation (γ,ε):", gDecimal, eDecimal);

  return [
    { binary: [gamma, epsilon], decimal: [gDecimal, eDecimal] },
    gDecimal * eDecimal,
  ];
};

// Main function to calculate and display part two
const partTwo = (data = [], verbose = false) => {
  const recurse = (inner, digit, mode) => {
    const [{ binary }] = partOne(inner);
    const [gamma, epsilon] = binary;

    const compare = mode === "gamma" ? gamma : epsilon;

    if (verbose) {
      console.log(
        colorize(
          `Run ${digit}: ${mode} digit: ${compare.substring(
            digit,
            digit + 1
          )} | # Remaining: ${inner.length}`
        )
      );
    }

    // handle exit case
    if (inner.length === 2) {
      let index = 0;
      if (verbose) console.log("---");
      while (digit + index + 1 < inner[0].length) {
        const d0 = inner[0][digit + index];
        const d1 = inner[1][digit + index];

        if (verbose) {
          const sd0 =
            chalk.strikethrough(
              colorize(inner[0].substring(0, digit + index))
            ) +
            chalk.blue(inner[0].substring(digit + index, digit + index + 1)) +
            inner[0].substring(digit + index + 1);
          const sd1 =
            chalk.strikethrough(
              colorize(inner[1].substring(0, digit + index))
            ) +
            chalk.blue(inner[1].substring(digit + index, digit + index + 1)) +
            inner[1].substring(digit + index + 1);
          console.log(
            `${sd0}\nvs (@ digit ${digit + index} +${index})\n${sd1}`
          );
        }

        if (d0 !== d1) break;
        index++;
      }

      const res = inner.filter(
        (b) => b[digit + index] === (mode === "gamma" ? "1" : "0")
      )[0];

      if (verbose) {
        console.log(`${mode} mode, ${res} wins by default.`);
      }

      return res;
    }

    const remaining = inner.filter((bin) => {
      const bit = bin[digit];
      const m = compare[digit];
      const pass = bit === m;
      if (verbose) {
        if (pass) {
          console.log(
            chalk.strikethrough(colorize(bin.substring(0, digit))) +
              chalk.blue(bin.substring(digit, digit + 1)) +
              bin.substring(digit + 1),
            `${chalk.green("passed")}`
          );
        } else {
          console.log(
            chalk.strikethrough(colorize(bin.substring(0, digit))) +
              chalk.strikethrough(chalk.blue(bin.substring(digit, digit + 1))) +
              chalk.strikethrough(bin.substring(digit + 1)),
            `${chalk.red("failed")}`
          );
        }
      }
      return pass;
    });

    if (verbose)
      console.log(
        `${remaining.length}/${inner.length} (${Math.round(
          (remaining.length / inner.length) * 100
        )}%)`,
        "passed in total"
      );

    if (digit + 1 < inner[0].length) {
      return recurse(remaining, digit + 1, mode);
    }
    // in case we finish up with 2 or more numbers (if they are the same numbers)
    console.log("Special exit");
    return remaining[0];
  };

  if (verbose) console.log("---\nCalculating Oxygen rating.\n---");
  const oxygen = recurse(data, 0, "gamma");
  if (verbose) console.log("---\nCalculating CO2 rating.\n---");
  const CO2 = recurse(data, 0, "epsilon");

  const oDecimal = parseInt(oxygen, 2);
  const cDecimal = parseInt(CO2, 2);

  if (verbose)
    console.log(colorize(`Binary representation (O2, CO2): ${oxygen}, ${CO2}`));
  if (verbose)
    console.log(
      colorize(`Decimal representation (O2, CO2): ${oDecimal}, ${cDecimal}`)
    );

  return [
    { binary: [oxygen, CO2], decimal: [oDecimal, cDecimal] },
    oDecimal * cDecimal,
  ];
};

// Read the input data
const processData = (data) => data.trim().split("\n");

const main = () => {
  fs.readFile(file, "utf8", (err, data) => {
    if (err) return console.log(err);
    const cleaned = processData(data);
    if (verbose) console.log("---\nBeginning calcuation of part one:\n---");
    const [, res1] = partOne(cleaned, verbose);
    if (verbose) console.log("---\nBeginning calcuation of part two:\n---");
    const [, res2] = partTwo(cleaned, verbose);

    if (verbose) console.log("---\nResults:\n---");
    console.log("Part One:", res1);
    console.log("Part Two:", res2);
  });
};

if (!argv.h) main();
