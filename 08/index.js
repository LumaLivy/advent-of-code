#!/usr/bin/env node
import chalk from "chalk";
import fs from "fs";
import process from "process";
import { getArgs, colorize } from "../shared/utils.js";

const argv = getArgs(process.argv.slice(2), "08");

const verbose = argv.v;
const file = argv.f;

// Main function to calculate and display part one
const partOne = (data) => {
  if (verbose) console.log("Easy peasy :)");
  return data.reduce((t, c) => {
    const res = c[1].filter((n) => [2, 3, 4, 7].includes(n.length));
    return t + res.length;
  }, 0);
};

// Main function to calculate and display part two
const partTwo = (data) => {
  const res = data.reduce((total, cur) => {
    const [input, output] = cur;

    // First, we will find what seg A is by taking "7" and removing the segments that are part of 1
    const seven = input.find((n) => n.length === 3);
    const one = input.find((n) => n.length === 2);
    const four = input.find((n) => n.length === 4);
    const eight = input.find((n) => n.length === 7);

    // Now we can find three, because it is the only 5 length number that contains segC and segF (that make up the entirety of number one)
    const twoOrThreeOrFive = input.filter((n) => n.length === 5);
    const three = twoOrThreeOrFive.find((n) => {
      const split = n.split("");
      return one.split("").every((ol) => split.includes(ol));
    });

    // now we know 9 is the only 6 length number that contains all segments of 3, plus one (real segB)
    const zeroOrSixOrNine = input.filter((n) => n.length === 6);
    const nine = zeroOrSixOrNine.find((n) => {
      const split = n.split("");
      return three.split("").every((tl) => split.includes(tl));
    });

    // we can also find real segD by subtracting the segments of 1 from 3, and then finding the intersection of that result with number 4 (segA, *segD*, segG)

    const segD = (() => {
      const oneSplit = one.split("");
      const intermediate = three
        .split("")
        .filter((tl) => !oneSplit.includes(tl));
      const fourSplit = four.split("");
      return fourSplit.find((fl) => intermediate.includes(fl));
    })();

    // now that we know segD, we can find 0 (the only 6 length number without that segment)

    const zero = zeroOrSixOrNine.find(
      (n) => n !== nine && !n.split("").includes(segD)
    );

    // by consequence of finding 0 and 9, we know 6 is the remaining 6 length number
    const six = zeroOrSixOrNine.find((n) => ![zero, nine].includes(n));

    // we can find 5 by subtracting the segments of 1 from 4, and then finding the intersection of that result with one of the numbers in the remaining list
    const twoOrFive = input.filter((n) => n !== three && n.length === 5);
    const five = (() => {
      const oneSplit = one.split("");
      const intermediate = four
        .split("")
        .filter((fl) => !oneSplit.includes(fl));

      return twoOrFive.find((n) =>
        intermediate.every((il) => n.split("").includes(il))
      );
    })();

    // and last but not least, we can find the final number 2
    const two = twoOrFive.find((n) => n !== five);

    const solution = [
      zero,
      one,
      two,
      three,
      four,
      five,
      six,
      seven,
      eight,
      nine,
    ].map(
      // sort the results alphabetically so we can compare easier
      (n) => n.split("").sort().join("")
    );

    // now we just replace the output numbers and sum
    const sum = output
      .map((n) => {
        const s = n.split("").sort().join("");
        const res = solution.indexOf(s);
        if (res === -1) {
          console.log(solution);
          console.log(s);
        }
        return res;
      })
      .join("");
    if (verbose) {
      console.log(`[Input]: ${input.map((s) => chalk.cyan(s))}`);
      console.log(
        `[Solution]:\n${solution
          .map((s, si) => `  ${si}: ${chalk.green(s)}`)
          .join("\n")}`
      );
      console.log(colorize(`[Output] decoded: ${sum}`));
    }
    return total + parseInt(sum);
  }, 0);

  return res;
};

// Read the input data
const processData = (data) =>
  data
    .trim()
    .split("\n")
    .map((n) =>
      n.split("|").map((n) =>
        n
          .split(" ")
          .map((n) => n.trim())
          .filter((n) => n)
      )
    );

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
